# Veedibox

Digital marketplace for modern art, stock imagery, and templates. Next.js (App Router) + PostgreSQL + MinIO + imgproxy + Stripe.

## Stack
- **Frontend/Backend**: Next.js 14 (App Router, route handlers for APIs)
- **Database**: PostgreSQL via Prisma ORM
- **Storage**: MinIO (S3-compatible) for originals, imgproxy for on-the-fly previews/watermarking
- **Payments**: Stripe Checkout + webhooks
- **Auth**: NextAuth (credentials + session-based roles: customer / admin)

## Getting started
```bash
cp .env.example .env
docker compose up -d          # postgres, minio, imgproxy
npm install
npm run db:migrate
npm run dev
```

## Structure
See `src/app` for routes: storefront pages, `dashboard` (customer "My Veedibox"), `admin` (CRUD + analytics), `api` (Stripe webhook, downloads, admin CRUD).
Business logic clients live in `src/lib` (db, storage, stripe, auth).

This is a scaffold — page components contain minimal working structure and TODOs; wire up the Prisma queries and Stripe flow per the PRD before shipping.
