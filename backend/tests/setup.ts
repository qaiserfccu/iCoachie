import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Create test database connection
const connectionString = process.env.DATABASE_URL_TEST || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

// Global test setup
beforeAll(async () => {
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
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Mock JWT secret for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

// Helper function to create test users
export const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    passwordHash: '$2b$10$hashedpassword', // This would normally be hashed
    role: UserRole.PARENT,
    status: UserStatus.ACTIVE,
    clubId: null,
  };

  return await prisma.user.create({
    data: { ...defaultUser, ...overrides },
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
    role: UserRole.CLUB_ADMIN,
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