# Facility / Venue / Ground Endpoint Audit

_Last updated: 2025-12-02_

## Scope
- Document every REST endpoint currently implemented under `backend/src/controllers/facilityController.ts` and surfaced from `server.ts` via `app.use('/api/facilities', facilityRoutes)`.
- Confirm HTTP method, route, RBAC guard, and core request/response payload contracts.
- Capture tenant/club scoping behavior and cross-entity references needed by the frontend.
- Highlight missing endpoints or payload fields needed to satisfy the facility management UX (facility staff, manager assignment, schedules, availability toggles, metadata fields from Prisma models).

## Current Endpoint Coverage
| # | Domain | Method | Route | Description | RBAC / Scope | Notes |
| - | - | - | - | - | - | - |
| 1 | Facility | POST | `/api/facilities` | Create facility tied to authenticated user club | `requireRole(['SUPER_ADMIN','SYSTEM_SUPPORT'])` | Body currently only accepts `name`, `address`; ignores schema fields like `location`, `description`, `amenities`, `managerId` |
| 2 | Facility | GET | `/api/facilities` | List facilities for current club | `requireAuth` | Sorted by name, returns `id,name,address,clubId,createdAt,updatedAt` only |
| 3 | Facility | GET | `/api/facilities/:id` | Fetch facility detail with venue/ground counts | `requireAuth` | No include of `venues`/`grounds` data, only `_count`; RBAC enforced via clubId match |
| 4 | Facility | PUT | `/api/facilities/:id` | Update facility fields | `requireScope('FACILITY')` | Validates same club; only updates `name`/`address` |
| 5 | Facility | DELETE | `/api/facilities/:id` | Hard delete facility | `requireRole(['SUPER_ADMIN'])` | Physically deletes row even though schema has `deletedAt` for soft delete |
| 6 | Venue | POST | `/api/facilities/:facilityId/venues` | Create venue under facility | `requireScope('VENUE')` | Accepts `name`, `venueType`; does not capture `capacity`, `hourlyRate`, `amenities`, `managerId` |
| 7 | Venue | GET | `/api/facilities/:facilityId/venues` | List venues for facility | `requireAuth` | Returns raw DB fields projected via `venueSelect` |
| 8 | Venue | GET | `/api/facilities/venues/:id` | Venue detail + facility summary | `requireAuth` | Includes parent facility; RBAC via club check |
| 9 | Venue | PUT | `/api/facilities/venues/:id` | Update venue | `requireScope('VENUE')` | Allows `name` and `venueType` only |
| 10 | Venue | DELETE | `/api/facilities/venues/:id` | Delete venue | `requireRole(['SUPER_ADMIN','FACILITY_MANAGER'])` | Hard delete; no audit trail |
| 11 | Ground | POST | `/api/facilities/:facilityId/grounds` | Create ground under facility | `requireScope('GROUND')` | Accepts `name`, `groundType`, optional `surfaceType`; ignores `capacity`, `dimensions`, `managerId` |
| 12 | Ground | GET | `/api/facilities/:facilityId/grounds` | List grounds | `requireAuth` | Returns `groundSelect` fields |
| 13 | Ground | GET | `/api/facilities/grounds/:id` | Ground detail + facility summary | `requireAuth` | Includes facility; RBAC via club check |
| 14 | Ground | PUT | `/api/facilities/grounds/:id` | Update ground | `requireScope('GROUND')` | Allows `name`, `surfaceType`; cannot update `groundType`, `capacity`, `isAvailable` |
| 15 | Ground | DELETE | `/api/facilities/grounds/:id` | Delete ground | `requireRole(['SUPER_ADMIN','FACILITY_MANAGER'])` | Hard delete |

## RBAC Confirmation
- **Club scoping**: Every read/write call cross-checks `req.user!.clubId` against the facility’s `clubId`; users without club context receive `400` or `404`.
- **Role/Scope coverage**: Create/delete flows rely on `requireRole`; updates rely on `requireScope`. Missing RBAC items:
  - No `requireScope('FACILITY')` guard on facility creation, meaning SUPER_ADMIN without scope can create facilities anywhere (acceptable) but SYSTEM_SUPPORT also needs facility scope? confirm business rule.
  - List/detail endpoints allow any authenticated role regardless of facility-level permission—may be acceptable but requires confirmation.
- **Permission strings**: No `requirePermission` usage yet (e.g., `facility.manage`), so fine-grained RBAC is not available.

## Payload Contract Snapshot
- **Facility responses**: `{ id, name, address, clubId, createdAt, updatedAt }` (no manager, location, description, amenities, soft-delete metadata).
- **Venue responses**: `mapVenueResponse` renames `venueType` -> `type` fallback but still returns DB fields only.
- **Ground responses**: `mapGroundResponse` shims `surfaceType` -> `surface` but omits other fields.
- **Error handling**: Consistent `400` for validation, `404` for cross-club mismatch, `500` for server errors; no custom codes.

## Identified Gaps & Recommended Follow-ups
1. **Manager / staff assignment APIs missing**
   - Need endpoints to set `managerId` for Facility/Venue/Ground and manage `FacilityStaff` relation.
   - Proposed actions: create `/api/facilities/:id/manager`, `/api/facilities/:id/staff` (POST/DELETE) plus equivalent for venues/grounds.
2. **Metadata fields not exposed**
   - Schema fields (`location`, `description`, `amenities`, `capacity`, `hourlyRate`, `dimensions`, `isAvailable`) are neither accepted on POST/PUT nor returned.
   - Need DTO updates + validation to unblock frontend forms.
3. **Availability / scheduling tables absent**
   - Card requirements mention "Venue schedule" and "Ground availability" but there are no controllers/models for schedules; need clarification or new models/routes.
4. **Soft delete vs hard delete**
   - Controllers call `delete` instead of toggling `deletedAt`; this breaks audit expectations and referential integrity. Recommend switching to soft-delete pattern with restore endpoints.
5. **Search & pagination**
   - All list endpoints return full arrays without pagination/filtering (by availability, type, text search) making them unsuitable for large datasets.
6. **RBAC coverage gaps**
   - No enforcement ensuring only facility/venue managers can update their own resources; `requireScope` may be too broad. Need permission-based guards + cross-check of manager assignments.
7. **Missing aggregated endpoints**
   - No overview route summarizing facilities with nested venues/grounds for dashboards, forcing the frontend to fire multiple calls.
8. **Validation & DTO typing**
   - Request bodies accept raw strings without Zod/Joi validation or TypeScript types, increasing risk of invalid data.

## Proposed Subtasks (to be created as sub-cards / issues)
| Key | Title | Description | Owner | ETA |
| - | - | - | - | - |
| 11A | Metadata DTO expansion | Allow create/update APIs to read/write all schema fields + update selects | Backend | TBD |
| 11B | Manager/staff assignment | CRUD endpoints for assigning managers/staff to facilities/venues/grounds | Backend | TBD |
| 11C | Availability scheduling | Design models + endpoints for venue schedule & ground availability calendar | Backend | TBD |
| 11D | Soft delete + audit | Replace hard deletes with soft delete + restore endpoints | Backend | TBD |
| 11E | Paginated queries | Add pagination/filtering to facility/venue/ground lists | Backend | TBD |
| 11F | Permission-based RBAC | Add `requirePermission` usage for facility_manage/venue_manage/ground_manage | Backend | TBD |

## Next Steps
1. Review findings with product/frontend to validate missing capabilities and prioritize sub-cards (11A–11F).
2. Once approved, update Kanban with new child cards and link them to this audit document.
3. Feed payload updates into Card 12 (API documentation refresh) so Swagger/Postman mirror the improved DTOs.
4. Coordinate with QA to define smoke tests covering new endpoints (ties into Card 13 and Card 18).
