// ─────────────────────────────────────────────────────────────
//  Edit this one file to rebrand the whole site.
//  Replace the placeholder name, phone, area, etc. with your real details.
// ─────────────────────────────────────────────────────────────
export const BRAND = {
  name: 'Crisp & Care', // ← your brand name
  tagline: 'Premium ironing & garment care',
  phone: '+91 98765 43210', // ← your phone / WhatsApp number
  phoneRaw: '919876543210', // digits only, for WhatsApp links
  email: 'hello@crispandcare.in',
  city: 'Kolkata',
  serviceArea: 'Kolkata & Salt Lake', // ← neighbourhoods you cover
  hours: 'Mon–Sun · 8am – 9pm',
  established: '2019',
}

// Pricing shown to customers (must match server/index.js PRICES).
export const PRICE_LIST = [
  { key: 'saree', label: 'Saree (regular)', price: 60 },
  { key: 'saree-premium', label: 'Saree — silk / Banarasi', price: 120 },
  { key: 'suit', label: 'Suit (2-piece)', price: 100 },
  { key: 'blazer', label: 'Blazer / coat', price: 80 },
  { key: 'kurta', label: 'Kurta / sherwani', price: 35 },
  { key: 'shirt', label: 'Shirt', price: 25 },
  { key: 'trouser', label: 'Trouser', price: 30 },
  { key: 'regular', label: 'Regular clothes (per piece)', price: 15 },
]
