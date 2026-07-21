// Dual database driver.
//
//  • Local development  → SQLite file at server/data/app.db (no setup, works offline).
//  • Production (Render)→ Postgres, automatically, whenever DATABASE_URL is set.
//
// Both drivers expose the SAME async interface, so nothing else in the app has to
// know or care which one is running:
//
//    insertOrder(data)                       -> { lastInsertRowid }
//    getOrderById(id)                        -> row | undefined
//    getAllOrders()                          -> row[]
//    attachRazorpayOrder({ id, razorpay_order_id })
//    markPaid({ id, razorpay_payment_id })

const usePostgres = Boolean(process.env.DATABASE_URL)

const impl = usePostgres ? await makePostgres() : await makeSqlite()

export const insertOrder = impl.insertOrder
export const getOrderById = impl.getOrderById
export const getAllOrders = impl.getAllOrders
export const attachRazorpayOrder = impl.attachRazorpayOrder
export const markPaid = impl.markPaid

console.log(`[db] using ${usePostgres ? 'Postgres (DATABASE_URL)' : 'SQLite (local file)'}`)

// ---------------------------------------------------------------------------
// Postgres (production) — persistent, survives redeploys.
// ---------------------------------------------------------------------------
async function makePostgres() {
  const { default: pg } = await import('pg')
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    // Managed Postgres (Neon, Render, etc.) requires SSL.
    ssl: { rejectUnauthorized: false },
  })

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id                  BIGSERIAL PRIMARY KEY,
      created_at          TEXT    NOT NULL,
      customer_name       TEXT    NOT NULL,
      phone               TEXT    NOT NULL,
      address             TEXT    NOT NULL,
      items               TEXT    NOT NULL,
      pickup_slot         TEXT,
      amount              INTEGER NOT NULL,
      payment_method      TEXT    NOT NULL,
      payment_status      TEXT    NOT NULL DEFAULT 'pending',
      razorpay_order_id   TEXT,
      razorpay_payment_id TEXT,
      notes               TEXT
    );
  `)

  return {
    async insertOrder(d) {
      const { rows } = await pool.query(
        `INSERT INTO orders
           (created_at, customer_name, phone, address, items, pickup_slot, amount, payment_method, payment_status, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING id`,
        [d.created_at, d.customer_name, d.phone, d.address, d.items, d.pickup_slot, d.amount, d.payment_method, d.payment_status, d.notes],
      )
      return { lastInsertRowid: rows[0].id }
    },
    async getOrderById(id) {
      const { rows } = await pool.query(`SELECT * FROM orders WHERE id = $1`, [id])
      return rows[0]
    },
    async getAllOrders() {
      const { rows } = await pool.query(`SELECT * FROM orders ORDER BY id DESC`)
      return rows
    },
    async attachRazorpayOrder({ id, razorpay_order_id }) {
      await pool.query(`UPDATE orders SET razorpay_order_id = $1 WHERE id = $2`, [razorpay_order_id, id])
    },
    async markPaid({ id, razorpay_payment_id }) {
      await pool.query(
        `UPDATE orders SET payment_status = 'paid', razorpay_payment_id = $1 WHERE id = $2`,
        [razorpay_payment_id, id],
      )
    },
  }
}

// ---------------------------------------------------------------------------
// SQLite (local development) — a single file, zero setup, works offline.
// ---------------------------------------------------------------------------
async function makeSqlite() {
  let Database
  try {
    Database = (await import('better-sqlite3')).default
  } catch (err) {
    throw new Error(
      'DATABASE_URL is not set, so the app tried to use the local SQLite database — ' +
        'but the better-sqlite3 driver is not installed in this environment. ' +
        'In production (e.g. Render), set the DATABASE_URL environment variable to your ' +
        'Postgres connection string (from Neon), then redeploy. Original error: ' + err.message,
    )
  }
  const { fileURLToPath } = await import('node:url')
  const { dirname, join } = await import('node:path')
  const { mkdirSync } = await import('node:fs')

  const dir = dirname(fileURLToPath(import.meta.url))
  const dataDir = join(dir, 'data')
  mkdirSync(dataDir, { recursive: true })

  const db = new Database(join(dataDir, 'app.db'))
  db.pragma('journal_mode = WAL')

  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at          TEXT    NOT NULL,
      customer_name       TEXT    NOT NULL,
      phone               TEXT    NOT NULL,
      address             TEXT    NOT NULL,
      items               TEXT    NOT NULL,
      pickup_slot         TEXT,
      amount              INTEGER NOT NULL,
      payment_method      TEXT    NOT NULL,
      payment_status      TEXT    NOT NULL DEFAULT 'pending',
      razorpay_order_id   TEXT,
      razorpay_payment_id TEXT,
      notes               TEXT
    );
  `)

  const _insert = db.prepare(`
    INSERT INTO orders
      (created_at, customer_name, phone, address, items, pickup_slot, amount, payment_method, payment_status, notes)
    VALUES
      (@created_at, @customer_name, @phone, @address, @items, @pickup_slot, @amount, @payment_method, @payment_status, @notes)
  `)
  const _getById = db.prepare(`SELECT * FROM orders WHERE id = ?`)
  const _getAll = db.prepare(`SELECT * FROM orders ORDER BY id DESC`)
  const _attach = db.prepare(`UPDATE orders SET razorpay_order_id = @razorpay_order_id WHERE id = @id`)
  const _paid = db.prepare(`UPDATE orders SET payment_status = 'paid', razorpay_payment_id = @razorpay_payment_id WHERE id = @id`)

  return {
    async insertOrder(d) {
      const info = _insert.run(d)
      return { lastInsertRowid: info.lastInsertRowid }
    },
    async getOrderById(id) {
      return _getById.get(id)
    },
    async getAllOrders() {
      return _getAll.all()
    },
    async attachRazorpayOrder(d) {
      _attach.run(d)
    },
    async markPaid(d) {
      _paid.run(d)
    },
  }
}
