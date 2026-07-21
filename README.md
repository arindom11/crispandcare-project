# Crisp & Care — Garment-care webapp

A premium ironing / garment-care web app for a business that presses suits and sarees.
Frontend (React + Vite + Tailwind + GSAP) + backend (Express + SQLite) with online ordering and payment.

## Pages
- **/** — introduction, services, how-it-works
- **/care** — Do's & Don'ts for premium suits and sarees
- **/fabrics** — fabric history + care techniques
- **/order** — place an order, pay by Razorpay / UPI QR / cash on delivery (customer details saved to the DB)
- **/admin** — password-protected list of all orders

## Run it locally (Windows, bundled portable Node)

```powershell
# 1. Put the bundled portable Node on PATH (no system Node needed)
$env:Path = "C:\Users\user\Desktop\Capybara\garment-care\_node\node-v22.11.0-win-x64;" + $env:Path
cd C:\Users\user\Desktop\Capybara\garment-care

# 2. First time only — install dependencies
npm install

# 3. Start backend + frontend together
npm run dev:all
```

Then open http://localhost:5173. The admin page is at http://localhost:5173/admin
(default password `admin123`, change it in `.env`).

## Configure (edit `.env`)
- `ADMIN_PASSWORD` — password for the admin orders page
- `UPI_ID`, `UPI_PAYEE_NAME` — your UPI details (enables the "UPI QR" payment option)
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` — from https://dashboard.razorpay.com
  (start with `rzp_test_...` test keys). Leave blank and the site uses UPI/COD only.

## Rebrand
Edit `src/brand.js` (name, phone, city, service area, hours) and `src/content/*` for copy.
Swap any image in `public/img/` (keep the file name).
