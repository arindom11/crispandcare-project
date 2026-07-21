import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Shirt } from 'lucide-react'
import { BRAND } from '../brand.js'

const links = [
  { to: '/', label: 'Home' },
  { to: '/care', label: "Do's & Don'ts" },
  { to: '/fabrics', label: 'Fabrics' },
  { to: '/order', label: 'Order' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/90 shadow-soft backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-primary-light">
            <Shirt size={20} />
          </span>
          <span className="font-display text-xl font-600 text-ink">{BRAND.name}</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `link-underline text-sm font-medium transition-colors ${
                  isActive ? 'text-primary-dark' : 'text-ink/80 hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/order" className="btn-primary !py-2.5 !px-6 text-sm">
            Book a pickup
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden">
          <div className="container-x flex flex-col gap-2 border-t border-divider bg-background/95 py-4 backdrop-blur">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-medium ${
                    isActive ? 'bg-primary/10 text-primary-dark' : 'text-ink/80'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/order" className="btn-primary mt-2 text-sm">
              Book a pickup
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
