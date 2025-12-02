import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { buildPermissionMap } from '../prisma/data/permissions';
import { clearLookupCaches } from '../src/utils/lookups';

// Load test environment variables
dotenv.config({ path: '.env.test', override: true });

const ROLE_DEFAULT_SCOPES: Record<string, string> = {
  SUPER_ADMIN: 'GLOBAL',
  SYSTEM_SUPPORT: 'GLOBAL',
  CLUB_ADMIN: 'CLUB',
  CLUB_MANAGER: 'CLUB',
  HEAD_COACH: 'CLUB',
  COACH: 'CLUB',
  PARENT: 'USER',
  VENUE_MANAGER: 'VENUE',
  FACILITY_MANAGER: 'FACILITY',
};

export const prisma = new PrismaClient();

const ensureRoleRecord = async (code: string) => {
  const existing = await prisma.role.findUnique({ where: { code } });
  if (existing) return existing.id;

  const scope = ROLE_DEFAULT_SCOPES[code] || 'USER';
  const created = await prisma.role.create({
    data: {
      code,
      name: code,
      description: `${code} role`,
      scope,
      permissions: buildPermissionMap(code),
      sortOrder: 0,
    },
  });
  return created.id;
};

const ensureStatusRecord = async (code: string) => {
  const existing = await prisma.userStatus.findUnique({ where: { code } });
  if (existing) return existing.id;

  const created = await prisma.userStatus.create({
    data: {
      code,
      name: code,
      sortOrder: 1,
    },
  });
  return created.id;
};

const truncateAllTables = async () => {
  // Clean up database before tests - delete in correct order to avoid foreign key constraints
  // Child tables first, then parent tables
  await prisma.$executeRaw`TRUNCATE TABLE "files" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "reviews" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "bookings" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "messages" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "payments" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "evaluations" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "attendance" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "session_enrollments" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "sessions" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "students" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "coaches" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "user_roles" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "password_resets" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "profiles" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "clubs" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE`;

  clearLookupCaches();
};

// Global test setup
beforeAll(async () => {
  await truncateAllTables();
});

export const resetDatabase = async () => {
  await truncateAllTables();
};

afterAll(async () => {
  await prisma.$disconnect();
});

// Mock JWT secret for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

// Helper function to create test users
export const createTestUser = async (overrides: Record<string, any> = {}) => {
  const { role = 'PARENT', status = 'ACTIVE', ...userOverrides } = overrides;
  const roleId = await ensureRoleRecord(role);
  const statusId = await ensureStatusRecord(status);

  const defaultUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    passwordHash: '$2b$10$hashedpassword', // This would normally be hashed
    clubId: null,
  };

  return await prisma.user.create({
    data: {
      ...defaultUser,
      ...userOverrides,
      primaryRoleId: userOverrides.primaryRoleId ?? roleId,
      statusId: userOverrides.statusId ?? statusId,
    },
  });
};

// Helper function to create test club
export const createTestClub = async (overrides: any = {}) => {
  // First create an admin user for the club
  const adminOverrides = overrides.adminEmail ? { email: overrides.adminEmail } : {};
  delete overrides.adminEmail; // Remove from club overrides

  const adminUser = await createTestUser({
    name: 'Club Admin',
    email: `admin${Date.now()}@example.com`,
    role: 'CLUB_ADMIN',
    ...adminOverrides,
  });

  const defaultClub = {
    name: `Test Club ${Date.now()}`,
    adminId: adminUser.id,
    description: 'Test club description',
    location: '123 Test St',
  };

  return await prisma.club.create({
    data: { ...defaultClub, ...overrides },
  });
};