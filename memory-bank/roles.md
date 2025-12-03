# iCoachie Role-Based Access Control (RBAC)

## Role Hierarchy and Scopes

### Global Scope Roles (Platform-Wide)

#### 1. SUPER_ADMIN
- **Description**: Platform-wide administrative access with full control over all organizations, users, and system settings
- **Permissions**:
  - canManageSystem: true
  - canManageAllOrgs: true
  - canViewAllData: true
  - canModifySettings: true
  - canManageUsers: true
  - canManageRoles: true

#### 2. SYSTEM_SUPPORT
- **Description**: Technical support team with read access and limited troubleshooting capabilities across the platform
- **Permissions**:
  - canViewAllData: true
  - canAccessLogs: true
  - canProvideSupport: true
  - canResetPasswords: true

### Club Scope Roles (Organization-Level)

#### 3. CLUB_ADMIN
- **Description**: Full administrative control over a specific club/organization including user management, settings, and billing
- **Permissions**:
  - canManageClub: true
  - canManageClubUsers: true
  - canViewClubData: true
  - canManageClubSettings: true
  - canManageBilling: true
  - canManageCoaches: true
  - canManageStudents: true

#### 4. CLUB_MANAGER
- **Description**: Operational management of club activities, scheduling, and day-to-day operations without billing access
- **Permissions**:
  - canManageSchedules: true
  - canManageCoaches: true
  - canManageStudents: true
  - canViewClubData: true
  - canManageSessions: true

#### 5. HEAD_COACH
- **Description**: Lead coaching role with ability to manage other coaches, create training programs, and oversee all coaching activities
- **Permissions**:
  - canManageCoaches: true
  - canCreatePrograms: true
  - canManageSessions: true
  - canViewStudentData: true
  - canEvaluateStudents: true
  - canManageSchedules: true

#### 6. COACH
- **Description**: Individual coach who can manage their own sessions, evaluate students, and track attendance
- **Permissions**:
  - canManageOwnSessions: true
  - canEvaluateStudents: true
  - canMarkAttendance: true
  - canViewAssignedStudents: true
  - canCommunicateWithParents: true

#### 7. ACCOUNTANT
- **Description**: Financial management including payments, billing, and financial reporting for the club
- **Permissions**:
  - canViewFinancials: true
  - canManagePayments: true
  - canGenerateReports: true
  - canManageBilling: true
  - canViewTransactions: true

#### 8. FRONT_DESK
- **Description**: Front desk personnel handling check-ins, inquiries, and basic administrative tasks
- **Permissions**:
  - canCheckInUsers: true
  - canViewSchedules: true
  - canAnswerInquiries: true
  - canMakeBasicBookings: true

#### 9. CONTENT_MANAGER
- **Description**: Manages digital content, announcements, and communications for the club
- **Permissions**:
  - canCreateContent: true
  - canPublishAnnouncements: true
  - canManageMedia: true
  - canModerateContent: true

#### 10. MEDICAL_STAFF
- **Description**: Medical personnel including physiotherapists, doctors, and first aid providers
- **Permissions**:
  - canViewHealthRecords: true
  - canReportInjuries: true
  - canProvideFirstAid: true
  - canAccessMedicalData: true

### Facility Scope Roles (Facility-Wide)

#### 11. FACILITY_MANAGER
- **Description**: Overall management of a sports facility including all venues, grounds, staff, and operations
- **Permissions**:
  - canManageFacility: true
  - canManageVenues: true
  - canManageGrounds: true
  - canManageStaff: true
  - canViewBookings: true
  - canManageMaintenance: true
  - canManageEquipment: true

#### 12. BOOKINGS_COORDINATOR
- **Description**: Manages all venue and ground bookings, scheduling, and coordination with clients
- **Permissions**:
  - canManageBookings: true
  - canViewSchedules: true
  - canCommunicateWithClients: true
  - canConfirmBookings: true
  - canCancelBookings: true

#### 13. MAINTENANCE_TECH
- **Description**: Handles facility maintenance, repairs, and equipment servicing
- **Permissions**:
  - canViewMaintenanceRequests: true
  - canUpdateWorkOrders: true
  - canReportIssues: true

#### 14. EQUIPMENT_MANAGER
- **Description**: Manages sports equipment inventory, distribution, and maintenance
- **Permissions**:
  - canManageInventory: true
  - canDistributeEquipment: true
  - canTrackEquipment: true
  - canOrderSupplies: true

#### 15. SECURITY_STAFF
- **Description**: Facility security personnel with access control and incident reporting
- **Permissions**:
  - canViewSchedules: true
  - canReportIncidents: true
  - canAccessSecurityLogs: true

#### 16. CLEANING_STAFF
- **Description**: Facility cleaning and housekeeping personnel
- **Permissions**:
  - canViewCleaningSchedule: true
  - canReportIssues: true
  - canUpdateCleaningStatus: true

### Venue Scope Roles (Venue-Specific)

#### 17. VENUE_MANAGER
- **Description**: Manages a specific venue within a facility (e.g., indoor hall, court)
- **Permissions**:
  - canManageVenue: true
  - canViewVenueBookings: true
  - canManageVenueSchedule: true
  - canReportIssues: true

### Ground Scope Roles (Ground-Specific)

#### 18. GROUND_MANAGER
- **Description**: Manages a specific ground/field within a facility
- **Permissions**:
  - canManageGround: true
  - canViewGroundBookings: true
  - canManageGroundSchedule: true
  - canReportIssues: true
  - canRequestMaintenance: true

#### 19. GROUNDSKEEPER
- **Description**: Maintains grounds and fields, responsible for turf care, marking, and field preparation
- **Permissions**:
  - canReportConditions: true
  - canViewMaintenanceSchedule: true
  - canUpdateFieldStatus: true

### Independent Scope Roles (Self-Managed)

#### 20. FREELANCER
- **Description**: Independent coach not tied to a specific club, can create bookings and manage their own schedule
- **Permissions**:
  - canCreateBookings: true
  - canManageOwnSchedule: true
  - canSetRates: true
  - canAcceptBookings: true
  - canCommunicateWithClients: true

### User Scope Roles (Personal)

#### 21. PARENT
- **Description**: Guardian/parent account with access to their children's activities, progress, and communication with coaches
- **Permissions**:
  - canViewChildrenData: true
  - canCommunicateWithCoaches: true
  - canMakePayments: true
  - canBookSessions: true
  - canViewProgress: true

#### 22. STUDENT
- **Description**: Student/athlete account with access to their own schedules, progress, and training materials
- **Permissions**:
  - canViewOwnSchedule: true
  - canViewOwnProgress: true
  - canViewOwnEvaluations: true
  - canCommunicateWithCoaches: true

## Implementation Details

### Database Schema
- **roles table**: Stores all 22 roles with code, name, description, scope, permissions (JSONB), isActive, sortOrder
- **user_roles table**: Many-to-many relationship allowing users to have multiple roles
- **users.primaryRoleId**: Foreign key to roles table for main role assignment
- **users.facilityId**: Links facility staff to their facility

### Facility Management
- **facilities table**: Top-level facility with manager assignment
- **venues table**: Bookable spaces (halls, courts) within facilities with venue managers
- **grounds table**: Outdoor fields/grounds with ground managers and groundskeepers

### Status Lookup Tables (Database-Driven)
- **user_statuses**: ACTIVE, PENDING, SUSPENDED, INACTIVE
- **session_statuses**: SCHEDULED, ONGOING, COMPLETED, CANCELLED
- **attendance_statuses**: PRESENT, LATE, ABSENT
- **payment_statuses**: PENDING, COMPLETED, FAILED, REFUNDED
- **booking_statuses**: PENDING, CONFIRMED, COMPLETED, CANCELLED
- **membership_types**: STANDARD, PREMIUM

## Migration Status

✅ Schema migration complete
✅ All 22 roles seeded
✅ All status lookup tables populated
✅ Facility management models created