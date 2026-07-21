import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync } from 'node:fs'
import Razorpay from 'razorpay'
import QRCode from 'qrcode'
import {
  insertOrder,
  getOrderById,
  getAllOrders,
  attachRazorpayOrder,
  markPaid,
} from './db.js'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const UPI_ID = process.env.UPI_ID || ''
const UPI_PAYEE_NAME = process.env.UPI_PAYEE_NAME || 'Crisp & Care'

// Razorpay is optional: only enabled when both keys are present.
const razorpayEnabled = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
const razorpay = razorpayEnabled
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null

// --- Server-side price list (source of truth; never trust the client's totals) ---
const PRICES = {
  saree: 60,
  'saree-premium': 120,
  suit: 100,
  blazer: 80,
  shirt: 25,
  trouser: 30,
  kurta: 35,
  regular: 15,
}

function computeAmount(items) {
  if (!Array.isArray(items)) return 0
  return items.reduce((sum, it) => {
    const unit = PRICES[it.key] || 0
    const qty = Math.max(0, parseInt(it.qty, 10) || 0)
    return sum + unit * qty
  }, 0)
}

// --- Public config the frontend needs (safe values only) ---
app.get('/api/config', (req, res) => {
  res.json({
    razorpayEnabled,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || null,
    upiConfigured: Boolean(UPI_ID),
    prices: PRICES,
  })
})

// --- Create an order (stores customer details in the DB) ---
app.post('/api/order', async (req, res) => {
  try {
    const {
      customer_name,
      phone,
      address,
      items,
      pickup_slot,
      payment_method,
      notes,
    } = req.body || {}

    if (!customer_name || !phone || !address) {
      return res.status(400).json({ error: 'Name, phone and address are required.' })
    }
    if (!/^[0-9+\-\s]{7,15}$/.test(String(phone))) {
      return res.status(400).json({ error: 'Please enter a valid phone number.' })
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Please add at least one garment.' })
    }
    const amount = computeAmount(items)
    if (amount <= 0) {
      return res.status(400).json({ error: 'Order total must be greater than zero.' })
    }
    const method = ['razorpay', 'upi', 'cod'].includes(payment_method) ? payment_method : 'cod'

    const info = await insertOrder({
      created_at: new Date().toISOString(),
      customer_name: String(customer_name).slice(0, 120),
      phone: String(phone).slice(0, 20),
      address: String(address).slice(0, 500),
      items: JSON.stringify(items),
      pickup_slot: pickup_slot ? String(pickup_slot).slice(0, 120) : null,
      amount,
      payment_method: method,
      payment_status: 'pending',
      notes: notes ? String(notes).slice(0, 500) : null,
    })

    const orderId = info.lastInsertRowid

    // Build a UPI QR for the UPI option.
    let upiQr = null
    let upiUri = null
    if (UPI_ID) {
      upiUri =
        `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
        `&pn=${encodeURIComponent(UPI_PAYEE_NAME)}` +
        `&am=${amount}&cu=INR` +
        `&tn=${encodeURIComponent('Order #' + orderId + ' Crisp & Care')}`
      upiQr = await QRCode.toDataURL(upiUri, { margin: 1, width: 320 })
    }

    res.json({ orderId, amount, upiQr, upiUri, upiId: UPI_ID })
  } catch (err) {
    console.error('POST /api/order failed:', err)
    res.status(500).json({ error: 'Could not save your order. Please try again.' })
  }
})

// --- Create a Razorpay order for an existing DB order ---
app.post('/api/razorpay/order', async (req, res) => {
  try {
    if (!razorpayEnabled) {
      return res.status(400).json({ error: 'Online card/UPI checkout is not configured yet.' })
    }
    const { orderId } = req.body || {}
    const order = await getOrderById(orderId)
    if (!order) return res.status(404).json({ error: 'Order not found.' })

    const rzpOrder = await razorpay.orders.create({
      amount: order.amount * 100, // paise
      currency: 'INR',
      receipt: `order_${orderId}`,
    })
    await attachRazorpayOrder({ id: orderId, razorpay_order_id: rzpOrder.id })

    res.json({
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('POST /api/razorpay/order failed:', err)
    res.status(500).json({ error: 'Could not start online payment.' })
  }
})

// --- Verify a Razorpay payment signature and mark the order paid ---
app.post('/api/razorpay/verify', async (req, res) => {
  try {
    if (!razorpayEnabled) return res.status(400).json({ error: 'Razorpay not configured.' })
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {}

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed.' })
    }
    await markPaid({ id: orderId, razorpay_payment_id })
    res.json({ ok: true })
  } catch (err) {
    console.error('POST /api/razorpay/verify failed:', err)
    res.status(500).json({ error: 'Verification error.' })
  }
})

// --- Admin: list all orders (password-gated) ---
app.get('/api/admin/orders', async (req, res) => {
  const pass = req.get('x-admin-password')
  if (pass !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const rows = (await getAllOrders()).map((r) => ({ ...r, items: safeParse(r.items) }))
  res.json({ orders: rows })
})

function safeParse(s) {
  try {
    return JSON.parse(s)
  } catch {
    return []
  }
}

// --- In production, serve the built React app (dist/) from this same server ---
// This makes the whole thing ONE deployable service: the API and the website
// live at the same address, so the frontend's relative /api/* calls just work.
const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
if (existsSync(distDir)) {
  app.use(express.static(distDir))
  // Any non-API route falls back to index.html so React Router can handle it.
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(join(distDir, 'index.html'))
  })
  console.log('[web] serving built site from dist/')
}

app.listen(PORT, () => {
  console.log(`[api] Crisp & Care backend running on http://localhost:${PORT}`)
  console.log(`[api] Razorpay ${razorpayEnabled ? 'ENABLED' : 'disabled (UPI/COD only)'} · UPI ${UPI_ID ? 'configured' : 'not set'}`)
})
