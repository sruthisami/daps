# Controlled Document Approval System

A document management system with role-based review workflows. Authors draft and submit documents, reviewers approve or reject them, and admins manage the full lifecycle through to publishing and archiving. 

---

## Tech stack

- **Framework** — Next.js (App Router)
- **Language** — TypeScript
- **Database** — PostgreSQL(neon) via Prisma ORM
- **UI** — shadcn/ui + Tailwind CSS
- **Data fetching** — TanStack Query
- **Notifications** — Sonner

---

## Prerequisites

- Node.js 18+
- npm 9+
- A running PostgreSQL instance

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/sruthisami/daps.git
cd daps
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your database URL:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/daps"
```

### 4. Set up the database

Apply migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Seed the database

```bash
npx prisma db seed
```

This creates the following users:

| Name | Email | Role |
|---|---|---|
| Alice Author | alice@example.com | `AUTHOR` |
| Ashton Author | ashton@example.com | `AUTHOR` |
| Bob Reviewer | bob@example.com | `REVIEWER` |
| Admin User | admin@example.com | `ADMIN` |
| Viewer User | viewer@example.com | `VIEWER` |

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Common commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npx prisma studio` | Open Prisma database browser |
| `npx prisma migrate dev` | Apply pending migrations |
| `npx prisma generate` | Regenerate Prisma client after schema changes |
| `npx prisma db seed` | Seed the database |

