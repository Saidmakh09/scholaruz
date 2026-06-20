# Deploying ScholarUz

This guide takes ScholarUz from your computer to a live website with a custom domain.
You only need three things, all free to start: a **database**, a **Stripe account**, and
(optionally) a **domain**.

---

## Step 1 — Create a free database (Neon)

1. Go to **https://neon.tech** and sign up (you can use your GitHub account).
2. Create a new project. Name it `scholaruz`.
3. On the project dashboard, copy the **connection string** (it looks like
   `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`).
   - The **pooled** string (contains `-pooler`) → use for `DATABASE_URL`.
   - The **direct** string (no `-pooler`) → use for `DIRECT_URL`. (Neon shows both.)

## Step 2 — Get Stripe test keys (no charges, instant)

1. Go to **https://dashboard.stripe.com** and create an account.
2. Make sure you're in **Test mode** (toggle, top-right).
3. **Developers → API keys**: copy the **Publishable key** (`pk_test_…`) and the
   **Secret key** (`sk_test_…`).

> Test mode never charges a real card. You can switch to live keys later, after Stripe
> verifies your identity and bank account.

## Step 3 — Set environment variables on Vercel

In your Vercel project: **Settings → Environment Variables**. Add these (Vercel lets you
paste a whole block at once):

```
DATABASE_URL=<your Neon pooled string>
DIRECT_URL=<your Neon direct string>
AUTH_SECRET=<the long random string from your local .env>
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=https://your-domain-or-vercel-url
```

(Leave `STRIPE_WEBHOOK_SECRET` out for now; add it in Step 5.)

## Step 4 — Create the database tables and demo data

From the project folder on your computer, with the Neon string in your local `.env`:

```bash
npm run db:push     # creates the tables in Neon
npm run db:seed     # loads demo students, donors, and contributions
```

Then deploy (or redeploy) on Vercel. Your site is now live and working.

## Step 5 — Turn on Stripe webhooks (recommended)

1. In Stripe: **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://YOUR-DOMAIN/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `checkout.session.expired`.
4. Copy the **Signing secret** (`whsec_…`) and add it on Vercel as
   `STRIPE_WEBHOOK_SECRET`, then redeploy.

> Even without webhooks, contributions are confirmed on the success page. Webhooks add
> a reliable backstop.

## Step 6 — Custom domain

1. In Vercel: **Settings → Domains → Add**, enter `scholaruz.org` (or buy it right there).
2. Follow Vercel's DNS instructions (if you bought it through Vercel, it's automatic).
3. Update `NEXT_PUBLIC_APP_URL` to `https://scholaruz.org` and redeploy.

## Going live with real money (later)

1. In Stripe, complete **account activation** (business/identity + bank details).
2. Swap the test keys for **live keys** (`sk_live_…`, `pk_live_…`) on Vercel.
3. Add a live-mode webhook (Step 5) and its `whsec_…`.

Because ScholarUz presents itself as a nonprofit accepting donations, make sure you have
the appropriate legal/tax setup (a registered nonprofit, 501(c)(3), or a fiscal sponsor)
before collecting real contributions publicly.
