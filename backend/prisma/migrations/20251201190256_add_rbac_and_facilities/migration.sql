/*
  Warnings:

  - You are about to drop the column `status` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `roles` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Create lookup tables first
-- CreateTable
CREATE TABLE "user_statuses" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_statuses" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_statuses" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_statuses" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_statuses" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_types" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "membership_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "managerId" INTEGER,
    "location" TEXT,
    "address" TEXT,
    "description" TEXT,
    "amenities" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venues" (
    "id" SERIAL NOT NULL,
    "facilityId" INTEGER NOT NULL,
    "managerId" INTEGER,
    "name" TEXT NOT NULL,
    "venueType" TEXT NOT NULL,
    "capacity" INTEGER,
    "hourlyRate" DECIMAL(10,2),
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "amenities" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grounds" (
    "id" SERIAL NOT NULL,
    "facilityId" INTEGER NOT NULL,
    "managerId" INTEGER,
    "name" TEXT NOT NULL,
    "groundType" TEXT NOT NULL,
    "surfaceType" TEXT,
    "dimensions" TEXT,
    "capacity" INTEGER,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "grounds_pkey" PRIMARY KEY ("id")
);

-- Step 2: Create indexes for lookup tables
CREATE UNIQUE INDEX "user_statuses_code_key" ON "user_statuses"("code");
CREATE UNIQUE INDEX "session_statuses_code_key" ON "session_statuses"("code");
CREATE UNIQUE INDEX "attendance_statuses_code_key" ON "attendance_statuses"("code");
CREATE UNIQUE INDEX "payment_statuses_code_key" ON "payment_statuses"("code");
CREATE UNIQUE INDEX "booking_statuses_code_key" ON "booking_statuses"("code");
CREATE UNIQUE INDEX "membership_types_code_key" ON "membership_types"("code");
CREATE UNIQUE INDEX "facilities_managerId_key" ON "facilities"("managerId");
CREATE UNIQUE INDEX "venues_managerId_key" ON "venues"("managerId");
CREATE UNIQUE INDEX "grounds_managerId_key" ON "grounds"("managerId");

-- Step 3: Populate status lookup tables with default values
INSERT INTO "user_statuses" ("code", "name", "sortOrder") VALUES 
  ('ACTIVE', 'Active', 1),
  ('PENDING', 'Pending Verification', 2),
  ('SUSPENDED', 'Suspended', 3),
  ('INACTIVE', 'Inactive', 4);

INSERT INTO "session_statuses" ("code", "name", "sortOrder") VALUES
  ('SCHEDULED', 'Scheduled', 1),
  ('ONGOING', 'Ongoing', 2),
  ('COMPLETED', 'Completed', 3),
  ('CANCELLED', 'Cancelled', 4);

INSERT INTO "attendance_statuses" ("code", "name", "sortOrder") VALUES
  ('PRESENT', 'Present', 1),
  ('LATE', 'Late', 2),
  ('ABSENT', 'Absent', 3);

INSERT INTO "payment_statuses" ("code", "name", "sortOrder") VALUES
  ('PENDING', 'Pending', 1),
  ('COMPLETED', 'Completed', 2),
  ('FAILED', 'Failed', 3),
  ('REFUNDED', 'Refunded', 4);

INSERT INTO "booking_statuses" ("code", "name", "sortOrder") VALUES
  ('PENDING', 'Pending', 1),
  ('CONFIRMED', 'Confirmed', 2),
  ('COMPLETED', 'Completed', 3),
  ('CANCELLED', 'Cancelled', 4);

INSERT INTO "membership_types" ("code", "name", "sortOrder") VALUES
  ('STANDARD', 'Standard Membership', 1),
  ('PREMIUM', 'Premium Membership', 2);

-- Step 4: Add new columns to roles with temporary defaults to handle existing data
ALTER TABLE "roles" 
  ADD COLUMN "code" TEXT DEFAULT 'UNKNOWN',
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "permissions" JSONB,
  ADD COLUMN "scope" TEXT DEFAULT 'CLUB',
  ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Update existing roles with meaningful codes based on their names (if any exist)
UPDATE "roles" SET "code" = UPPER(REPLACE("name", ' ', '_')) WHERE "code" = 'UNKNOWN';
UPDATE "roles" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

-- Now make code and updatedAt required
ALTER TABLE "roles" ALTER COLUMN "code" DROP DEFAULT;
ALTER TABLE "roles" ALTER COLUMN "code" SET NOT NULL;
ALTER TABLE "roles" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "roles" ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE "roles" ALTER COLUMN "scope" DROP DEFAULT;

-- Step 5: Drop old unique constraint on roles.name
DROP INDEX IF EXISTS "roles_name_key";

-- Step 6: Add new columns to existing tables
ALTER TABLE "attendance" 
  ADD COLUMN "statusId" INTEGER;

ALTER TABLE "bookings" 
  ADD COLUMN "statusId" INTEGER,
  ADD COLUMN "venueId" INTEGER;

ALTER TABLE "payments" 
  ADD COLUMN "statusId" INTEGER;

ALTER TABLE "sessions" 
  ADD COLUMN "statusId" INTEGER;

ALTER TABLE "users" 
  ADD COLUMN "facilityId" INTEGER,
  ADD COLUMN "primaryRoleId" INTEGER,
  ADD COLUMN "statusId" INTEGER;

-- Step 7: Migrate existing enum data to foreign keys
-- Map user statuses (if users.status exists and has data)
UPDATE "users" u SET "statusId" = (
  SELECT id FROM "user_statuses" WHERE code = u."status"::TEXT
) WHERE u."status" IS NOT NULL;

-- Map session statuses
UPDATE "sessions" s SET "statusId" = (
  SELECT id FROM "session_statuses" WHERE code = s."status"::TEXT
) WHERE s."status" IS NOT NULL;

-- Map attendance statuses
UPDATE "attendance" a SET "statusId" = (
  SELECT id FROM "attendance_statuses" WHERE code = a."status"::TEXT
) WHERE a."status" IS NOT NULL;

-- Map payment statuses
UPDATE "payments" p SET "statusId" = (
  SELECT id FROM "payment_statuses" WHERE code = p."status"::TEXT
) WHERE p."status" IS NOT NULL;

-- Map booking statuses
UPDATE "bookings" b SET "statusId" = (
  SELECT id FROM "booking_statuses" WHERE code = b."status"::TEXT
) WHERE b."status" IS NOT NULL;

-- Map user roles to primaryRoleId (convert enum role to role lookup)
-- First ensure we have the 5 basic roles that existed in the enum
-- Note: We create role.code unique index first, then insert with ON CONFLICT
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

INSERT INTO "roles" ("code", "name", "description", "scope", "isActive", "sortOrder", "updatedAt")
VALUES 
  ('CLUB_ADMIN', 'Club Administrator', 'Full administrative control over a specific club/organization', 'CLUB', true, 1, CURRENT_TIMESTAMP),
  ('COACH', 'Coach', 'Individual coach who can manage their own sessions', 'CLUB', true, 2, CURRENT_TIMESTAMP),
  ('FREELANCER', 'Freelance Coach', 'Independent coach not tied to a specific club', 'INDEPENDENT', true, 3, CURRENT_TIMESTAMP),
  ('PARENT', 'Parent', 'Guardian/parent account with access to children activities', 'USER', true, 4, CURRENT_TIMESTAMP),
  ('KID', 'Student', 'Student/athlete account', 'USER', true, 5, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;

-- Map existing user.role enum to primaryRoleId
UPDATE "users" u SET "primaryRoleId" = (
  SELECT r.id FROM "roles" r WHERE r."code" = u."role"::TEXT
) WHERE u."role" IS NOT NULL;

-- Step 8: Drop old enum columns
ALTER TABLE "attendance" DROP COLUMN IF EXISTS "status";
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "status";
ALTER TABLE "payments" DROP COLUMN IF EXISTS "status";
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "status";
ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
ALTER TABLE "users" DROP COLUMN IF EXISTS "status";

-- Step 9: Drop enums
DROP TYPE IF EXISTS "AttendanceStatus";
DROP TYPE IF EXISTS "BookingStatus";
DROP TYPE IF EXISTS "MembershipType";
DROP TYPE IF EXISTS "PaymentStatus";
DROP TYPE IF EXISTS "SessionStatus";
DROP TYPE IF EXISTS "UserRole";
DROP TYPE IF EXISTS "UserStatus";

-- Step 10: Add foreign key constraints (moved up, roles_code_key index created earlier)
ALTER TABLE "users" ADD CONSTRAINT "users_primaryRoleId_fkey" FOREIGN KEY ("primaryRoleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "user_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "session_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "attendance_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "payment_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "booking_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "venues" ADD CONSTRAINT "venues_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "venues" ADD CONSTRAINT "venues_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "grounds" ADD CONSTRAINT "grounds_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "grounds" ADD CONSTRAINT "grounds_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
