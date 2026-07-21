import { useRef } from 'react'
import { Check, X } from 'lucide-react'
import { CARE_GUIDES } from '../content/care.js'
import { useReveal } from '../hooks/useReveal.js'

function PageHeader() {
  return (
    <section className="relative bg-gradient-to-b from-accent-dark to-accent pt-32 pb-16 text-background">
      <div className="weave-overlay absolute inset-0 opacity-40" />
      <div className="container-x relative">
        <span className="eyebrow !text-primary-light">Handle with care</span>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-600 leading-tight sm:text-6xl">
          Do&rsquo;s &amp; Don&rsquo;ts for premium suits &amp; sarees
        </h1>
        <p className="mt-5 max-w-xl text-lg text-background/75">
          The small habits that keep your finest garments looking new — and the mistakes that quietly ruin them.
        </p>
      </div>
    </section>
  )
}

export default function Care() {
  const scope = useRef(null)
  useReveal(scope)

  return (
    <div ref={scope}>
      <PageHeader />

      <div className="container-x space-y-20 py-20">
        {CARE_GUIDES.map((g, idx) => (
          <section key={g.key} className="reveal grid gap-10 lg:grid-cols-5 lg:items-start">
            {/* Image + title */}
            <div className={`lg:col-span-2 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="overflow-hidden rounded-4xl shadow-soft">
                <img src={g.image} alt={g.title} className="h-72 w-full object-cover lg:h-96" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-600 text-ink">{g.title}</h2>
              <p className="mt-1 text-muted">{g.subtitle}</p>
            </div>

            {/* Do / Don't columns */}
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-3">
              <div className="card p-6">
                <div className="flex items-center gap-2 text-steam">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-steam/15">
                    <Check size={18} />
                  </span>
                  <h3 className="font-display text-lg font-600 text-ink">Do</h3>
                </div>
                <ul className="mt-4 space-y-3">
                  {g.dos.map((d) => (
                    <li key={d} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                      <Check size={16} className="mt-0.5 shrink-0 text-steam" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-2 text-blush">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-blush/15">
                    <X size={18} />
                  </span>
                  <h3 className="font-display text-lg font-600 text-ink">Don&rsquo;t</h3>
                </div>
                <ul className="mt-4 space-y-3">
                  {g.donts.map((d) => (
                    <li key={d} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                      <X size={16} className="mt-0.5 shrink-0 text-blush" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
