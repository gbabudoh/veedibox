# Veedibox

A cinema-themed web platform built with Next.js for movie premieres, live streaming, masterclasses, and ticket management.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** PostgreSQL with Prisma ORM v7
- **Auth:** NextAuth.js (Credentials provider, JWT sessions)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Notifications:** ntfy (self-hosted)

## Features

- Live movie premieres with real-time viewer counts
- Ticket purchasing and management
- Role-based dashboards (Viewer, Creator, Admin)
- Masterclass catalog
- ntfy push notifications
- Cinema-themed UI with thermal glow effects

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

1. Clone the repo:
```bash
git clone https://github.com/gbabudoh/veedibox.git
cd veedibox
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example env file and fill in your values:
```bash
cp .env.example .env
```

4. Push the database schema and generate the Prisma client:
```bash
npx prisma db push
npx prisma generate
```

5. Seed demo accounts (optional):
```bash
npx tsx prisma/seed.ts
```

6. Run the dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Creator | filmmaker@veedibox.com | demo1234 |
| Viewer | viewer@veedibox.com | demo1234 |

## Project Structure

```
app/
├── api/auth/          # NextAuth API route
├── auth/              # Login & register pages
├── actions/           # Server actions
├── components/ui/     # Reusable UI components
├── dashboard/         # Role-based dashboards
├── lib/               # DB client, notifications, imgproxy
├── premieres/         # Movie premiere pages
└── page.tsx           # Landing page
prisma/
├── schema.prisma      # Database schema
└── seed.ts            # Demo data seeder
```
