import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Seed User Statuses
  console.log('📊 Seeding User Statuses...');
  const userStatuses = [
    { code: 'ACTIVE', name: 'Active', sortOrder: 1 },
    { code: 'PENDING', name: 'Pending Verification', sortOrder: 2 },
    { code: 'SUSPENDED', name: 'Suspended', sortOrder: 3 },
    { code: 'INACTIVE', name: 'Inactive', sortOrder: 4 },
  ];

  for (const status of userStatuses) {
    await prisma.userStatus.upsert({
      where: { code: status.code },
      update: { name: status.name, sortOrder: status.sortOrder },
      create: status,
    });
  }

  // Seed Session Statuses
  console.log('📅 Seeding Session Statuses...');
  const sessionStatuses = [
    { code: 'SCHEDULED', name: 'Scheduled', sortOrder: 1 },
    { code: 'ONGOING', name: 'Ongoing', sortOrder: 2 },
    { code: 'COMPLETED', name: 'Completed', sortOrder: 3 },
    { code: 'CANCELLED', name: 'Cancelled', sortOrder: 4 },
  ];

  for (const status of sessionStatuses) {
    await prisma.sessionStatus.upsert({
      where: { code: status.code },
      update: { name: status.name, sortOrder: status.sortOrder },
      create: status,
    });
  }

  // Seed Attendance Statuses
  console.log('✅ Seeding Attendance Statuses...');
  const attendanceStatuses = [
    { code: 'PRESENT', name: 'Present', sortOrder: 1 },
    { code: 'LATE', name: 'Late', sortOrder: 2 },
    { code: 'ABSENT', name: 'Absent', sortOrder: 3 },
  ];

  for (const status of attendanceStatuses) {
    await prisma.attendanceStatus.upsert({
      where: { code: status.code },
      update: { name: status.name, sortOrder: status.sortOrder },
      create: status,
    });
  }

  // Seed Payment Statuses
  console.log('💳 Seeding Payment Statuses...');
  const paymentStatuses = [
    { code: 'PENDING', name: 'Pending', sortOrder: 1 },
    { code: 'COMPLETED', name: 'Completed', sortOrder: 2 },
    { code: 'FAILED', name: 'Failed', sortOrder: 3 },
    { code: 'REFUNDED', name: 'Refunded', sortOrder: 4 },
  ];

  for (const status of paymentStatuses) {
    await prisma.paymentStatus.upsert({
      where: { code: status.code },
      update: { name: status.name, sortOrder: status.sortOrder },
      create: status,
    });
  }

  // Seed Booking Statuses
  console.log('📝 Seeding Booking Statuses...');
  const bookingStatuses = [
    { code: 'PENDING', name: 'Pending', sortOrder: 1 },
    { code: 'CONFIRMED', name: 'Confirmed', sortOrder: 2 },
    { code: 'COMPLETED', name: 'Completed', sortOrder: 3 },
    { code: 'CANCELLED', name: 'Cancelled', sortOrder: 4 },
  ];

  for (const status of bookingStatuses) {
    await prisma.bookingStatus.upsert({
      where: { code: status.code },
      update: { name: status.name, sortOrder: status.sortOrder },
      create: status,
    });
  }

  // Seed Membership Types
  console.log('🎫 Seeding Membership Types...');
  const membershipTypes = [
    { code: 'STANDARD', name: 'Standard Membership', sortOrder: 1 },
    { code: 'PREMIUM', name: 'Premium Membership', sortOrder: 2 },
  ];

  for (const type of membershipTypes) {
    await prisma.membershipType.upsert({
      where: { code: type.code },
      update: { name: type.name, sortOrder: type.sortOrder },
      create: type,
    });
  }

  // Seed All 22 Roles with complete definitions
  console.log('👥 Seeding 22 Role Types...');
  const roles = [
    {
      code: 'SUPER_ADMIN',
      name: 'Super Administrator',
      description: 'Platform-wide administrative access with full control over all organizations, users, and system settings',
      scope: 'GLOBAL',
      permissions: {
        canManageSystem: true,
        canManageAllOrgs: true,
        canViewAllData: true,
        canModifySettings: true,
        canManageUsers: true,
        canManageRoles: true,
      },
      sortOrder: 1,
    },
    {
      code: 'SYSTEM_SUPPORT',
      name: 'System Support',
      description: 'Technical support team with read access and limited troubleshooting capabilities across the platform',
      scope: 'GLOBAL',
      permissions: {
        canViewAllData: true,
        canAccessLogs: true,
        canProvideSupport: true,
        canResetPasswords: true,
      },
      sortOrder: 2,
    },
    {
      code: 'CLUB_ADMIN',
      name: 'Club Administrator',
      description: 'Full administrative control over a specific club/organization including user management, settings, and billing',
      scope: 'CLUB',
      permissions: {
        canManageClub: true,
        canManageClubUsers: true,
        canViewClubData: true,
        canManageClubSettings: true,
        canManageBilling: true,
        canManageCoaches: true,
        canManageStudents: true,
      },
      sortOrder: 3,
    },
    {
      code: 'CLUB_MANAGER',
      name: 'Club Manager',
      description: 'Operational management of club activities, scheduling, and day-to-day operations without billing access',
      scope: 'CLUB',
      permissions: {
        canManageSchedules: true,
        canManageCoaches: true,
        canManageStudents: true,
        canViewClubData: true,
        canManageSessions: true,
      },
      sortOrder: 4,
    },
    {
      code: 'HEAD_COACH',
      name: 'Head Coach',
      description: 'Lead coaching role with ability to manage other coaches, create training programs, and oversee all coaching activities',
      scope: 'CLUB',
      permissions: {
        canManageCoaches: true,
        canCreatePrograms: true,
        canManageSessions: true,
        canViewStudentData: true,
        canEvaluateStudents: true,
        canManageSchedules: true,
      },
      sortOrder: 5,
    },
    {
      code: 'COACH',
      name: 'Coach',
      description: 'Individual coach who can manage their own sessions, evaluate students, and track attendance',
      scope: 'CLUB',
      permissions: {
        canManageOwnSessions: true,
        canEvaluateStudents: true,
        canMarkAttendance: true,
        canViewAssignedStudents: true,
        canCommunicateWithParents: true,
      },
      sortOrder: 6,
    },
    {
      code: 'FREELANCER',
      name: 'Freelance Coach',
      description: 'Independent coach not tied to a specific club, can create bookings and manage their own schedule',
      scope: 'INDEPENDENT',
      permissions: {
        canCreateBookings: true,
        canManageOwnSchedule: true,
        canSetRates: true,
        canAcceptBookings: true,
        canCommunicateWithClients: true,
      },
      sortOrder: 7,
    },
    {
      code: 'PARENT',
      name: 'Parent',
      description: 'Guardian/parent account with access to their children\'s activities, progress, and communication with coaches',
      scope: 'USER',
      permissions: {
        canViewChildrenData: true,
        canCommunicateWithCoaches: true,
        canMakePayments: true,
        canBookSessions: true,
        canViewProgress: true,
      },
      sortOrder: 8,
    },
    {
      code: 'FACILITY_MANAGER',
      name: 'Facility Manager',
      description: 'Overall management of a sports facility including all venues, grounds, staff, and operations',
      scope: 'FACILITY',
      permissions: {
        canManageFacility: true,
        canManageVenues: true,
        canManageGrounds: true,
        canManageStaff: true,
        canViewBookings: true,
        canManageMaintenance: true,
        canManageEquipment: true,
      },
      sortOrder: 9,
    },
    {
      code: 'BOOKINGS_COORDINATOR',
      name: 'Bookings Coordinator',
      description: 'Manages all venue and ground bookings, scheduling, and coordination with clients',
      scope: 'FACILITY',
      permissions: {
        canManageBookings: true,
        canViewSchedules: true,
        canCommunicateWithClients: true,
        canConfirmBookings: true,
        canCancelBookings: true,
      },
      sortOrder: 10,
    },
    {
      code: 'VENUE_MANAGER',
      name: 'Venue Manager',
      description: 'Manages a specific venue within a facility (e.g., indoor hall, court)',
      scope: 'VENUE',
      permissions: {
        canManageVenue: true,
        canViewVenueBookings: true,
        canManageVenueSchedule: true,
        canReportIssues: true,
      },
      sortOrder: 11,
    },
    {
      code: 'GROUND_MANAGER',
      name: 'Ground Manager',
      description: 'Manages a specific ground/field within a facility',
      scope: 'GROUND',
      permissions: {
        canManageGround: true,
        canViewGroundBookings: true,
        canManageGroundSchedule: true,
        canReportIssues: true,
        canRequestMaintenance: true,
      },
      sortOrder: 12,
    },
    {
      code: 'GROUNDSKEEPER',
      name: 'Groundskeeper',
      description: 'Maintains grounds and fields, responsible for turf care, marking, and field preparation',
      scope: 'GROUND',
      permissions: {
        canReportConditions: true,
        canViewMaintenanceSchedule: true,
        canUpdateFieldStatus: true,
      },
      sortOrder: 13,
    },
    {
      code: 'MAINTENANCE_TECH',
      name: 'Maintenance Technician',
      description: 'Handles facility maintenance, repairs, and equipment servicing',
      scope: 'FACILITY',
      permissions: {
        canViewMaintenanceRequests: true,
        canUpdateWorkOrders: true,
        canReportIssues: true,
      },
      sortOrder: 14,
    },
    {
      code: 'EQUIPMENT_MANAGER',
      name: 'Equipment Manager',
      description: 'Manages sports equipment inventory, distribution, and maintenance',
      scope: 'FACILITY',
      permissions: {
        canManageInventory: true,
        canDistributeEquipment: true,
        canTrackEquipment: true,
        canOrderSupplies: true,
      },
      sortOrder: 15,
    },
    {
      code: 'SECURITY_STAFF',
      name: 'Security Staff',
      description: 'Facility security personnel with access control and incident reporting',
      scope: 'FACILITY',
      permissions: {
        canViewSchedules: true,
        canReportIncidents: true,
        canAccessSecurityLogs: true,
      },
      sortOrder: 16,
    },
    {
      code: 'CLEANING_STAFF',
      name: 'Cleaning Staff',
      description: 'Facility cleaning and housekeeping personnel',
      scope: 'FACILITY',
      permissions: {
        canViewCleaningSchedule: true,
        canReportIssues: true,
        canUpdateCleaningStatus: true,
      },
      sortOrder: 17,
    },
    {
      code: 'ACCOUNTANT',
      name: 'Accountant',
      description: 'Financial management including payments, billing, and financial reporting for the club',
      scope: 'CLUB',
      permissions: {
        canViewFinancials: true,
        canManagePayments: true,
        canGenerateReports: true,
        canManageBilling: true,
        canViewTransactions: true,
      },
      sortOrder: 18,
    },
    {
      code: 'FRONT_DESK',
      name: 'Front Desk / Receptionist',
      description: 'Front desk personnel handling check-ins, inquiries, and basic administrative tasks',
      scope: 'CLUB',
      permissions: {
        canCheckInUsers: true,
        canViewSchedules: true,
        canAnswerInquiries: true,
        canMakeBasicBookings: true,
      },
      sortOrder: 19,
    },
    {
      code: 'CONTENT_MANAGER',
      name: 'Content Manager',
      description: 'Manages digital content, announcements, and communications for the club',
      scope: 'CLUB',
      permissions: {
        canCreateContent: true,
        canPublishAnnouncements: true,
        canManageMedia: true,
        canModerateContent: true,
      },
      sortOrder: 20,
    },
    {
      code: 'MEDICAL_STAFF',
      name: 'Medical Staff',
      description: 'Medical personnel including physiotherapists, doctors, and first aid providers',
      scope: 'CLUB',
      permissions: {
        canViewHealthRecords: true,
        canReportInjuries: true,
        canProvideFirstAid: true,
        canAccessMedicalData: true,
      },
      sortOrder: 21,
    },
    {
      code: 'STUDENT',
      name: 'Student',
      description: 'Student/athlete account with access to their own schedules, progress, and training materials',
      scope: 'USER',
      permissions: {
        canViewOwnSchedule: true,
        canViewOwnProgress: true,
        canViewOwnEvaluations: true,
        canCommunicateWithCoaches: true,
      },
      sortOrder: 22,
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: {
        name: role.name,
        description: role.description,
        scope: role.scope,
        permissions: role.permissions,
        sortOrder: role.sortOrder,
      },
      create: role,
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
