# ScholarUz

A nonprofit platform connecting donors with students who lack access to educational
funding. ScholarUz makes giving transparent: every contribution is tracked end-to-end —
from a donor's pledge to the moment funds reach a student's institution.

**Live site:** _(add your URL after deploying, e.g. https://scholaruz.org)_

## What it does

Four core workflows, plus a reconciliation-oriented admin console:

| Workflow | Description |
| --- | --- |
| **Students** | Students apply with their school, field, funding goal, and story; an admin reviews and approves each profile. |
| **Donors** | Donors create an account, browse approved students, and contribute any amount. |
| **Contributions** | Payments are processed through Stripe and recorded with full status (pending → succeeded / failed / refunded). |
| **Disbursements** | Admins disburse pooled funds to students' institutions and confirm receipt. |

The **admin reconciliation console** tracks contribution status, each student's funding
progress, and every disbursement's state — reconciling money in against money out and
flagging anything that doesn't balance.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Prisma** ORM + **PostgreSQL**
- Email/password auth with **bcrypt** hashing and signed **JWT** session cookies (`jose`)
- **Stripe** Checkout for payments (+ webhook confirmation)
- **Zod** for input validation

## Local development

```bash
npm install
cp .env.example .env        # then fill in DATABASE_URL, AUTH_SECRET, Stripe keys
npm run db:push             # create tables
npm run db:seed             # load demo data
npm run dev                 # http://localhost:3000
```

### Demo accounts (after seeding)

All use the password `Demo!2026`:

- **Admin** — `admin@scholaruz.org`
- **Donor** — `donor@scholaruz.org`
- **Student** — `student@scholaruz.org`

## Deployment

See [DEPLOY.md](./DEPLOY.md) for step-by-step instructions to put ScholarUz live on
Vercel with a custom domain.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (runs `prisma generate`) |
| `npm run db:push` | Sync the Prisma schema to the database |
| `npm run db:seed` | Load demo students, donors, and contributions |
| `npm run db:reset` | Reset the database and re-seed |
