import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Minus, Plus, ShoppingBag, CreditCard, QrCode, Banknote,
  CheckCircle2, Loader2, ArrowRight, ShieldCheck,
} from 'lucide-react'
import { BRAND, PRICE_LIST } from '../brand.js'

const PAYMENT_OPTIONS = [
  { key: 'razorpay', label: 'Pay online', desc: 'UPI, cards, netbanking', icon: CreditCard },
  { key: 'upi', label: 'UPI QR', desc: 'Scan & pay with any UPI app', icon: QrCode },
  { key: 'cod', label: 'Pay on delivery', desc: 'Cash / UPI when we deliver', icon: Banknote },
]

export default function Order() {
  const [qtys, setQtys] = useState({})
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', pickup_slot: '', notes: '' })
  const [method, setMethod] = useState('razorpay')
  const [config, setConfig] = useState({ razorpayEnabled: false })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [error, setError] = useState('')
  const [result, setResult] = useState(null) // { orderId, amount, upiQr, upiId }

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((c) => {
        setConfig(c)
        // Default to a working method if Razorpay isn't configured.
        if (!c.razorpayEnabled) setMethod(c.upiConfigured ? 'upi' : 'cod')
      })
      .catch(() => {})
  }, [])

  const items = useMemo(
    () =>
      PRICE_LIST.filter((p) => qtys[p.key] > 0).map((p) => ({
        key: p.key,
        label: p.label,
        qty: qtys[p.key],
        price: p.price,
      })),
    [qtys],
  )
  const total = items.reduce((s, it) => s + it.price * it.qty, 0)
  const totalCount = items.reduce((s, it) => s + it.qty, 0)

  const setQty = (key, delta) =>
    setQtys((q) => ({ ...q, [key]: Math.max(0, (q[key] || 0) + delta) }))

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function loadRazorpay(orderId, amount) {
    const r = await fetch('/api/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })
    const data = await r.json()
    if (!r.ok) throw new Error(data.error || 'Could not start payment')

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: BRAND.name,
        description: `Order #${orderId}`,
        prefill: { name: form.customer_name, contact: form.phone },
        theme: { color: '#5B3A5B' },
        handler: async (resp) => {
          const v = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, ...resp }),
          })
          if (v.ok) resolve('paid')
          else reject(new Error('Payment could not be verified'))
        },
        modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
      })
      rzp.open()
    })
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (items.length === 0) return setError('Please add at least one garment.')
    setStatus('submitting')
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items, payment_method: method }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not place order')

      if (method === 'razorpay') {
        await loadRazorpay(data.orderId, data.amount)
      }
      setResult(data)
      setStatus('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  if (status === 'success' && result) {
    return <SuccessView result={result} method={method} />
  }

  return (
    <div className="bg-background pt-28 pb-24">
      <div className="container-x">
        <div className="max-w-2xl">
          <span className="eyebrow">Book a pickup</span>
          <h1 className="mt-3 font-display text-4xl font-600 text-ink sm:text-5xl">Place your order</h1>
          <p className="mt-4 text-lg text-muted">
            Add your garments, share where to collect them, and choose how you&rsquo;d like to pay.
          </p>
        </div>

        <form onSubmit={submit} className="mt-12 grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
          {/* Left: garments + details */}
          <div className="space-y-8">
            {/* Garments */}
            <section className="card p-6 sm:p-8">
              <h2 className="flex items-center gap-2 font-display text-2xl font-600 text-ink">
                <ShoppingBag size={22} className="text-primary-dark" /> Your garments
              </h2>
              <div className="mt-6 divide-y divide-divider">
                {PRICE_LIST.map((p) => (
                  <div key={p.key} className="flex items-center justify-between gap-4 py-3.5">
                    <div>
                      <p className="font-medium text-ink">{p.label}</p>
                      <p className="text-sm text-muted">₹{p.price} / piece</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setQty(p.key, -1)}
                        className="grid h-9 w-9 place-items-center rounded-full border border-divider text-ink transition hover:border-accent hover:bg-accent hover:text-white disabled:opacity-40"
                        disabled={!qtys[p.key]} aria-label={`Remove ${p.label}`}>
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center font-mono text-ink">{qtys[p.key] || 0}</span>
                      <button type="button" onClick={() => setQty(p.key, 1)}
                        className="grid h-9 w-9 place-items-center rounded-full border border-divider text-ink transition hover:border-accent hover:bg-accent hover:text-white"
                        aria-label={`Add ${p.label}`}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Details */}
            <section className="card p-6 sm:p-8">
              <h2 className="font-display text-2xl font-600 text-ink">Pickup details</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required>
                  <input required value={form.customer_name} onChange={(e) => update('customer_name', e.target.value)}
                    className="input" placeholder="Your name" />
                </Field>
                <Field label="Phone / WhatsApp" required>
                  <input required value={form.phone} onChange={(e) => update('phone', e.target.value)}
                    className="input" placeholder="10-digit number" />
                </Field>
                <Field label="Pickup address" required className="sm:col-span-2">
                  <textarea required value={form.address} onChange={(e) => update('address', e.target.value)}
                    className="input min-h-[84px] resize-y" placeholder="House / flat, street, area, landmark" />
                </Field>
                <Field label="Preferred pickup slot">
                  <select value={form.pickup_slot} onChange={(e) => update('pickup_slot', e.target.value)} className="input">
                    <option value="">Any time</option>
                    <option>Today · Morning (8–11am)</option>
                    <option>Today · Evening (5–8pm)</option>
                    <option>Tomorrow · Morning (8–11am)</option>
                    <option>Tomorrow · Evening (5–8pm)</option>
                  </select>
                </Field>
                <Field label="Notes (optional)">
                  <input value={form.notes} onChange={(e) => update('notes', e.target.value)}
                    className="input" placeholder="Any special instructions" />
                </Field>
              </div>
            </section>
          </div>

          {/* Right: summary + payment */}
          <aside className="card sticky top-24 p-6 sm:p-8">
            <h2 className="font-display text-2xl font-600 text-ink">Summary</h2>
            {items.length === 0 ? (
              <p className="mt-4 text-sm text-muted">No garments added yet.</p>
            ) : (
              <ul className="mt-4 space-y-2 text-sm">
                {items.map((it) => (
                  <li key={it.key} className="flex justify-between text-muted">
                    <span>{it.label} × {it.qty}</span>
                    <span className="text-ink">₹{it.price * it.qty}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-divider pt-4">
              <span className="text-muted">Total ({totalCount} items)</span>
              <span className="font-display text-2xl font-600 text-ink">₹{total}</span>
            </div>

            {/* Payment method */}
            <h3 className="mt-6 font-medium text-ink">Payment method</h3>
            <div className="mt-3 space-y-2.5">
              {PAYMENT_OPTIONS.map((opt) => {
                const disabled = opt.key === 'razorpay' && !config.razorpayEnabled
                return (
                  <label key={opt.key}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition ${
                      method === opt.key ? 'border-primary bg-primary/5' : 'border-divider hover:border-accent/40'
                    } ${disabled ? 'cursor-not-allowed opacity-45' : ''}`}>
                    <input type="radio" name="method" value={opt.key} checked={method === opt.key}
                      disabled={disabled} onChange={() => setMethod(opt.key)} className="accent-primary" />
                    <opt.icon size={20} className="text-accent" />
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-ink">{opt.label}</span>
                      <span className="block text-xs text-muted">
                        {disabled ? 'Add Razorpay keys to enable' : opt.desc}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>

            {error && <p className="mt-4 rounded-xl bg-blush/10 px-4 py-2.5 text-sm text-blush">{error}</p>}

            <button type="submit" disabled={status === 'submitting' || total === 0} className="btn-primary mt-6 w-full disabled:opacity-50">
              {status === 'submitting' ? <><Loader2 size={18} className="animate-spin" /> Processing…</> : <>Confirm order · ₹{total} <ArrowRight size={18} /></>}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
              <ShieldCheck size={13} /> Your details are stored securely for this order only.
            </p>
          </aside>
        </form>
      </div>

      <style>{`.input{width:100%;border:1px solid #EAE1D2;border-radius:0.9rem;padding:0.7rem 0.9rem;background:#fff;color:#241F2E;outline:none;transition:border-color .2s,box-shadow .2s}.input:focus{border-color:#C08A34;box-shadow:0 0 0 3px rgba(192,138,52,.15)}`}</style>
    </div>
  )
}

function Field({ label, required, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label} {required && <span className="text-blush">*</span>}
      </span>
      {children}
    </label>
  )
}

function SuccessView({ result, method }) {
  return (
    <div className="bg-background pt-32 pb-24">
      <div className="container-x max-w-xl text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-steam/15 text-steam">
          <CheckCircle2 size={44} />
        </div>
        <h1 className="mt-6 font-display text-4xl font-600 text-ink">Order confirmed!</h1>
        <p className="mt-3 text-muted">
          Your order <span className="font-mono font-medium text-ink">#{result.orderId}</span> is booked for ₹{result.amount}.
          {method === 'cod' && ' Pay on delivery — we’ll be in touch to confirm your pickup slot.'}
          {method === 'razorpay' && ' Payment received. We’ll collect your garments shortly.'}
        </p>

        {method === 'upi' && result.upiQr && (
          <div className="card mt-8 p-8">
            <h2 className="font-display text-xl font-600 text-ink">Scan to pay ₹{result.amount}</h2>
            <img src={result.upiQr} alt="UPI QR code" className="mx-auto mt-4 h-56 w-56" />
            <p className="mt-3 text-sm text-muted">
              Pay to <span className="font-medium text-ink">{result.upiId}</span> using any UPI app,
              then keep the reference for your records. We&rsquo;ll confirm on pickup.
            </p>
          </div>
        )}

        <Link to="/" className="btn-ghost mt-8">Back to home</Link>
      </div>
    </div>
  )
}
