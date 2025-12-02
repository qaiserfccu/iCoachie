type PermissionScope = 'GLOBAL' | 'CLUB' | 'FACILITY' | 'VENUE' | 'GROUND' | 'INDEPENDENT' | 'USER';

export type PermissionCode =
  | 'system.manage'
  | 'system.organizations.manage'
  | 'system.data.view'
  | 'system.settings.manage'
  | 'system.users.manage'
  | 'system.roles.manage'
  | 'system.logs.access'
  | 'system.support.provide'
  | 'system.passwords.reset'
  | 'club.manage'
  | 'club.users.manage'
  | 'club.data.view'
  | 'club.settings.manage'
  | 'club.billing.manage'
  | 'club.coaches.manage'
  | 'club.students.manage'
  | 'club.schedules.manage'
  | 'club.sessions.manage'
  | 'training.programs.manage'
  | 'training.students.view'
  | 'training.students.evaluate'
  | 'training.attendance.record'
  | 'training.parents.communicate'
  | 'sessions.self.manage'
  | 'students.assigned.view'
  | 'finance.view'
  | 'finance.payments.manage'
  | 'finance.reports.generate'
  | 'finance.transactions.view'
  | 'frontdesk.checkin'
  | 'frontdesk.schedule.view'
  | 'frontdesk.inquiries.respond'
  | 'frontdesk.bookings.basic'
  | 'content.create'
  | 'content.publish'
  | 'content.media.manage'
  | 'content.moderate'
  | 'medical.records.view'
  | 'medical.injuries.report'
  | 'medical.care.provide'
  | 'medical.data.access'
  | 'facility.manage'
  | 'facility.venues.manage'
  | 'facility.grounds.manage'
  | 'facility.staff.manage'
  | 'facility.bookings.view'
  | 'facility.maintenance.manage'
  | 'facility.equipment.manage'
  | 'bookings.manage'
  | 'bookings.schedule.view'
  | 'bookings.clients.communicate'
  | 'bookings.confirm'
  | 'bookings.cancel'
  | 'maintenance.requests.view'
  | 'maintenance.workorders.update'
  | 'maintenance.issues.report'
  | 'inventory.manage'
  | 'inventory.distribute'
  | 'inventory.track'
  | 'inventory.order'
  | 'security.incidents.report'
  | 'security.logs.access.local'
  | 'cleaning.schedule.view'
  | 'cleaning.issues.report'
  | 'cleaning.status.update'
  | 'venue.manage'
  | 'venue.bookings.view'
  | 'venue.schedule.manage'
  | 'venue.issues.report'
  | 'ground.manage'
  | 'ground.bookings.view'
  | 'ground.schedule.manage'
  | 'ground.issues.report'
  | 'ground.maintenance.request'
  | 'ground.conditions.report'
  | 'ground.status.update'
  | 'freelance.bookings.create'
  | 'freelance.schedule.manage'
  | 'freelance.rates.set'
  | 'freelance.bookings.accept'
  | 'freelance.clients.message'
  | 'parent.children.view'
  | 'parent.coaches.message'
  | 'parent.payments.make'
  | 'parent.sessions.book'
  | 'parent.progress.view'
  | 'student.schedule.view'
  | 'student.progress.view'
  | 'student.evaluations.view'
  | 'student.coaches.message';

interface PermissionDefinition {
  code: PermissionCode;
  name: string;
  description: string;
  scope: PermissionScope;
  category: string;
}

export const PERMISSION_CATALOG: PermissionDefinition[] = [
  {
    code: 'system.manage',
    name: 'Manage Platform',
    description: 'Full platform configuration, deployments, and infrastructure level changes.',
    scope: 'GLOBAL',
    category: 'system',
  },
  {
    code: 'system.organizations.manage',
    name: 'Manage All Organizations',
    description: 'Create, update, and archive any club or facility tenant.',
    scope: 'GLOBAL',
    category: 'system',
  },
  {
    code: 'system.data.view',
    name: 'View All Data',
    description: 'Read access to every tenant’s data set for auditing purposes.',
    scope: 'GLOBAL',
    category: 'system',
  },
  {
    code: 'system.settings.manage',
    name: 'Manage Global Settings',
    description: 'Update feature flags, platform defaults, and integrations.',
    scope: 'GLOBAL',
    category: 'system',
  },
  {
    code: 'system.users.manage',
    name: 'Manage All Users',
    description: 'Invite, suspend, or delete any user account across tenants.',
    scope: 'GLOBAL',
    category: 'system',
  },
  {
    code: 'system.roles.manage',
    name: 'Manage Roles',
    description: 'Create and update role definitions and assignments.',
    scope: 'GLOBAL',
    category: 'system',
  },
  {
    code: 'system.logs.access',
    name: 'Access Platform Logs',
    description: 'View security and application logs for troubleshooting.',
    scope: 'GLOBAL',
    category: 'system',
  },
  {
    code: 'system.support.provide',
    name: 'Provide Tier-2 Support',
    description: 'Run diagnostics and support scripts when helping customers.',
    scope: 'GLOBAL',
    category: 'system',
  },
  {
    code: 'system.passwords.reset',
    name: 'Reset Any Password',
    description: 'Force reset or issue temporary credentials for users.',
    scope: 'GLOBAL',
    category: 'system',
  },
  {
    code: 'club.manage',
    name: 'Manage Club',
    description: 'Full administrative control over a single club tenant.',
    scope: 'CLUB',
    category: 'club',
  },
  {
    code: 'club.users.manage',
    name: 'Manage Club Users',
    description: 'Invite, assign roles, or remove coaches, staff, and families.',
    scope: 'CLUB',
    category: 'club',
  },
  {
    code: 'club.data.view',
    name: 'View Club Data',
    description: 'Read access to all club-owned records including schedules and rosters.',
    scope: 'CLUB',
    category: 'club',
  },
  {
    code: 'club.settings.manage',
    name: 'Manage Club Settings',
    description: 'Update branding, policies, and automation rules for the club.',
    scope: 'CLUB',
    category: 'club',
  },
  {
    code: 'club.billing.manage',
    name: 'Manage Club Billing',
    description: 'Configure billing plans, discounts, and invoicing preferences.',
    scope: 'CLUB',
    category: 'finance',
  },
  {
    code: 'club.coaches.manage',
    name: 'Manage Coaches',
    description: 'Onboard, schedule, and deactivate coaches tied to the club.',
    scope: 'CLUB',
    category: 'club',
  },
  {
    code: 'club.students.manage',
    name: 'Manage Students',
    description: 'Add, update, and remove athlete profiles within the club.',
    scope: 'CLUB',
    category: 'club',
  },
  {
    code: 'club.schedules.manage',
    name: 'Manage Club Schedules',
    description: 'Coordinate master calendars, holidays, and block-off windows.',
    scope: 'CLUB',
    category: 'operations',
  },
  {
    code: 'club.sessions.manage',
    name: 'Manage Club Sessions',
    description: 'Create or cancel training sessions and assign resources.',
    scope: 'CLUB',
    category: 'operations',
  },
  {
    code: 'training.programs.manage',
    name: 'Manage Training Programs',
    description: 'Design curricula and long-term development plans.',
    scope: 'CLUB',
    category: 'training',
  },
  {
    code: 'training.students.view',
    name: 'View Student Data',
    description: 'Access student profiles, history, and readiness notes.',
    scope: 'CLUB',
    category: 'training',
  },
  {
    code: 'training.students.evaluate',
    name: 'Evaluate Students',
    description: 'Submit evaluations and progress updates for athletes.',
    scope: 'CLUB',
    category: 'training',
  },
  {
    code: 'training.attendance.record',
    name: 'Record Attendance',
    description: 'Mark attendance and participation outcomes for sessions.',
    scope: 'CLUB',
    category: 'training',
  },
  {
    code: 'training.parents.communicate',
    name: 'Communicate With Parents',
    description: 'Send messages or updates to parents tied to assigned students.',
    scope: 'CLUB',
    category: 'communications',
  },
  {
    code: 'sessions.self.manage',
    name: 'Manage Own Sessions',
    description: 'Create and adjust only the sessions owned by the authenticated coach.',
    scope: 'CLUB',
    category: 'training',
  },
  {
    code: 'students.assigned.view',
    name: 'View Assigned Students',
    description: 'See rosters limited to the coach’s assigned athletes.',
    scope: 'CLUB',
    category: 'training',
  },
  {
    code: 'finance.view',
    name: 'View Financials',
    description: 'Inspect club-level ledgers, payouts, and cashflow.',
    scope: 'CLUB',
    category: 'finance',
  },
  {
    code: 'finance.payments.manage',
    name: 'Manage Payments',
    description: 'Issue, refund, or reconcile payments for services.',
    scope: 'CLUB',
    category: 'finance',
  },
  {
    code: 'finance.reports.generate',
    name: 'Generate Financial Reports',
    description: 'Run statements for accounting, taxes, or stakeholders.',
    scope: 'CLUB',
    category: 'finance',
  },
  {
    code: 'finance.transactions.view',
    name: 'View Transactions',
    description: 'See individual payment attempts and their status.',
    scope: 'CLUB',
    category: 'finance',
  },
  {
    code: 'frontdesk.checkin',
    name: 'Check In Users',
    description: 'Mark arrivals and handle day-of attendance from the desk.',
    scope: 'CLUB',
    category: 'operations',
  },
  {
    code: 'frontdesk.schedule.view',
    name: 'View Daily Schedule',
    description: 'Quick access to upcoming sessions and resource allocations.',
    scope: 'CLUB',
    category: 'operations',
  },
  {
    code: 'frontdesk.inquiries.respond',
    name: 'Respond to Inquiries',
    description: 'Answer inbound questions from members or visitors.',
    scope: 'CLUB',
    category: 'operations',
  },
  {
    code: 'frontdesk.bookings.basic',
    name: 'Create Basic Bookings',
    description: 'Reserve sessions or trials via simplified booking workflow.',
    scope: 'CLUB',
    category: 'operations',
  },
  {
    code: 'content.create',
    name: 'Create Content',
    description: 'Draft announcements, posts, or newsletters.',
    scope: 'CLUB',
    category: 'communications',
  },
  {
    code: 'content.publish',
    name: 'Publish Content',
    description: 'Publish drafts to member portals or mobile apps.',
    scope: 'CLUB',
    category: 'communications',
  },
  {
    code: 'content.media.manage',
    name: 'Manage Media Library',
    description: 'Upload and organize photos, videos, and resources.',
    scope: 'CLUB',
    category: 'communications',
  },
  {
    code: 'content.moderate',
    name: 'Moderate Content',
    description: 'Approve or reject user-generated submissions.',
    scope: 'CLUB',
    category: 'communications',
  },
  {
    code: 'medical.records.view',
    name: 'View Health Records',
    description: 'Read medical notes, waivers, and treatment history.',
    scope: 'CLUB',
    category: 'medical',
  },
  {
    code: 'medical.injuries.report',
    name: 'Report Injuries',
    description: 'Log injuries or incidents tied to athletes or events.',
    scope: 'CLUB',
    category: 'medical',
  },
  {
    code: 'medical.care.provide',
    name: 'Provide First Aid',
    description: 'Document treatments administered on site.',
    scope: 'CLUB',
    category: 'medical',
  },
  {
    code: 'medical.data.access',
    name: 'Access Sensitive Medical Data',
    description: 'Unlock protected medical attachments or notes.',
    scope: 'CLUB',
    category: 'medical',
  },
  {
    code: 'facility.manage',
    name: 'Manage Facility',
    description: 'Global control over a facility, its staff, and operations.',
    scope: 'FACILITY',
    category: 'facility',
  },
  {
    code: 'facility.venues.manage',
    name: 'Manage Venues',
    description: 'Create or retire venues under the facility.',
    scope: 'FACILITY',
    category: 'facility',
  },
  {
    code: 'facility.grounds.manage',
    name: 'Manage Grounds',
    description: 'Create or retire outdoor grounds and assign leads.',
    scope: 'FACILITY',
    category: 'facility',
  },
  {
    code: 'facility.staff.manage',
    name: 'Manage Facility Staff',
    description: 'Assign venue managers, cleaners, and maintenance teams.',
    scope: 'FACILITY',
    category: 'facility',
  },
  {
    code: 'facility.bookings.view',
    name: 'View Facility Bookings',
    description: 'See bookings across all venues and grounds under the facility.',
    scope: 'FACILITY',
    category: 'facility',
  },
  {
    code: 'facility.maintenance.manage',
    name: 'Manage Maintenance',
    description: 'Assign maintenance tasks and track completion.',
    scope: 'FACILITY',
    category: 'facility',
  },
  {
    code: 'facility.equipment.manage',
    name: 'Manage Equipment',
    description: 'Oversee equipment lifecycle, repairs, and assignments.',
    scope: 'FACILITY',
    category: 'facility',
  },
  {
    code: 'bookings.manage',
    name: 'Manage Bookings',
    description: 'Create, edit, and delete bookings for clients.',
    scope: 'FACILITY',
    category: 'bookings',
  },
  {
    code: 'bookings.schedule.view',
    name: 'View Booking Schedule',
    description: 'See the bookings calendar for venues and grounds.',
    scope: 'FACILITY',
    category: 'bookings',
  },
  {
    code: 'bookings.clients.communicate',
    name: 'Communicate With Clients',
    description: 'Message clients regarding their bookings.',
    scope: 'FACILITY',
    category: 'bookings',
  },
  {
    code: 'bookings.confirm',
    name: 'Confirm Bookings',
    description: 'Approve or confirm pending booking requests.',
    scope: 'FACILITY',
    category: 'bookings',
  },
  {
    code: 'bookings.cancel',
    name: 'Cancel Bookings',
    description: 'Cancel or reschedule bookings on behalf of clients.',
    scope: 'FACILITY',
    category: 'bookings',
  },
  {
    code: 'maintenance.requests.view',
    name: 'View Maintenance Requests',
    description: 'See submitted maintenance tickets for facilities.',
    scope: 'FACILITY',
    category: 'maintenance',
  },
  {
    code: 'maintenance.workorders.update',
    name: 'Update Work Orders',
    description: 'Log maintenance progress and mark jobs complete.',
    scope: 'FACILITY',
    category: 'maintenance',
  },
  {
    code: 'maintenance.issues.report',
    name: 'Report Maintenance Issues',
    description: 'Submit facility or equipment issues needing attention.',
    scope: 'FACILITY',
    category: 'maintenance',
  },
  {
    code: 'inventory.manage',
    name: 'Manage Inventory',
    description: 'Own supply planning and availability for equipment.',
    scope: 'FACILITY',
    category: 'inventory',
  },
  {
    code: 'inventory.distribute',
    name: 'Distribute Equipment',
    description: 'Assign equipment to teams or events.',
    scope: 'FACILITY',
    category: 'inventory',
  },
  {
    code: 'inventory.track',
    name: 'Track Equipment',
    description: 'Monitor check-in/out history for equipment.',
    scope: 'FACILITY',
    category: 'inventory',
  },
  {
    code: 'inventory.order',
    name: 'Order Supplies',
    description: 'Create purchase orders or restock requests.',
    scope: 'FACILITY',
    category: 'inventory',
  },
  {
    code: 'security.incidents.report',
    name: 'Report Incidents',
    description: 'Document security incidents or safety escalations.',
    scope: 'FACILITY',
    category: 'security',
  },
  {
    code: 'security.logs.access.local',
    name: 'Access Security Logs',
    description: 'View door access and surveillance summaries.',
    scope: 'FACILITY',
    category: 'security',
  },
  {
    code: 'cleaning.schedule.view',
    name: 'View Cleaning Schedule',
    description: 'See which areas need servicing and when.',
    scope: 'FACILITY',
    category: 'operations',
  },
  {
    code: 'cleaning.issues.report',
    name: 'Report Cleaning Issues',
    description: 'Flag spills, hazards, or areas needing extra attention.',
    scope: 'FACILITY',
    category: 'operations',
  },
  {
    code: 'cleaning.status.update',
    name: 'Update Cleaning Status',
    description: 'Mark cleaning tasks as in progress or complete.',
    scope: 'FACILITY',
    category: 'operations',
  },
  {
    code: 'venue.manage',
    name: 'Manage Venue',
    description: 'Full control over a single venue’s configuration.',
    scope: 'VENUE',
    category: 'facility',
  },
  {
    code: 'venue.bookings.view',
    name: 'View Venue Bookings',
    description: 'See bookings limited to the venue.',
    scope: 'VENUE',
    category: 'facility',
  },
  {
    code: 'venue.schedule.manage',
    name: 'Manage Venue Schedule',
    description: 'Edit timeslots and maintenance blocks for the venue.',
    scope: 'VENUE',
    category: 'facility',
  },
  {
    code: 'venue.issues.report',
    name: 'Report Venue Issues',
    description: 'File issues scoped to the venue.',
    scope: 'VENUE',
    category: 'facility',
  },
  {
    code: 'ground.manage',
    name: 'Manage Ground',
    description: 'Full control over a single outdoor ground.',
    scope: 'GROUND',
    category: 'facility',
  },
  {
    code: 'ground.bookings.view',
    name: 'View Ground Bookings',
    description: 'See bookings limited to the ground.',
    scope: 'GROUND',
    category: 'facility',
  },
  {
    code: 'ground.schedule.manage',
    name: 'Manage Ground Schedule',
    description: 'Edit availability and events for the ground.',
    scope: 'GROUND',
    category: 'facility',
  },
  {
    code: 'ground.issues.report',
    name: 'Report Ground Issues',
    description: 'File issues scoped to the ground.',
    scope: 'GROUND',
    category: 'facility',
  },
  {
    code: 'ground.maintenance.request',
    name: 'Request Ground Maintenance',
    description: 'Ask facility teams for grounds work.',
    scope: 'GROUND',
    category: 'facility',
  },
  {
    code: 'ground.conditions.report',
    name: 'Report Field Conditions',
    description: 'Share turf status or playable conditions.',
    scope: 'GROUND',
    category: 'facility',
  },
  {
    code: 'ground.status.update',
    name: 'Update Field Status',
    description: 'Mark fields as open, closed, or limited.',
    scope: 'GROUND',
    category: 'facility',
  },
  {
    code: 'freelance.bookings.create',
    name: 'Create Freelance Bookings',
    description: 'Create bookings for independent sessions.',
    scope: 'INDEPENDENT',
    category: 'freelance',
  },
  {
    code: 'freelance.schedule.manage',
    name: 'Manage Freelance Schedule',
    description: 'Control availability as a freelancer.',
    scope: 'INDEPENDENT',
    category: 'freelance',
  },
  {
    code: 'freelance.rates.set',
    name: 'Set Freelance Rates',
    description: 'Adjust pricing for services.',
    scope: 'INDEPENDENT',
    category: 'freelance',
  },
  {
    code: 'freelance.bookings.accept',
    name: 'Accept Freelance Bookings',
    description: 'Approve inbound client requests.',
    scope: 'INDEPENDENT',
    category: 'freelance',
  },
  {
    code: 'freelance.clients.message',
    name: 'Message Freelance Clients',
    description: 'Communicate directly with clients using the platform inbox.',
    scope: 'INDEPENDENT',
    category: 'freelance',
  },
  {
    code: 'parent.children.view',
    name: 'View Children Data',
    description: 'See schedules, attendance, and billing for linked children.',
    scope: 'USER',
    category: 'family',
  },
  {
    code: 'parent.coaches.message',
    name: 'Message Coaches',
    description: 'Send messages to assigned coaches.',
    scope: 'USER',
    category: 'family',
  },
  {
    code: 'parent.payments.make',
    name: 'Make Payments',
    description: 'Pay invoices or dues for children.',
    scope: 'USER',
    category: 'family',
  },
  {
    code: 'parent.sessions.book',
    name: 'Book Sessions',
    description: 'Book classes or events for children.',
    scope: 'USER',
    category: 'family',
  },
  {
    code: 'parent.progress.view',
    name: 'View Progress',
    description: 'View evaluations, goals, and feedback for children.',
    scope: 'USER',
    category: 'family',
  },
  {
    code: 'student.schedule.view',
    name: 'View Own Schedule',
    description: 'See personal schedule of upcoming sessions.',
    scope: 'USER',
    category: 'student',
  },
  {
    code: 'student.progress.view',
    name: 'View Own Progress',
    description: 'Read training plans, milestones, and progress history.',
    scope: 'USER',
    category: 'student',
  },
  {
    code: 'student.evaluations.view',
    name: 'View Own Evaluations',
    description: 'Access completed evaluations shared with the student.',
    scope: 'USER',
    category: 'student',
  },
  {
    code: 'student.coaches.message',
    name: 'Message Coaches',
    description: 'Message coaches who are assigned to the student.',
    scope: 'USER',
    category: 'student',
  },
];

const ALL_PERMISSION_CODES = PERMISSION_CATALOG.map((permission) => permission.code);

export const ROLE_PERMISSION_ASSIGNMENTS: Record<string, PermissionCode[]> = {
  SUPER_ADMIN: ALL_PERMISSION_CODES,
  SYSTEM_SUPPORT: ['system.data.view', 'system.logs.access', 'system.support.provide', 'system.passwords.reset'],
  CLUB_ADMIN: [
    'club.manage',
    'club.users.manage',
    'club.data.view',
    'club.settings.manage',
    'club.billing.manage',
    'club.coaches.manage',
    'club.students.manage',
    'club.schedules.manage',
    'club.sessions.manage',
    'bookings.manage',
    'bookings.schedule.view',
  ],
  CLUB_MANAGER: ['club.schedules.manage', 'club.coaches.manage', 'club.students.manage', 'club.data.view', 'club.sessions.manage'],
  HEAD_COACH: [
    'club.coaches.manage',
    'training.programs.manage',
    'club.sessions.manage',
    'training.students.view',
    'training.students.evaluate',
    'club.schedules.manage',
  ],
  COACH: [
    'sessions.self.manage',
    'training.students.evaluate',
    'training.attendance.record',
    'students.assigned.view',
    'training.parents.communicate',
  ],
  FREELANCER: [
    'freelance.bookings.create',
    'freelance.schedule.manage',
    'freelance.rates.set',
    'freelance.bookings.accept',
    'freelance.clients.message',
  ],
  PARENT: ['parent.children.view', 'parent.coaches.message', 'parent.payments.make', 'parent.sessions.book', 'parent.progress.view'],
  FACILITY_MANAGER: [
    'facility.manage',
    'facility.venues.manage',
    'facility.grounds.manage',
    'facility.staff.manage',
    'facility.bookings.view',
    'facility.maintenance.manage',
    'facility.equipment.manage',
  ],
  BOOKINGS_COORDINATOR: [
    'bookings.manage',
    'bookings.schedule.view',
    'bookings.clients.communicate',
    'bookings.confirm',
    'bookings.cancel',
  ],
  VENUE_MANAGER: ['venue.manage', 'venue.bookings.view', 'venue.schedule.manage', 'venue.issues.report'],
  GROUND_MANAGER: [
    'ground.manage',
    'ground.bookings.view',
    'ground.schedule.manage',
    'ground.issues.report',
    'ground.maintenance.request',
  ],
  GROUNDSKEEPER: ['ground.conditions.report', 'ground.status.update', 'maintenance.issues.report'],
  MAINTENANCE_TECH: ['maintenance.requests.view', 'maintenance.workorders.update', 'maintenance.issues.report'],
  EQUIPMENT_MANAGER: ['inventory.manage', 'inventory.distribute', 'inventory.track', 'inventory.order'],
  SECURITY_STAFF: ['security.incidents.report', 'security.logs.access.local', 'bookings.schedule.view'],
  CLEANING_STAFF: ['cleaning.schedule.view', 'cleaning.issues.report', 'cleaning.status.update'],
  ACCOUNTANT: ['finance.view', 'finance.payments.manage', 'finance.reports.generate', 'club.billing.manage', 'finance.transactions.view'],
  FRONT_DESK: ['frontdesk.checkin', 'frontdesk.schedule.view', 'frontdesk.inquiries.respond', 'frontdesk.bookings.basic'],
  CONTENT_MANAGER: ['content.create', 'content.publish', 'content.media.manage', 'content.moderate'],
  MEDICAL_STAFF: ['medical.records.view', 'medical.injuries.report', 'medical.care.provide', 'medical.data.access'],
  STUDENT: ['student.schedule.view', 'student.progress.view', 'student.evaluations.view', 'student.coaches.message'],
};

export function buildPermissionMap(roleCode: string): Record<string, boolean> {
  const codes = ROLE_PERMISSION_ASSIGNMENTS[roleCode] ?? [];
  return codes.reduce<Record<string, boolean>>((acc, code) => {
    acc[code] = true;
    return acc;
  }, {});
}

export function getAllPermissionCodes(): PermissionCode[] {
  return ALL_PERMISSION_CODES;
}