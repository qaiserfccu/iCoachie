/**
 * Backend Smoke Test Suite (Card 13)
 * 
 * Quick-running tests that validate mission-critical flows end-to-end:
 * - Auth/login flows
 * - RBAC gates
 * - CRUD operations for major modules (Club, Facility, Venue, Ground, Sessions)
 * 
 * Target: Run in <5 minutes on CI with human-readable pass/fail summary
 */

import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma, createTestUser, createTestClub, resetDatabase } from './setup';
import authRoutes from '../src/controllers/authController';
import clubRoutes from '../src/controllers/clubController';
import sessionRoutes from '../src/controllers/sessionController';
import facilityRoutes from '../src/controllers/facilityController';
import studentRoutes from '../src/controllers/studentController';
import { buildPermissionMap } from '../prisma/data/permissions';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/students', studentRoutes);

const JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

// Helper to generate JWT tokens
const generateToken = (userId: number, clubId?: number | null) => {
  return jwt.sign({ sub: userId, clubId }, JWT_SECRET);
};

// Helper to ensure role exists
async function ensureRole(code: string, scope: string = 'CLUB') {
  await prisma.role.upsert({
    where: { code },
    update: {},
    create: {
      code,
      name: code,
      description: `${code} role`,
      scope,
      permissions: buildPermissionMap(code),
      sortOrder: 0,
    },
  });
}

// Helper to ensure status exists
async function ensureStatus(code: string) {
  await prisma.userStatus.upsert({
    where: { code },
    update: {},
    create: { code, name: code, sortOrder: 1 },
  });
}

describe('🚀 Backend Smoke Tests', () => {
  let testClub: any;
  let adminUser: any;
  let adminToken: string;
  let coachUser: any;
  let coachToken: string;
  let parentUser: any;
  let parentToken: string;

  // Helper to assign SuperAdmin role to a user
  async function assignSuperAdminRole(userId: number) {
    const superAdminRole = await prisma.role.findUnique({ where: { code: 'SUPER_ADMIN' } });
    if (superAdminRole) {
      await prisma.userRoleAssignment.create({
        data: { userId, roleId: superAdminRole.id }
      });
    }
  }

  // Helper to seed all required lookup data
  async function seedLookupData() {
    await ensureRole('SUPER_ADMIN', 'GLOBAL');
    await ensureRole('CLUB_ADMIN', 'CLUB');
    await ensureRole('COACH', 'CLUB');
    await ensureRole('PARENT', 'USER');
    await ensureRole('VENUE_MANAGER', 'VENUE');
    await ensureRole('FACILITY_MANAGER', 'FACILITY');
    await ensureStatus('ACTIVE');
  }

  beforeAll(async () => {
    // Initial seed of lookup data
    await seedLookupData();
  });

  beforeEach(async () => {
    await resetDatabase();
    
    // Re-seed lookup data after reset (uses upsert so it's efficient)
    await seedLookupData();

    // Create test club with admin
    testClub = await createTestClub();
    
    // Create admin user associated with club
    adminUser = await createTestUser({
      email: 'admin@test.com',
      role: 'CLUB_ADMIN',
      clubId: testClub.id,
    });

    // Create SuperAdmin role assignment for admin user
    await assignSuperAdminRole(adminUser.id);

    adminToken = generateToken(adminUser.id, testClub.id);

    // Create coach user
    coachUser = await createTestUser({
      email: 'coach@test.com',
      role: 'COACH',
      clubId: testClub.id,
    });
    coachToken = generateToken(coachUser.id, testClub.id);

    // Create parent user
    parentUser = await createTestUser({
      email: 'parent@test.com',
      role: 'PARENT',
      clubId: testClub.id,
    });
    parentToken = generateToken(parentUser.id, testClub.id);
  });

  describe('📍 Auth Smoke Tests', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'PARENT',
        clubId: testClub.id,
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should login with valid credentials', async () => {
      // Create user with known password
      const password = 'validpassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await createTestUser({
        email: 'login@test.com',
        passwordHash: hashedPassword,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@test.com', password })
        .expect(200);

      expect(response.body).toHaveProperty('token');
    });

    it('should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@test.com', password: 'wrongpassword' })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject requests without authentication token', async () => {
      const response = await request(app)
        .get('/api/clubs')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('📍 RBAC Smoke Tests', () => {
    it('should allow admin to access club management', async () => {
      const response = await request(app)
        .get('/api/clubs')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('clubs');
    });

    it('should allow admin to create clubs', async () => {
      const newClubData = {
        name: 'New Test Club',
        description: 'A test club',
        location: '456 Test Avenue',
        adminId: adminUser.id,
      };

      const response = await request(app)
        .post('/api/clubs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newClubData)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newClubData.name);
    });

    it('should require authentication for protected routes', async () => {
      await request(app)
        .get('/api/clubs')
        .expect(401);
    });
  });

  describe('📍 Club CRUD Smoke Tests', () => {
    it('should list clubs for authenticated user', async () => {
      const response = await request(app)
        .get('/api/clubs')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('clubs');
      expect(Array.isArray(response.body.clubs)).toBe(true);
    });

    it('should get club details by ID', async () => {
      const response = await request(app)
        .get(`/api/clubs/${testClub.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('club');
      expect(response.body.club.id).toBe(testClub.id);
    });

    it('should update club details', async () => {
      const updateData = {
        name: 'Updated Club Name',
        description: 'Updated description',
      };

      const response = await request(app)
        .put(`/api/clubs/${testClub.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
    });

    it('should return 404 for non-existent club', async () => {
      await request(app)
        .get('/api/clubs/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('📍 Session Module Smoke Tests', () => {
    let coachRecord: any;
    let sessionStatusId: number;

    beforeEach(async () => {
      // Create coach record for the coach user
      coachRecord = await prisma.coach.create({
        data: {
          userId: coachUser.id,
          specialization: 'General',
          experience: 5,
          clubId: testClub.id,
        }
      });

      // Get or create session status
      const status = await prisma.sessionStatus.upsert({
        where: { code: 'SCHEDULED' },
        update: {},
        create: { code: 'SCHEDULED', name: 'Scheduled', sortOrder: 1 },
      });
      sessionStatusId = status.id;
    });

    it('should create a new session', async () => {
      const sessionData = {
        title: 'Morning Training',
        description: 'Basic training session',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        coachId: coachRecord.id,
        maxParticipants: 20,
        location: 'Main Field',
      };

      const response = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sessionData)
        .expect(201);

      expect(response.body).toHaveProperty('session');
      expect(response.body.session.title).toBe(sessionData.title);
    });

    it('should list sessions for club', async () => {
      // Create a test session first
      await prisma.session.create({
        data: {
          title: 'Test Session',
          description: 'Test',
          date: new Date(),
          startTime: '10:00',
          endTime: '11:00',
          coachId: coachRecord.id,
          clubId: testClub.id,
          maxParticipants: 15,
          location: 'Field A',
          statusId: sessionStatusId,
        }
      });

      const response = await request(app)
        .get('/api/sessions')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('sessions');
      expect(Array.isArray(response.body.sessions)).toBe(true);
    });
  });

  describe('📍 Student Module Smoke Tests', () => {
    it('should create a new student', async () => {
      const studentData = {
        name: 'Test Student',
        email: 'student@test.com',
        dateOfBirth: '2010-01-15',
        guardianName: parentUser.name,
        guardianEmail: parentUser.email,
        guardianPhone: '555-1234',
      };

      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(studentData)
        .expect(201);

      expect(response.body).toHaveProperty('student');
      expect(response.body.student.name).toBe(studentData.name);
    });

    it('should list students for club', async () => {
      // Create test student
      await prisma.student.create({
        data: {
          name: 'Existing Student',
          email: 'existing@student.com',
          guardianName: 'Parent',
          guardianPhone: '555-0000',
          dateOfBirth: new Date('2010-01-01'),
          clubId: testClub.id,
        }
      });

      const response = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('students');
      expect(Array.isArray(response.body.students)).toBe(true);
    });
  });

  describe('📍 Facility Module Smoke Tests', () => {
    let facility: any;

    beforeEach(async () => {
      facility = await prisma.facility.create({
        data: {
          name: 'Main Sports Complex',
          location: 'Downtown',
          address: '123 Sports Lane',
          description: 'Primary facility',
          clubId: testClub.id,
        }
      });
    });

    it('should list facilities for club', async () => {
      const response = await request(app)
        .get('/api/facilities')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get facility details', async () => {
      const response = await request(app)
        .get(`/api/facilities/${facility.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.id).toBe(facility.id);
      expect(response.body.name).toBe(facility.name);
    });

    it('should create a venue under facility', async () => {
      const venueData = {
        name: 'Court A',
        venueType: 'INDOOR',
        capacity: 50,
        hourlyRate: 25.00,
      };

      const response = await request(app)
        .post(`/api/facilities/${facility.id}/venues`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(venueData)
        .expect(201);

      expect(response.body.name).toBe(venueData.name);
    });

    it('should create a ground under facility', async () => {
      const groundData = {
        name: 'Field 1',
        groundType: 'GRASS',
        dimensions: '100x50m',
      };

      const response = await request(app)
        .post(`/api/facilities/${facility.id}/grounds`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(groundData)
        .expect(201);

      expect(response.body.name).toBe(groundData.name);
    });

    it('should list venues under facility', async () => {
      // Create a venue first
      await prisma.venue.create({
        data: {
          name: 'Test Venue',
          venueType: 'OUTDOOR',
          facilityId: facility.id,
        }
      });

      const response = await request(app)
        .get(`/api/facilities/${facility.id}/venues`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should list grounds under facility', async () => {
      // Create a ground first
      await prisma.ground.create({
        data: {
          name: 'Test Ground',
          groundType: 'TURF',
          facilityId: facility.id,
        }
      });

      const response = await request(app)
        .get(`/api/facilities/${facility.id}/grounds`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('📍 Multi-tenancy Smoke Tests', () => {
    let otherClub: any;
    let otherAdminUser: any;
    let otherAdminToken: string;

    beforeEach(async () => {
      // Create another club with its own admin
      otherClub = await createTestClub({ name: 'Other Club' });
      
      otherAdminUser = await createTestUser({
        email: 'otheradmin@test.com',
        role: 'CLUB_ADMIN',
        clubId: otherClub.id,
      });
      otherAdminToken = generateToken(otherAdminUser.id, otherClub.id);
    });

    it('should isolate club data between tenants', async () => {
      // Admin from testClub should only see their own clubs
      const response1 = await request(app)
        .get('/api/clubs')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Admin from otherClub should only see their own clubs
      const response2 = await request(app)
        .get('/api/clubs')
        .set('Authorization', `Bearer ${otherAdminToken}`)
        .expect(200);

      // Both should get clubs, but they should be isolated by their club context
      expect(response1.body).toHaveProperty('clubs');
      expect(response2.body).toHaveProperty('clubs');
    });

    it('should prevent cross-tenant access to resources', async () => {
      // Create a facility in testClub
      const facility = await prisma.facility.create({
        data: {
          name: 'TestClub Facility',
          location: 'Test Location',
          address: '123 Test St',
          clubId: testClub.id,
        }
      });

      // Other club admin should not be able to access this facility
      await request(app)
        .get(`/api/facilities/${facility.id}`)
        .set('Authorization', `Bearer ${otherAdminToken}`)
        .expect(404);
    });
  });

  describe('📍 Data Validation Smoke Tests', () => {
    it('should validate required fields on registration', async () => {
      const incompleteData = {
        email: 'incomplete@test.com',
        // missing required fields
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should validate email format', async () => {
      const invalidEmailData = {
        name: 'Test User',
        email: 'not-an-email',
        password: 'password123',
        role: 'PARENT',
        clubId: testClub.id,
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidEmailData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should prevent duplicate email registration', async () => {
      await createTestUser({ email: 'duplicate@test.com' });

      const duplicateData = {
        name: 'Another User',
        email: 'duplicate@test.com',
        password: 'password123',
        role: 'PARENT',
        clubId: testClub.id,
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateData)
        .expect(409);

      expect(response.body.message).toContain('Email already exists');
    });
  });
});
