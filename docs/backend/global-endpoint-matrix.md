# Global Backend Endpoint Matrix

_Last updated: 2025-12-02_- cc

This document is the system-wide source of truth for every REST endpoint currently exposed by the iCoachie backend. It consolidates existing controllers, routes, RBAC enforcement, and known contract gaps so that frontend, QA, and platform teams can rely on a single reference while planning integrations.

## How to Use This Matrix
- **Module Overview Table** provides a quick glance at every controller mounted in `backend/src/server.ts`.
- **RBAC & Scoping** calls out whether the controller relies on `requireRole`, `requireScope`, or `requirePermission`, plus any tenant-scoping rules (e.g., club ownership checks).
- **Gaps & Follow-ups** enumerates missing payload fields, absent endpoints, or inconsistent response shapes. Each gap links back to Card 11 (global audit) and its follow-up subcards (19–24) for execution tracking.
- **Appendices**: Specialized breakdowns like `docs/facilities/endpoint-matrix.md` remain in place for deep dives into a single module; this file references those appendices where relevant.

## Module Overview
| Module | Base Path | Controller | Representative Endpoints | RBAC / Scope Enforcement | Notable Gaps |
| --- | --- | --- | --- | --- | --- |
| Auth & Sessions | `/api/auth` | `controllers/authController.ts` | `POST /register`, `POST /login`, `POST /logout`, password reset flows | Public for register/login/reset; other flows should enforce throttling but currently do not | Needs MFA hooks, rate limiting, and device tracking endpoints |
| Users & Profiles | `/api/users` | `controllers/userController.ts` | `GET /me`, `PUT /me/profile`, admin `GET/POST/PUT/DELETE /users`, `POST /assign-role`, `GET /roles` | `requireAuth` everywhere; admin CRUD guarded with `requireRole(['SUPER_ADMIN'])`; no `requirePermission` coverage | Missing pagination/query filters for admin list, no bulk role assignment or profile photo upload endpoints |
| Clubs & Multi-Tenancy | `/api/clubs` | `controllers/clubController.ts` | `GET /`, `GET /:id`, `GET /my`, `POST /`, `PUT /:id`, `DELETE /:id` | Global admin list guarded with `SUPER_ADMIN`; tenant scoping enforced via `clubId` comparisons | No soft delete, no search/filter, no endpoints for club-level settings (branding, billing) |
| Students | `/api/students` | `controllers/studentController.ts` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | `requireAuth` for CRUD, delete restricted to `SUPER_ADMIN`; club scoping enforced | Missing pagination, bulk import/export, guardian management |
| Coaches | `/api/coaches` | `controllers/coachController.ts` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | `requireAuth`; create/delete locked to `SUPER_ADMIN`; club scoping enforced | Need certification upload endpoints, availability management, search filters |
| Sessions | `/api/sessions` | `controllers/sessionController.ts` | CRUD plus enrollment (`POST /:id/enroll`, `DELETE /:id/enroll/:studentId`) | `requireAuth` across the board, deletes require `SUPER_ADMIN`; club scoping enforced | No pagination, lacks schedule/recurrence endpoints, no attendee summaries |
| Attendance | `/api/attendance` | `controllers/attendanceController.ts` | Query by session/student, single upsert, bulk post | `requireAuth`, delete restricted to `SUPER_ADMIN`; relies on session->club scoping | Needs pagination, CSV import/export, audit history |
| Evaluations | `/api/evaluations` | `controllers/evaluationController.ts` | Query by student/session, create, update, delete, stats | `requireAuth`; delete restricted to `SUPER_ADMIN`; club scoping enforced | Missing rubric templates, attachments, evaluator assignments |
| Bookings | `/api/bookings` | `controllers/bookingController.ts` | Auth middleware applied globally; `POST /`, `GET /`, `GET /:id`, `PATCH /:id/status`, `PATCH /:id/cancel`, `GET /freelancers/available` | `requireAuth`; within controller additional role/scope validation required but inconsistent | Needs pagination, facility/venue linkage, payment reconciliation |
| Payments | `/api/payments` | `controllers/paymentController.ts` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `PUT /:id/status`, `DELETE /:id`, Stripe intent/webhook endpoints | `requireAuth`; deletes restricted to `SUPER_ADMIN`; webhook unauthenticated but uses Stripe signature | Lacks refunds endpoint, invoice downloads, payer statements, idempotency keys |
| Messages | `/api/messages` | `controllers/messageController.ts` | `POST /`, `GET /`, `GET /:id`, `PATCH /mark-read`, `DELETE /:id`, `GET /unread-count` | `requireAuth` applied via router-level middleware | Needs threads/channel support, pagination, attachments |
| Reviews | `/api/reviews` | `controllers/reviewController.ts` | `POST /`, `GET /`, `GET /:id`, `PUT /:id`, `DELETE /:id`, `GET /stats/:userId` | `requireAuth` applied globally | Requires moderation endpoint, pagination, filter by entity type |
| Facilities / Venues / Grounds | `/api/facilities` | `controllers/facilityController.ts` | **CRUD**: `GET/POST/PUT/DELETE /`, `GET /:id`, `POST /:id/restore`; **Staff**: `PUT /:id/manager`, `GET/POST /:id/staff`, `DELETE /:id/staff/:userId`; **Venues**: nested CRUD + `PUT /venues/:id/manager`, `POST/GET/PUT/DELETE /venues/:id/schedule`; **Grounds**: same pattern | `requireRole`, `requireScope`, `requirePermission` with pagination + soft delete + `includeDeleted` filter | ✅ Cards 19-24 completed - Full DTO coverage, manager/staff assignment, schedule APIs, soft delete/restore, pagination, permission-based RBAC |
| Status Lookups | `/api/statuses` | `controllers/statusController.ts` | `GET /user`, `/session`, `/attendance`, `/payment`, `/booking` | Public read (no auth yet) | Should require auth and cache headers; missing membership/status endpoints |
| RBAC Test Harness | `/api/rbac/test` | `controllers/rbacTestController.ts` | `GET /role`, `/scope`, `/permission` | Requires auth plus targeted middleware per route | ✅ Permission-based RBAC now wired on facility stack (Card 24) |
| Files | `/api/files` | `routes/fileRoutes.ts` | Upload/download/delete assets | Mixed RBAC; needs audit | Missing virus scan, metadata response, signed URLs |

## RBAC & Scoping Summary
- **Role-based enforcement**: Most destructive operations require `SUPER_ADMIN`; manager-level roles (e.g., `FACILITY_MANAGER`) are only wired inside the facility controller. Other modules still rely on coarse `requireRole(['SUPER_ADMIN'])` guards.
- **Scope-based enforcement**: Facilities leverage `requireScope('FACILITY' | 'VENUE' | 'GROUND')`; other modules rarely use scopes even though roles define scope metadata.
- **Permission-based enforcement** (NEW): Facility stack now uses `requirePermission` for granular access control: `facility.staff.manage`, `venue.manage`, `venue.schedule.manage`, `ground.manage`, `ground.schedule.manage`.
- **Tenant scoping**: Clubs, facilities, students, sessions, attendance, and evaluations consistently compare `req.user!.clubId` to resource ownership. Payments, bookings, and reviews only partially enforce tenant scoping, which needs remediation.

## Identified Gaps & Linked Follow-ups
| Gap Category | Description | Linked Card | Status |
| --- | --- | --- | --- |
| Metadata DTO coverage | CRUD payloads expose only a subset of Prisma fields (locations, amenities, billing, etc.) across multiple modules. | `19 - Metadata DTO expansion (global)` | ✅ COMPLETED |
| Manager & staff assignment | Need consistent endpoints to assign managers/staff for clubs, facilities, venues, grounds, sessions. | `20 - Manager & staff assignment (global)` | ✅ COMPLETED |
| Scheduling & availability | Sessions, venues, grounds, and bookings lack unified schedule/availability APIs. | `21 - Scheduling & availability (global)` | ✅ COMPLETED |
| Soft delete & audit | Most controllers perform hard deletes despite schema-level `deletedAt`. Need global soft-delete + restore endpoints and audit visibility. | `22 - Soft delete & restore (global)` | ✅ COMPLETED |
| Pagination & filtering | List endpoints return entire datasets with no pagination/search/sort semantics. | `23 - Pagination & filtering (global)` | ✅ COMPLETED |
| Permission-driven RBAC | Only a few routes leverage `requirePermission`; need cross-module permission enforcement. | `24 - Permission-based RBAC (global)` | ✅ COMPLETED |

## Facility Stack Enhancement Summary (Cards 19-24 Completion)

### Card 19 - Metadata DTO Expansion
- Updated `facilitySelect`, `venueSelect`, `groundSelect` with all schema fields
- Response mappers normalize API responses consistently
- All fields (location, description, amenities, capacity, hourlyRate, dimensions, etc.) now accepted in POST/PUT

### Card 20 - Manager & Staff Assignment
- **Facility**: `PUT /:id/manager`, `GET /:id/staff`, `POST /:id/staff`, `DELETE /:id/staff/:userId`
- **Venue**: `PUT /venues/:id/manager`
- **Ground**: `PUT /grounds/:id/manager`
- All endpoints validate club ownership and user existence

### Card 21 - Venue/Ground Schedule APIs
- New Prisma models: `VenueSchedule`, `GroundSchedule`
- CRUD endpoints for both venues and grounds: `POST/GET/PUT/DELETE .../:id/schedule`
- Supports recurring schedules (dayOfWeek) and one-off dates (specificDate)
- Blackout windows for maintenance/closures
- Conflict detection prevents overlapping slots

### Card 22 - Soft Delete & Restore
- DELETE endpoints now set `deletedAt` instead of removing records
- Restore endpoints: `POST /:id/restore`
- List endpoints filter out deleted records by default
- `?includeDeleted=true` query param to show deleted records

### Card 23 - Pagination & Filtering
- Standard response envelope: `{ data, pageInfo: { page, pageSize, total, totalPages, hasNext, hasPrev }, filtersApplied }`
- Query params: `page`, `pageSize`, `search`, `includeDeleted`, `available`
- Applied to facilities, venues, and grounds list endpoints

### Card 24 - Permission-based RBAC
- `requirePermission` middleware wired on all new routes
- Permissions used: `facility.staff.manage`, `venue.manage`, `venue.schedule.manage`, `ground.manage`, `ground.schedule.manage`
- Aligned with existing permission catalog in `backend/prisma/data/permissions.ts`

## Next Steps
1. **Deep-Dive Appendices**: For high-complexity domains (facilities, bookings, payments), continue authoring module-specific appendices under `docs/<module>/` using this global structure.
2. **Swagger/OpenAPI Sync (Card 12)**: Use this matrix as the canonical checklist when refreshing Swagger, Postman collections, and contract docs.
3. **Frontend Integration Guides**: Each frontend squad should reference this matrix when tagging their screens with backend dependencies, ensuring Card 16 (integration readiness) and Card 18 (E2E program) remain aligned.
4. **Ongoing Audits**: Whenever a new controller or route is introduced, update this matrix and cross-link the owning cards so that Card 11 continues to represent real-time backend coverage.

---
_This file supersedes the facility-only audit as the global reference. Module appendices (e.g., `docs/facilities/endpoint-matrix.md`) remain authoritative for granular details and should be linked from the "Notable Gaps" column above._
