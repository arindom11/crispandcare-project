import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Thermometer, ScrollText, Sparkles, Check, X, ArrowRight } from 'lucide-react'
import { FABRICS } from '../content/fabrics.js'
import { useReveal } from '../hooks/useReveal.js'

export default function Fabrics() {
  const scope = useRef(null)
  useReveal(scope)

  return (
    <div ref={scope}>
      <section className="relative bg-gradient-to-b from-accent-dark to-accent pt-32 pb-16 text-background">
        <div className="weave-overlay absolute inset-0 opacity-40" />
        <div className="container-x relative">
          <span className="eyebrow !text-primary-light">Fabric guide</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-600 leading-tight sm:text-6xl">
            Every fibre has a history — and a right way to care for it
          </h1>
          <p className="mt-5 max-w-xl text-lg text-background/75">
            A quick guide to the fabrics we press most, where they come from, and how we keep each one at its best.
          </p>
        </div>
      </section>

      <div className="container-x space-y-16 py-20">
        {FABRICS.map((f, idx) => (
          <section key={f.key} className="reveal grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className={`overflow-hidden rounded-4xl shadow-soft ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <img src={f.image} alt={f.name} className="h-80 w-full object-cover lg:h-[26rem]" />
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary-dark">{f.tag}</span>
              <h2 className="mt-2 font-display text-4xl font-600 text-ink">{f.name}</h2>

              <div className="mt-5 space-y-5">
                <div>
                  <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent">
                    <ScrollText size={14} /> Origin &amp; history
                  </p>
                  <p className="mt-1.5 leading-relaxed text-muted">{f.history}</p>
                </div>
                <div>
                  <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent">
                    <Sparkles size={14} /> How we care for it
                  </p>
                  <p className="mt-1.5 leading-relaxed text-muted">{f.technique}</p>
                </div>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary-dark">
                <Thermometer size={16} /> Iron: {f.ironTemp}
              </div>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {f.dos.map((d) => (
                  <span key={d} className="flex items-center gap-1.5 text-muted">
                    <Check size={14} className="text-steam" /> {d}
                  </span>
                ))}
                {f.donts.map((d) => (
                  <span key={d} className="flex items-center gap-1.5 text-muted">
                    <X size={14} className="text-blush" /> {d}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="container-x pb-24">
        <div className="reveal rounded-4xl border border-divider bg-surface p-10 text-center shadow-soft">
          <h2 className="font-display text-3xl font-600 text-ink">Let the experts handle it</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">
            Not sure which setting your garment needs? Leave it to us — we press every fabric the way it deserves.
          </p>
          <Link to="/order" className="btn-primary mt-6">
            Book a pickup <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
