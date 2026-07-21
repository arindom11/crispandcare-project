import { Link } from 'react-router-dom'
import { Shirt, Phone, Mail, MapPin, Clock } from 'lucide-react'
import { BRAND } from '../brand.js'

export default function Footer() {
  return (
    <footer className="bg-deep text-background/80">
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-deep">
              <Shirt size={20} />
            </span>
            <span className="font-display text-xl font-600 text-background">{BRAND.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-background/60">
            {BRAND.tagline}. Fabric-safe pressing for suits and sarees, collected from your door and
            returned crisp — since {BRAND.established}.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-primary-light">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/care" className="hover:text-background">Do&rsquo;s &amp; Don&rsquo;ts</Link></li>
            <li><Link to="/fabrics" className="hover:text-background">Fabric guide</Link></li>
            <li><Link to="/order" className="hover:text-background">Book a pickup</Link></li>
            <li><Link to="/admin" className="hover:text-background">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-primary-light">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone size={15} /> {BRAND.phone}</li>
            <li className="flex items-center gap-2"><Mail size={15} /> {BRAND.email}</li>
            <li className="flex items-center gap-2"><MapPin size={15} /> {BRAND.serviceArea}</li>
            <li className="flex items-center gap-2"><Clock size={15} /> {BRAND.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-background/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Crafted with care for {BRAND.city}.</p>
        </div>
      </div>
    </footer>
  )
}
