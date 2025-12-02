# Copilot Instructions for iCoachie
## Platform Snapshot
- Multi-tenant sports coaching suite; Node/Express backend with Prisma/Postgres and Next.js 15 App Router frontend (React 19 + shadcn).
- Core specs live in `docs/backend/global-endpoint-matrix.md`, `docs/facilities/endpoint-matrix.md`, and DTO notes under `docs/backend/dto`; refer to them before inventing new payloads.
- Role/permission catalog is maintained in `docs/rbac/permissions.md` with the source of truth in `backend/prisma/data/permissions.ts`.
## Backend Essentials
- Entry point `backend/src/server.ts` wires every controller under `/api/*`, configures CORS lists via `ALLOWEDORIGINS`, mounts Swagger at `/api-docs`, and exposes the raw Stripe webhook (`/api/payments/webhook`).
- Real-time events (`attendance-updated`, `booking-updated`, etc.) run through `services/socketService.ts`; socket authentication reuses JWT and joins `club-*`/`user-*` rooms.
- Controllers (e.g., `controllers/studentController.ts`) follow: `requireAuth` ➜ optional RBAC middleware ➜ Prisma query with `{ clubId: req.user!.clubId, deletedAt: null }` ➜ DTO mapper. Reuse `utils/pagination.ts` helpers and return `{ data, pageInfo, filtersApplied }`.
- File flows are centralized in `routes/fileRoutes.ts` + `controllers/fileController.ts`, storing blobs under `backend/uploads/<clubId>/`; public links must go through token endpoints instead of exposing disk paths.
- Environment config lives in `backend/.env.example` (DB, JWT, Stripe, CORS). Jest reads `.env.test` and `tests/setup.ts` truncates every table, seeds roles/status, and sets `JWT_SECRET`.
## Data & RBAC
- Prisma schema (`prisma/schema.prisma`) puts `clubId` and `deletedAt` on nearly every table; soft deletes set `deletedAt` and restores live at `/:id/restore` like the club/student controllers.
- RBAC middleware (`middleware/rbac.ts`) loads roles + scopes from DB, supports `requireRole`, `requirePermission`, and `requireScope`. Keep permissions JSONs synchronized with `prisma/data/permissions.ts` and re-run `npx prisma db seed` afterward.
- Seed helpers live in `prisma/data/*` and `prisma/scripts/createSuperAdmin.ts`; use them instead of ad-hoc SQL when bootstrapping tenants or admin accounts.
## Backend Workflows
- Install/build/run via `cd backend && npm install && npm run build|dev`; migrations execute as compiled JS: `npm run migrate` (runs `dist/migrations/run.js`).
- Jest + Supertest specs in `backend/tests/*.test.ts` rely on helpers from `tests/setup.ts` plus fixture factories in `tests/fixtures`; never hardcode IDs because the DB truncates between tests.
- Payments integrate with Stripe (`paymentsController`) and expect `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`; keep webhook validation in sync with the env file.
- Swagger definitions in `src/swagger.ts` mirror controller decorators; update both when changing request/response shapes.
## Frontend Essentials
- Next App Router lives under `frontend/app`; role-focused dashboards sit in grouped folders like `app/(dashboard)/coach`, `admin`, `parent`, etc. Shared shells/layouts stay in `app/(dashboard)/layout.tsx` and `components/ui/*` (shadcn/Radix wrappers).
- All HTTP requests flow through `frontend/lib/api.ts` (axios singleton) and `frontend/lib/auth.ts` (localStorage token + `/users/me` fetch). Extend these helpers when adding endpoints so interceptors keep auth/logout logic consistent.
- Styling + theming: Tailwind setup (`app/globals.css`, `tailwind.config.ts`) implements the glassmorphism look; reuse design tokens instead of inline styles. Context/stateful utilities live in `frontend/contexts` and `hooks`.
- Frontend env config (`frontend/.env.example`) exposes `NEXT_PUBLIC_API_URL` and Stripe publishable keys; ensure values match backend ports and Stripe secrets anytime environments shift.
## Cross-Cutting Practices
- Keep UX requirements aligned with `docs/frontend/role-screen-inventory.md` so each of the 22 roles sees the right navigation/cards; backend RBAC changes often require matching UI updates.
- Socket-driven widgets should listen for the same events emitted by `SocketService` (attendance updates, booking status, dashboard stats) instead of polling.
- Uploaded assets and signed file tokens (`/api/files/:id/token`) are the only sanctioned way to expose media—never send raw `uploads/*` paths to clients.
- Standard response envelope is `{ success?: boolean, message?: string, ...data }`; controllers currently log errors to console and reply with `{ message: 'Internal error' }`—follow that pattern for consistency.
## Quick Commands
- Backend: `npm run dev`, `npm run test`, `npm run migrate`
- Frontend: `cd frontend && npm run dev`, `npm run build`, `npm run test:e2e`
- Prisma: `npx prisma migrate dev` then `npx prisma db seed`
- Playwright: results land in `frontend/playwright-report`; `npm run test:e2e:ui` launches the inspector.
- Feedback welcome—flag unclear sections so we can tighten these instructions.
