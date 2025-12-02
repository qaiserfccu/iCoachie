# Permission Catalogue & Role Assignments

This document is the human-readable source of truth for RBAC permissions. The canonical machine-readable data lives in `backend/prisma/data/permissions.ts`, which feeds the Prisma seed and any future tooling. Update that file first, then refresh the notes here if descriptions or assignments change.

## Reference Architecture
- **Permission scopes** align with role scopes (`GLOBAL`, `CLUB`, `FACILITY`, `VENUE`, `GROUND`, `INDEPENDENT`, `USER`).
- **Permission codes** follow a `<domain>.<action>` pattern so they can be shared between backend middleware and frontend feature flags.
- **Role assignments** are expressed as arrays of permission codes in the catalog file; SUPER_ADMIN automatically receives the entire set.

## Permission Catalog

### Platform & System
- `system.manage` (GLOBAL) – Full platform configuration and infrastructure control.
- `system.organizations.manage` (GLOBAL) – Create, update, and archive any club or facility tenant.
- `system.data.view` (GLOBAL) – Read access to every tenant’s data for audits.
- `system.settings.manage` (GLOBAL) – Update platform defaults, integrations, and feature flags.
- `system.users.manage` (GLOBAL) – Invite, suspend, or delete any user across tenants.
- `system.roles.manage` (GLOBAL) – Create/update role definitions and assignments.
- `system.logs.access` (GLOBAL) – View platform logs for troubleshooting.
- `system.support.provide` (GLOBAL) – Run diagnostics and provide Tier-2 support.
- `system.passwords.reset` (GLOBAL) – Force reset or issue temporary credentials.

### Club Operations & Coaching
- `club.manage` (CLUB) – Full administrative control over a single club tenant.
- `club.users.manage` (CLUB) – Manage club members’ role assignments.
- `club.data.view` (CLUB) – Read access to all club-owned records.
- `club.settings.manage` (CLUB) – Configure club branding and automation.
- `club.billing.manage` (CLUB) – Configure billing plans and invoicing preferences.
- `club.coaches.manage` (CLUB) – Onboard, schedule, and deactivate coaches.
- `club.students.manage` (CLUB) – Manage athlete profiles and rosters.
- `club.schedules.manage` (CLUB) – Coordinate master calendars and blackout dates.
- `club.sessions.manage` (CLUB) – Create/cancel training sessions and assign resources.
- `training.programs.manage` (CLUB) – Design long-term development plans.
- `training.students.view` (CLUB) – Access student history and readiness notes.
- `training.students.evaluate` (CLUB) – Submit evaluations and progress updates.
- `training.attendance.record` (CLUB) – Record attendance for sessions.
- `training.parents.communicate` (CLUB) – Message parents linked to assigned students.
- `sessions.self.manage` (CLUB) – Coaches manage only their own sessions.
- `students.assigned.view` (CLUB) – Coaches view only assigned students.

### Finance & Front Desk
- `finance.view` (CLUB) – Inspect ledgers, payouts, and cashflow.
- `finance.payments.manage` (CLUB) – Issue, refund, or reconcile payments.
- `finance.reports.generate` (CLUB) – Run accounting/tax statements.
- `finance.transactions.view` (CLUB) – View individual transactions.
- `frontdesk.checkin` (CLUB) – Mark arrivals and check-ins.
- `frontdesk.schedule.view` (CLUB) – View daily schedules at a glance.
- `frontdesk.inquiries.respond` (CLUB) – Respond to incoming questions.
- `frontdesk.bookings.basic` (CLUB) – Create simple bookings from reception.

### Content & Communication
- `content.create` (CLUB) – Draft announcements or newsletters.
- `content.publish` (CLUB) – Publish drafted content to members.
- `content.media.manage` (CLUB) – Manage media library assets.
- `content.moderate` (CLUB) – Approve or reject submissions.

### Health & Safety
- `medical.records.view` (CLUB) – Read medical notes and waivers.
- `medical.injuries.report` (CLUB) – Log injuries or incidents.
- `medical.care.provide` (CLUB) – Document first-aid provided on site.
- `medical.data.access` (CLUB) – Unlock protected medical attachments.

### Facility Management
- `facility.manage` (FACILITY) – Overall facility control.
- `facility.venues.manage` (FACILITY) – Create/retire venues.
- `facility.grounds.manage` (FACILITY) – Create/retire grounds.
- `facility.staff.manage` (FACILITY) – Assign venue managers and staff.
- `facility.bookings.view` (FACILITY) – View bookings across venues/grounds.
- `facility.maintenance.manage` (FACILITY) – Assign and track maintenance.
- `facility.equipment.manage` (FACILITY) – Oversee equipment lifecycle.

### Bookings & Maintenance
- `bookings.manage` (FACILITY) – Full CRUD on bookings.
- `bookings.schedule.view` (FACILITY) – View booking calendars.
- `bookings.clients.communicate` (FACILITY) – Message clients about bookings.
- `bookings.confirm` (FACILITY) – Approve pending bookings.
- `bookings.cancel` (FACILITY) – Cancel or reschedule bookings.
- `maintenance.requests.view` (FACILITY) – View submitted maintenance tickets.
- `maintenance.workorders.update` (FACILITY) – Update/close maintenance work orders.
- `maintenance.issues.report` (FACILITY) – Report new facility issues.

### Inventory, Security, and Cleaning
- `inventory.manage` (FACILITY) – Own supply planning.
- `inventory.distribute` (FACILITY) – Assign equipment to teams/events.
- `inventory.track` (FACILITY) – Track check-in/out history.
- `inventory.order` (FACILITY) – Create purchase/restock orders.
- `security.incidents.report` (FACILITY) – File safety or security incidents.
- `security.logs.access.local` (FACILITY) – View local access/security logs.
- `cleaning.schedule.view` (FACILITY) – View cleaning schedule.
- `cleaning.issues.report` (FACILITY) – Report spills or hazards.
- `cleaning.status.update` (FACILITY) – Update cleaning task status.

### Venue & Ground Specific
- `venue.manage` (VENUE) – Manage a single venue.
- `venue.bookings.view` (VENUE) – View bookings limited to a venue.
- `venue.schedule.manage` (VENUE) – Adjust venue availability.
- `venue.issues.report` (VENUE) – Report venue issues.
- `ground.manage` (GROUND) – Manage a single ground/field.
- `ground.bookings.view` (GROUND) – View bookings limited to a ground.
- `ground.schedule.manage` (GROUND) – Adjust ground availability.
- `ground.issues.report` (GROUND) – Report ground issues.
- `ground.maintenance.request` (GROUND) – Request maintenance for a ground.
- `ground.conditions.report` (GROUND) – Report turf/field conditions.
- `ground.status.update` (GROUND) – Mark ground status (open/closed).

### Freelance & Family Accounts
- `freelance.bookings.create` (INDEPENDENT) – Create freelance bookings.
- `freelance.schedule.manage` (INDEPENDENT) – Manage personal availability.
- `freelance.rates.set` (INDEPENDENT) – Adjust freelance pricing.
- `freelance.bookings.accept` (INDEPENDENT) – Accept/reject booking requests.
- `freelance.clients.message` (INDEPENDENT) – Communicate with freelance clients.
- `parent.children.view` (USER) – View linked children’s information.
- `parent.coaches.message` (USER) – Message assigned coaches.
- `parent.payments.make` (USER) – Pay invoices/dues.
- `parent.sessions.book` (USER) – Book sessions for children.
- `parent.progress.view` (USER) – View children’s evaluations/progress.

### Student Self-Service
- `student.schedule.view` (USER) – View own schedule.
- `student.progress.view` (USER) – View own progress.
- `student.evaluations.view` (USER) – View released evaluations.
- `student.coaches.message` (USER) – Message assigned coaches.

## Role ➜ Permission Matrix

| Role Code | Scope | Permission Codes |
| --- | --- | --- |
| SUPER_ADMIN | GLOBAL | _All permissions_ |
| SYSTEM_SUPPORT | GLOBAL | system.data.view, system.logs.access, system.support.provide, system.passwords.reset |
| CLUB_ADMIN | CLUB | club.manage, club.users.manage, club.data.view, club.settings.manage, club.billing.manage, club.coaches.manage, club.students.manage, club.schedules.manage, club.sessions.manage, bookings.manage, bookings.schedule.view |
| CLUB_MANAGER | CLUB | club.schedules.manage, club.coaches.manage, club.students.manage, club.data.view, club.sessions.manage |
| HEAD_COACH | CLUB | club.coaches.manage, training.programs.manage, club.sessions.manage, training.students.view, training.students.evaluate, club.schedules.manage |
| COACH | CLUB | sessions.self.manage, training.students.evaluate, training.attendance.record, students.assigned.view, training.parents.communicate |
| FREELANCER | INDEPENDENT | freelance.bookings.create, freelance.schedule.manage, freelance.rates.set, freelance.bookings.accept, freelance.clients.message |
| PARENT | USER | parent.children.view, parent.coaches.message, parent.payments.make, parent.sessions.book, parent.progress.view |
| FACILITY_MANAGER | FACILITY | facility.manage, facility.venues.manage, facility.grounds.manage, facility.staff.manage, facility.bookings.view, facility.maintenance.manage, facility.equipment.manage |
| BOOKINGS_COORDINATOR | FACILITY | bookings.manage, bookings.schedule.view, bookings.clients.communicate, bookings.confirm, bookings.cancel |
| VENUE_MANAGER | VENUE | venue.manage, venue.bookings.view, venue.schedule.manage, venue.issues.report |
| GROUND_MANAGER | GROUND | ground.manage, ground.bookings.view, ground.schedule.manage, ground.issues.report, ground.maintenance.request |
| GROUNDSKEEPER | GROUND | ground.conditions.report, ground.status.update, maintenance.issues.report |
| MAINTENANCE_TECH | FACILITY | maintenance.requests.view, maintenance.workorders.update, maintenance.issues.report |
| EQUIPMENT_MANAGER | FACILITY | inventory.manage, inventory.distribute, inventory.track, inventory.order |
| SECURITY_STAFF | FACILITY | security.incidents.report, security.logs.access.local, bookings.schedule.view |
| CLEANING_STAFF | FACILITY | cleaning.schedule.view, cleaning.issues.report, cleaning.status.update |
| ACCOUNTANT | CLUB | finance.view, finance.payments.manage, finance.reports.generate, club.billing.manage, finance.transactions.view |
| FRONT_DESK | CLUB | frontdesk.checkin, frontdesk.schedule.view, frontdesk.inquiries.respond, frontdesk.bookings.basic |
| CONTENT_MANAGER | CLUB | content.create, content.publish, content.media.manage, content.moderate |
| MEDICAL_STAFF | CLUB | medical.records.view, medical.injuries.report, medical.care.provide, medical.data.access |
| STUDENT | USER | student.schedule.view, student.progress.view, student.evaluations.view, student.coaches.message |

## Maintenance Checklist
1. Update `backend/prisma/data/permissions.ts` when adding/removing permissions or changing assignments.
2. Run `npx prisma db seed` (or the project’s seed script) to push changes into the database.
3. Re-run RBAC smoke tests (Kanban Card 9) focusing on `requirePermission` and `requireScope` endpoints.
4. Keep this document aligned with the catalog file so anyone auditing RBAC can cross-reference descriptions quickly.
