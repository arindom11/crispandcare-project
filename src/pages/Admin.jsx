import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Loader2, RefreshCw, Shirt, ArrowLeft } from 'lucide-react'
import { BRAND } from '../brand.js'

const STATUS_STYLES = {
  paid: 'bg-steam/15 text-steam',
  pending: 'bg-primary/15 text-primary-dark',
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load(pass = password) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/orders', { headers: { 'x-admin-password': pass } })
      if (res.status === 401) throw new Error('Wrong password.')
      if (!res.ok) throw new Error('Could not load orders.')
      const data = await res.json()
      setOrders(data.orders)
    } catch (err) {
      setError(err.message)
      setOrders(null)
    } finally {
      setLoading(false)
    }
  }

  // ─── Login gate ───
  if (!orders) {
    return (
      <div className="grid min-h-screen place-items-center bg-deep px-6">
        <form onSubmit={(e) => { e.preventDefault(); load() }} className="w-full max-w-sm rounded-4xl bg-surface p-8 shadow-lift">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-primary-light"><Shirt size={20} /></span>
            <span className="font-display text-xl font-600 text-ink">{BRAND.name}</span>
          </div>
          <h1 className="mt-6 flex items-center gap-2 font-display text-2xl font-600 text-ink">
            <Lock size={20} className="text-primary-dark" /> Admin access
          </h1>
          <p className="mt-2 text-sm text-muted">Enter the admin password to view incoming orders.</p>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus
            placeholder="Password"
            className="mt-5 w-full rounded-xl border border-divider bg-white px-4 py-3 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          {error && <p className="mt-3 text-sm text-blush">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-5 w-full disabled:opacity-50">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Checking…</> : 'View orders'}
          </button>
          <Link to="/" className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted hover:text-ink">
            <ArrowLeft size={14} /> Back to site
          </Link>
        </form>
      </div>
    )
  }

  // ─── Orders dashboard ───
  const revenue = orders.filter((o) => o.payment_status === 'paid').reduce((s, o) => s + o.amount, 0)
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-divider bg-surface">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <h1 className="font-display text-2xl font-600 text-ink">Orders</h1>
            <p className="text-sm text-muted">{orders.length} total · ₹{revenue} collected</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => load()} className="btn-ghost !py-2.5 !px-5 text-sm">
              <RefreshCw size={15} /> Refresh
            </button>
            <Link to="/" className="btn-primary !py-2.5 !px-5 text-sm">Back to site</Link>
          </div>
        </div>
      </header>

      <div className="container-x py-8">
        <div className="overflow-x-auto rounded-4xl border border-divider bg-surface shadow-soft">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-divider bg-background/60 font-mono text-xs uppercase tracking-wider text-muted">
              <tr>
                {['#', 'Placed', 'Customer', 'Contact', 'Items', 'Amount', 'Method', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3.5 font-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {orders.map((o) => (
                <tr key={o.id} className="align-top hover:bg-background/50">
                  <td className="px-4 py-4 font-mono text-ink">{o.id}</td>
                  <td className="px-4 py-4 text-muted">{new Date(o.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-ink">{o.customer_name}</p>
                    <p className="max-w-[220px] text-xs text-muted">{o.address}</p>
                    {o.pickup_slot && <p className="mt-1 text-xs text-primary-dark">{o.pickup_slot}</p>}
                  </td>
                  <td className="px-4 py-4 text-muted">{o.phone}</td>
                  <td className="px-4 py-4">
                    <ul className="space-y-0.5 text-muted">
                      {(o.items || []).map((it, i) => (
                        <li key={i} className="whitespace-nowrap">{it.label} × {it.qty}</li>
                      ))}
                    </ul>
                    {o.notes && <p className="mt-1 max-w-[200px] text-xs italic text-muted/80">“{o.notes}”</p>}
                  </td>
                  <td className="px-4 py-4 font-medium text-ink">₹{o.amount}</td>
                  <td className="px-4 py-4 uppercase text-muted">{o.payment_method}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[o.payment_status] || 'bg-divider text-muted'}`}>
                      {o.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
