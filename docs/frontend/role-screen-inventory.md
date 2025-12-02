# Role Screen Inventory

This document tracks the frontend screens and components implemented for each of the 22 RBAC roles in the iCoachie platform.

## Legend
- ✅ Complete: Full layout with sidebar, header, and dashboard page
- 🟡 Basic: Dashboard page only (no custom sidebar/header)
- ⏳ Pending: Not yet implemented

## Role Screen Status

### Global Scope Roles

| Role | Route | Status | Components | Notes |
|------|-------|--------|------------|-------|
| SUPER_ADMIN | `/admin/*` | ✅ Complete | admin-sidebar, admin-header, 5 pages | Full admin dashboard with users, roles, clubs, settings |
| SYSTEM_SUPPORT | `/system-support/*` | ✅ Complete | system-support-sidebar, system-support-header, dashboard | Ticket management, diagnostics, user support |

### Club Scope Roles

| Role | Route | Status | Components | Notes |
|------|-------|--------|------------|-------|
| CLUB_ADMIN | `/club/*` | ✅ Complete | club-sidebar, club-header, 5 pages | Dashboard, coaches, members, payments, sessions |
| CLUB_MANAGER | `/club/*` | ✅ Complete | Shares club components | Same interface as CLUB_ADMIN with permission differences |
| HEAD_COACH | `/head-coach/*` | 🟡 Basic | Dashboard page | Coach management, programs, sessions overview |
| COACH | `/coach/*` | ✅ Complete | coach-sidebar, coach-header, 6 pages | Attendance, evaluations, progress, schedule, students |
| ACCOUNTANT | `/accountant/*` | ✅ Complete | accountant-sidebar, accountant-header, dashboard | Financial management, invoices, payments, reports |
| FRONT_DESK | `/front-desk/*` | ✅ Complete | front-desk-sidebar, front-desk-header, dashboard | Check-ins, schedule, bookings, inquiries |
| CONTENT_MANAGER | `/content-manager/*` | ✅ Complete | content-manager-sidebar, content-manager-header, dashboard | Announcements, media, content management |
| MEDICAL_STAFF | `/medical/*` | ✅ Complete | medical-sidebar, medical-header, dashboard | Health records, injuries, first aid |

### Facility Scope Roles

| Role | Route | Status | Components | Notes |
|------|-------|--------|------------|-------|
| FACILITY_MANAGER | `/facility/*` | ✅ Complete | facility-sidebar, facility-header, dashboard | Venues, grounds, staff, maintenance, equipment |
| BOOKINGS_COORDINATOR | `/bookings-coordinator/*` | 🟡 Basic | Dashboard page | Booking management interface |
| MAINTENANCE_TECH | `/maintenance/*` | 🟡 Basic | Dashboard page | Work orders, requests, reports |
| EQUIPMENT_MANAGER | `/equipment/*` | 🟡 Basic | Dashboard page | Inventory, distribution, orders |
| SECURITY_STAFF | `/security/*` | 🟡 Basic | Dashboard page | Incidents, logs, schedules |
| CLEANING_STAFF | `/cleaning/*` | 🟡 Basic | Dashboard page | Schedule, tasks, reports |

### Venue/Ground Scope Roles

| Role | Route | Status | Components | Notes |
|------|-------|--------|------------|-------|
| VENUE_MANAGER | `/venue/*` | 🟡 Basic | Dashboard page | Venue bookings, schedule, issues |
| GROUND_MANAGER | `/ground/*` | 🟡 Basic | Dashboard page | Ground bookings, schedule, conditions |
| GROUNDSKEEPER | `/groundskeeper/*` | 🟡 Basic | Dashboard page | Field conditions, schedule, reports |

### Independent Scope Roles

| Role | Route | Status | Components | Notes |
|------|-------|--------|------------|-------|
| FREELANCER | `/freelancer/*` | ✅ Complete | freelancer-sidebar, freelancer-header, 5 pages | Bookings, clients, earnings, profile |

### User Scope Roles

| Role | Route | Status | Components | Notes |
|------|-------|--------|------------|-------|
| PARENT | `/parent/*` | ✅ Complete | parent-sidebar, parent-header, 5 pages | Kids, bookings, payments, progress |
| STUDENT | `/student/*` | ✅ Complete | student-sidebar, student-header, dashboard | Schedule, progress, evaluations, coaches |

## Implementation Priority

### Phase 1 (Complete) ✅
All 22 roles now have at least a basic dashboard page accessible.

### Phase 2 (Recommended)
Upgrade "Basic" status roles to "Complete" by adding:
1. Custom sidebar with role-specific navigation
2. Custom header with role-specific search and notifications
3. Sub-pages for detailed functionality

### Phase 3 (Future)
1. Connect all screens to backend APIs
2. Implement real-time data updates
3. Add role-specific widgets and analytics
4. Implement mobile-responsive navigation

## File Structure

```
frontend/
├── app/
│   ├── admin/              # SUPER_ADMIN
│   ├── system-support/     # SYSTEM_SUPPORT
│   ├── club/               # CLUB_ADMIN, CLUB_MANAGER
│   ├── head-coach/         # HEAD_COACH
│   ├── coach/              # COACH
│   ├── accountant/         # ACCOUNTANT
│   ├── front-desk/         # FRONT_DESK
│   ├── content-manager/    # CONTENT_MANAGER
│   ├── medical/            # MEDICAL_STAFF
│   ├── facility/           # FACILITY_MANAGER
│   ├── bookings-coordinator/ # BOOKINGS_COORDINATOR
│   ├── maintenance/        # MAINTENANCE_TECH
│   ├── equipment/          # EQUIPMENT_MANAGER
│   ├── security/           # SECURITY_STAFF
│   ├── cleaning/           # CLEANING_STAFF
│   ├── venue/              # VENUE_MANAGER
│   ├── ground/             # GROUND_MANAGER
│   ├── groundskeeper/      # GROUNDSKEEPER
│   ├── freelancer/         # FREELANCER
│   ├── parent/             # PARENT
│   └── student/            # STUDENT
├── components/
│   ├── admin/              # Admin sidebar & header
│   ├── system-support/     # System support sidebar & header
│   ├── club/               # Club sidebar & header
│   ├── coach/              # Coach sidebar & header
│   ├── accountant/         # Accountant sidebar & header
│   ├── front-desk/         # Front desk sidebar & header
│   ├── content-manager/    # Content manager sidebar & header
│   ├── medical/            # Medical staff sidebar & header
│   ├── facility/           # Facility manager sidebar & header
│   ├── freelancer/         # Freelancer sidebar & header
│   ├── parent/             # Parent sidebar & header
│   └── student/            # Student sidebar & header
```

## Permissions Mapping

Each role's screens should enforce their respective permissions as defined in `docs/rbac/permissions.md`:

| Role | Key Permissions |
|------|-----------------|
| SUPER_ADMIN | All permissions |
| SYSTEM_SUPPORT | system.data.view, system.logs.access, system.support.provide |
| CLUB_ADMIN | club.manage, club.users.manage, club.settings.manage |
| CLUB_MANAGER | club.schedules.manage, club.coaches.manage, club.students.manage |
| HEAD_COACH | club.coaches.manage, training.programs.manage, club.sessions.manage |
| COACH | sessions.self.manage, training.students.evaluate, training.attendance.record |
| ACCOUNTANT | finance.view, finance.payments.manage, finance.reports.generate |
| FRONT_DESK | frontdesk.checkin, frontdesk.schedule.view, frontdesk.bookings.basic |
| CONTENT_MANAGER | content.create, content.publish, content.media.manage |
| MEDICAL_STAFF | medical.records.view, medical.injuries.report, medical.care.provide |
| FACILITY_MANAGER | facility.manage, facility.venues.manage, facility.grounds.manage |
| BOOKINGS_COORDINATOR | bookings.manage, bookings.schedule.view, bookings.confirm |
| MAINTENANCE_TECH | maintenance.requests.view, maintenance.workorders.update |
| EQUIPMENT_MANAGER | inventory.manage, inventory.distribute, inventory.track |
| SECURITY_STAFF | security.incidents.report, security.logs.access.local |
| CLEANING_STAFF | cleaning.schedule.view, cleaning.issues.report |
| VENUE_MANAGER | venue.manage, venue.bookings.view, venue.schedule.manage |
| GROUND_MANAGER | ground.manage, ground.bookings.view, ground.schedule.manage |
| GROUNDSKEEPER | ground.conditions.report, ground.status.update |
| FREELANCER | freelance.bookings.create, freelance.schedule.manage |
| PARENT | parent.children.view, parent.coaches.message, parent.payments.make |
| STUDENT | student.schedule.view, student.progress.view, student.evaluations.view |

## Last Updated
2025-12-02 - Initial inventory created covering all 22 roles
