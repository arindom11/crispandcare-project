import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import {
  Shirt, Sparkles, Truck, Clock, ShieldCheck, Leaf, ArrowRight,
  CalendarCheck, WashingMachine, PackageCheck, Star,
} from 'lucide-react'
import { BRAND } from '../brand.js'
import { FABRICS } from '../content/fabrics.js'
import { useReveal } from '../hooks/useReveal.js'

// Signature animation: wisps of steam drifting up from the iron.
function SteamGlow() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.steam-wisp').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 0, opacity: 0, scale: 0.8 },
          {
            y: -120,
            opacity: 0.5,
            scale: 1.4,
            duration: 3.5 + i * 0.4,
            repeat: -1,
            ease: 'sine.out',
            delay: i * 0.5,
            yoyo: false,
            onRepeat: () => gsap.set(el, { opacity: 0 }),
          },
        )
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 7 }).map((_, i) => (
        <span
          key={i}
          className="steam-wisp absolute block h-24 w-24 rounded-full bg-white/40 blur-2xl"
          style={{ left: `${12 + i * 12}%`, bottom: '18%' }}
        />
      ))}
    </div>
  )
}

const services = [
  { icon: Shirt, title: 'Saree Pressing', desc: 'Silk, Banarasi, cotton & georgette — pressed on the reverse at fabric-safe heat with a pressing cloth.' },
  { icon: Sparkles, title: 'Suit & Formalwear', desc: 'Wool suits, blazers and shirts steam-finished to a crisp, shape-preserving press.' },
  { icon: WashingMachine, title: 'Bulk & Household', desc: 'Everyday clothes ironed by the piece — folded, sorted and ready to wear.' },
  { icon: Truck, title: 'Pickup & Delivery', desc: `Free doorstep collection and return across ${BRAND.serviceArea}.` },
]

const steps = [
  { icon: CalendarCheck, title: 'Book a pickup', desc: 'Choose a slot online in under a minute.' },
  { icon: WashingMachine, title: 'We collect & press', desc: 'Expert, fabric-specific ironing for every garment.' },
  { icon: PackageCheck, title: 'We deliver', desc: 'Crisp clothes back at your door, on time.' },
]

const trust = [
  { icon: ShieldCheck, label: 'Fabric-safe guarantee' },
  { icon: Clock, label: '24–48h turnaround' },
  { icon: Truck, label: 'Free pickup & delivery' },
  { icon: Leaf, label: 'Gentle, garment-first care' },
]

export default function Home() {
  const scope = useRef(null)
  useReveal(scope)

  return (
    <div ref={scope}>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent-dark via-accent to-deep pt-28 pb-24 text-background">
        <div className="weave-overlay absolute inset-0 opacity-40" />
        <SteamGlow />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow !text-primary-light">{BRAND.tagline}</span>
            <h1 className="mt-4 font-display text-5xl font-600 leading-[1.05] sm:text-6xl lg:text-7xl">
              Crisp clothes,<br />
              <span className="text-primary-light italic font-serif">handled with care.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-background/75">
              Premium ironing for your finest suits and sarees — collected from your door,
              pressed by hand at fabric-safe heat, and returned immaculate.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/order" className="btn-primary">
                Book a pickup <ArrowRight size={18} />
              </Link>
              <Link to="/fabrics" className="btn-ghost !border-background/30 !text-background hover:!bg-background hover:!text-accent">
                Explore fabric care
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-4 text-sm text-background/70">
              <div className="flex text-primary-light">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span>Trusted by hundreds of local customers since {BRAND.established}</span>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 shadow-lift">
              <img
                src="/img/hero.jpg"
                alt="Freshly pressed garments on a rail"
                className="h-[460px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-3xl bg-background p-5 text-ink shadow-lift sm:block">
              <p className="font-display text-3xl font-600 text-accent">24h</p>
              <p className="text-xs text-muted">express turnaround</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust strip ─── */}
      <section className="border-b border-divider bg-surface">
        <div className="container-x grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {trust.map((t) => (
            <div key={t.label} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary-dark">
                <t.icon size={18} />
              </span>
              <span className="text-sm font-medium text-ink/80">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Introduction ─── */}
      <section className="container-x py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="reveal relative">
            <img src="/img/shop.jpg" alt="Our ironing atelier" className="rounded-4xl shadow-soft" />
          </div>
          <div className="reveal">
            <span className="eyebrow">Our story</span>
            <h2 className="mt-3 font-display text-4xl font-600 leading-tight text-ink sm:text-5xl">
              A neighbourhood press, perfected over years.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              What began as a small local ironing shop in {BRAND.city} has grown into a trusted name for
              garment care. We treat every suit and saree as if it were our own — the right heat, the right
              cloth, the right fold — so your clothes look their best and last far longer.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Now we bring that same craft to your doorstep. Book online, and we handle the rest.
            </p>
            <Link to="/care" className="mt-8 inline-flex items-center gap-2 font-medium text-primary-dark link-underline">
              See how we care for premium fabrics <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Services ─── */}
      <section className="bg-surface py-24">
        <div className="container-x">
          <div className="reveal max-w-2xl">
            <span className="eyebrow">What we do</span>
            <h2 className="mt-3 font-display text-4xl font-600 text-ink sm:text-5xl">Services</h2>
            <p className="mt-4 text-lg text-muted">Expert pressing for every kind of garment, delivered as a doorstep service.</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.title} className="reveal card group p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary-light transition-colors group-hover:bg-primary group-hover:text-white">
                  <s.icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-xl font-600 text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="container-x py-24">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow">Simple as can be</span>
          <h2 className="mt-3 font-display text-4xl font-600 text-ink sm:text-5xl">How it works</h2>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="reveal relative text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary-dark">
                <s.icon size={30} />
              </div>
              <span className="mt-4 block font-mono text-xs text-primary-dark">STEP {i + 1}</span>
              <h3 className="mt-1 font-display text-2xl font-600 text-ink">{s.title}</h3>
              <p className="mt-2 text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Fabric teaser ─── */}
      <section className="bg-surface py-24">
        <div className="container-x">
          <div className="reveal flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="eyebrow">Know your cloth</span>
              <h2 className="mt-3 font-display text-4xl font-600 text-ink sm:text-5xl">Fabrics we love</h2>
              <p className="mt-4 text-lg text-muted">Every fibre has its own history and its own rules. Here&rsquo;s how we treat each one.</p>
            </div>
            <Link to="/fabrics" className="btn-ghost">View the full guide</Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FABRICS.slice(0, 3).map((f) => (
              <Link key={f.key} to="/fabrics" className="reveal group overflow-hidden rounded-4xl border border-divider bg-background shadow-soft">
                <div className="h-52 overflow-hidden">
                  <img src={f.image} alt={f.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <span className="font-mono text-xs uppercase tracking-wider text-primary-dark">{f.tag}</span>
                  <h3 className="mt-1 font-display text-2xl font-600 text-ink">{f.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{f.history}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="container-x py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-accent to-deep px-8 py-16 text-center text-background sm:px-16">
          <div className="weave-overlay absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-4xl font-600 leading-tight sm:text-5xl">
              Ready for effortlessly crisp clothes?
            </h2>
            <p className="mt-4 text-lg text-background/75">
              Book a doorstep pickup now — pay online, by UPI, or on delivery.
            </p>
            <Link to="/order" className="btn-primary mt-8">
              Book a pickup <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
