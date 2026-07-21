# Deploying Crisp & Care online (free)

This puts your webapp on the internet at a free address like
`https://crisp-and-care.onrender.com`, with a **Postgres database so customer
orders are saved permanently** (they survive restarts and updates).

You'll use two free services:

- **Neon** — the database (stores your orders). Free forever.
- **Render** — runs the website + backend. Free tier.

You only do this once. Total time: ~20 minutes. No coding required.

---

## Step 1 — Create the database (Neon)

1. Go to **https://neon.tech** and sign up (use "Continue with Google").
2. Click **Create Project**. Give it a name like `crisp-and-care`. Pick the region
   closest to you (e.g. **Singapore** for India). Click **Create**.
3. On the project dashboard, find **Connection string** and click **Copy**.
   It looks like:
   ```
   postgresql://user:password@ep-xxxx.ap-southeast-1.aws.neon.tech/dbname?sslmode=require
   ```
4. **Paste it somewhere safe for a minute** — you'll need it in Step 3.
   (This is your `DATABASE_URL`.)

---

## Step 2 — Put the code on GitHub

Render installs your app from a GitHub repository.

1. Go to **https://github.com** and sign in (create a free account if needed).
2. Click the **+** (top right) → **New repository**.
   - Name: `crisp-and-care`
   - Set it to **Private** (recommended).
   - Do **NOT** tick "Add a README".
   - Click **Create repository**.
3. GitHub now shows a page with commands. Ignore them — the code is already
   committed locally. Instead, in the project folder run these two lines
   (replace `YOUR-USERNAME` with your GitHub username):

   > In Claude Code you can run these by typing `!` then the command, e.g.
   > `!git remote add origin https://github.com/YOUR-USERNAME/crisp-and-care.git`

   ```
   git remote add origin https://github.com/YOUR-USERNAME/crisp-and-care.git
   git push -u origin main
   ```
   A browser window may pop up asking you to log in to GitHub — approve it.
   When it finishes, refresh the GitHub page; you should see your files.

---

## Step 3 — Deploy on Render

1. Go to **https://render.com** and sign up with **GitHub** (easiest — it links
   your repos automatically).
2. Click **New +** → **Web Service**.
3. Find and select your **`crisp-and-care`** repository → **Connect**.
4. Render reads the included `render.yaml` and fills in most settings. Confirm:
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** **Free**
5. Scroll to **Environment Variables** and add these (click "Add"):

   | Key                 | Value                                                        |
   |---------------------|-------------------------------------------------------------|
   | `DATABASE_URL`      | *(paste the Neon connection string from Step 1)*            |
   | `ADMIN_PASSWORD`    | *(a strong password — this protects your /admin orders page)* |
   | `UPI_ID`            | *(your real UPI ID, e.g. `yourname@okhdfcbank`)*           |
   | `UPI_PAYEE_NAME`    | `Crisp & Care` *(or your brand name)*                       |
   | `NODE_ENV`          | `production`                                                 |

   Leave `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` **unset** for now — the site
   automatically offers **UPI QR + Cash-on-Delivery** until you add them.
6. Click **Create Web Service**. Render builds and deploys (~2–4 minutes).
   When it says **Live**, click the URL at the top (e.g.
   `https://crisp-and-care.onrender.com`). That's your website — share it!

---

## Step 4 — Check it works

1. Open your live URL. Browse Home / Care / Fabrics.
2. Place a **test order** (choose Cash on Delivery).
3. Go to `your-url/admin`, enter your `ADMIN_PASSWORD`, and confirm the order
   shows up. Because it's in Neon Postgres, it stays there forever.

---

## Good to know

- **First visit after idle is slow.** On the free plan the app "sleeps" after
  15 minutes of no visitors; the next visitor waits ~30 seconds while it wakes,
  then it's fast again. (Upgrading Render to the ~$7/mo plan removes this.)
- **Updating the site later:** make changes, then commit and push:
  ```
  git add -A
  git commit -m "describe your change"
  git push
  ```
  Render redeploys automatically. Your orders in Neon are untouched.
- **Taking real card payments (Razorpay):** you must complete Razorpay's
  business verification (KYC) to get **live** keys. Once you have them, add
  `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in Render's Environment settings
  and redeploy — the online card/UPI checkout button turns on automatically.
  UPI QR payments work right now with just your `UPI_ID`, no KYC needed.
- **Your secrets** (passwords, DB string, keys) live only in Render's dashboard
  and your local `.env` — never in the code or on GitHub.
