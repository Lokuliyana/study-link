# Agent Implementation Rules: Study Link Counselor OS

### 1. Technology Boundaries
- **Framework**: Next.js (App Router, Server Components where possible, Client Components for interactive triage).
- **Styling**: Tailwind CSS + shadcn/ui primitives (`table`, `dialog`, `badge`, `sheet`, `card`, `tabs`).
- **Icons**: `lucide-react`.
- **State & Data**: Read-first architecture. Store static country rules and script templates in bundled JSON files (`lib/data/*`).
- **Persistence**: By default, mutations write to client `localStorage` or mock API Route Handlers writing to `data/leads.json` via `node:fs/promises`. No external databases required for initial deployments.

### 2. Read-Heavy Design Mandates
- **No Complex ORM**: Do not introduce Prisma, TypeORM, or external relational databases unless explicitly commanded.
- **Sub-Second Search**: Country rule matching must execute client-side synchronously in under 50ms upon changing dropdown filters.
- **Call-First UX**: The UI must be optimized for phone operators: large typography, quick-copy phone numbers (`wa.me/` shortcuts), and zero screen jumps.
