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
import attendanceRoutes from '../src/controllers/attendanceController';
import bookingRoutes from '../src/controllers/bookingController';
import coachRoutes from '../src/controllers/coachController';
import evaluationRoutes from '../src/controllers/evaluationController';
import fileRoutes from '../src/routes/fileRoutes';
import messageRoutes from '../src/controllers/messageController';
import paymentRoutes from '../src/controllers/paymentController';
import reviewRoutes from '../src/controllers/reviewController';
import statusRoutes from '../src/controllers/statusController';
import userRoutes from '../src/controllers/userController';
import { buildPermissionMap } from '../prisma/data/permissions';

jest.mock('../src/server', () => ({
  socketService: {
    sendToUser: jest.fn(),
    broadcastToClub: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/users', userRoutes);

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

// Helper to ensure user status exists
async function ensureStatus(code: string) {
  await prisma.userStatus.upsert({
    where: { code },
    update: {},
    create: { code, name: code, sortOrder: 1 },
  });
}

const ensureSessionStatus = async (code: string, name: string) => {
  await prisma.sessionStatus.upsert({
    where: { code },
    update: {},
    create: { code, name, sortOrder: 1 },
  });
};

const ensureAttendanceStatus = async (code: string, name: string) => {
  await prisma.attendanceStatus.upsert({
    where: { code },
    update: {},
    create: { code, name, sortOrder: 1 },
  });
};

const ensureBookingStatus = async (code: string, name: string) => {
  await prisma.bookingStatus.upsert({
    where: { code },
    update: {},
    create: { code, name, sortOrder: 1 },
  });
};

const ensurePaymentStatus = async (code: string, name: string) => {
  await prisma.paymentStatus.upsert({
    where: { code },
    update: {},
    create: { code, name, sortOrder: 1 },
  });
};

describe('🚀 Backend Smoke Tests', () => {
  let testClub: any;
  let adminUser: any;
  let adminToken: string;
  let coachUser: any;
  let coachToken: string;
  let parentUser: any;
  let parentToken: string;
  let coachProfile: any;
  let freelancerUser: any;

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
    await ensureRole('FREELANCER', 'USER');
    await ensureStatus('ACTIVE');
    await ensureSessionStatus('SCHEDULED', 'Scheduled');
    await ensureSessionStatus('COMPLETED', 'Completed');
    await ensureAttendanceStatus('PRESENT', 'Present');
    await ensureAttendanceStatus('ABSENT', 'Absent');
    await ensureBookingStatus('PENDING', 'Pending');
    await ensureBookingStatus('CONFIRMED', 'Confirmed');
    await ensureBookingStatus('COMPLETED', 'Completed');
    await ensurePaymentStatus('PENDING', 'Pending');
    await ensurePaymentStatus('COMPLETED', 'Completed');
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

    coachProfile = await prisma.coach.create({
      data: {
        userId: coachUser.id,
        clubId: testClub.id,
        specializations: ['General'],
        experienceYears: 5,
        certification: 'Level 1',
      }
    });

    // Create parent user
    parentUser = await createTestUser({
      email: 'parent@test.com',
      role: 'PARENT',
      clubId: testClub.id,
    });
    parentToken = generateToken(parentUser.id, testClub.id);

    freelancerUser = await createTestUser({
      email: 'freelancer@test.com',
      role: 'FREELANCER',
      clubId: testClub.id,
    });
  });

  const getSessionStatusId = async (code: string = 'COMPLETED') => {
    const status = await prisma.sessionStatus.findUnique({ where: { code } });
    if (!status) throw new Error(`Session status ${code} not seeded`);
    return status.id;
  };

  const getBookingStatusId = async (code: string = 'PENDING') => {
    const status = await prisma.bookingStatus.findUnique({ where: { code } });
    if (!status) throw new Error(`Booking status ${code} not seeded`);
    return status.id;
  };

  const getPaymentStatusId = async (code: string = 'PENDING') => {
    const status = await prisma.paymentStatus.findUnique({ where: { code } });
    if (!status) throw new Error(`Payment status ${code} not seeded`);
    return status.id;
  };

  const createSessionRecord = async (overrides: Record<string, any> = {}) => {
    const { statusCode, statusId, ...rest } = overrides;
    const resolvedStatusId = statusId ?? await getSessionStatusId(statusCode ?? 'COMPLETED');
    const {
      title,
      description,
      sessionDate,
      startTime,
      endTime,
      coachId: overrideCoachId,
      clubId: overrideClubId,
      maxCapacity,
      location,
      ...remaining
    } = rest;

    const baseDate = sessionDate ?? new Date(Date.now() - 60 * 60 * 1000);

    return prisma.session.create({
      data: {
        title: title ?? 'Smoke Session',
        description: description ?? 'Automated smoke test session',
        sessionDate: baseDate,
        startTime: startTime ?? baseDate,
        endTime: endTime ?? new Date(baseDate.getTime() + 60 * 60 * 1000),
        coachId: overrideCoachId ?? coachUser.id,
        clubId: overrideClubId ?? testClub.id,
        maxCapacity: maxCapacity ?? 10,
        location: location ?? 'Main Field',
        statusId: resolvedStatusId,
        ...remaining,
      }
    });
  };

  const createStudentRecord = async (overrides: Record<string, any> = {}) => {
    const { userId, ...rest } = overrides;
    let resolvedUserId = userId;

    if (!resolvedUserId) {
      const studentUser = await createTestUser({
        name: rest.userName ?? 'Student User',
        email: rest.email ?? `student${Date.now()}@example.com`,
        role: 'PARENT',
        clubId: rest.clubId ?? testClub.id,
      });
      resolvedUserId = studentUser.id;
    }

    const {
      parentId,
      coachId,
      clubId,
      name,
      age,
      level,
      sport,
      ...remaining
    } = rest;

    return prisma.student.create({
      data: {
        userId: resolvedUserId,
        parentId: parentId ?? parentUser.id,
        coachId: coachId ?? coachUser.id,
        clubId: clubId ?? testClub.id,
        name: name ?? 'Test Student',
        age: age ?? 14,
        level: level ?? 'Intermediate',
        sport: sport ?? 'Tennis',
        ...remaining,
      }
    });
  };

  const createBookingRecord = async (overrides: Record<string, any> = {}) => {
    const { statusCode, statusId, ...rest } = overrides;
    const resolvedStatusId = statusId ?? await getBookingStatusId(statusCode ?? 'PENDING');
    const {
      freelancerId,
      clientId,
      sessionDate,
      startTime,
      endTime,
      serviceType,
      notes,
      ...remaining
    } = rest;

    const baseDate = sessionDate ?? new Date(Date.now() + 60 * 60 * 1000);

    return prisma.booking.create({
      data: {
        freelancerId: freelancerId ?? freelancerUser.id,
        clientId: clientId ?? adminUser.id,
        sessionDate: baseDate,
        startTime: startTime ?? baseDate,
        endTime: endTime ?? new Date(baseDate.getTime() + 60 * 60 * 1000),
        serviceType: serviceType ?? 'LESSON',
        statusId: resolvedStatusId,
        notes: notes ?? 'Smoke booking',
        ...remaining,
      }
    });
  };

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

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
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
        .expect(201);

      expect(response.body.id).toBeDefined();
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

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get club details by ID', async () => {
      const response = await request(app)
        .get(`/api/clubs/${testClub.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.id).toBe(testClub.id);
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
    let sessionStatusId: number;

    beforeEach(async () => {
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
        sessionDate: new Date().toISOString(),
        startTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
        coachId: coachUser.id,
        maxCapacity: 20,
        location: 'Main Field',
      };

      const response = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sessionData)
        .expect(201);

      expect(response.body.title).toBe(sessionData.title);
    });

    it('should list sessions for club', async () => {
      // Create a test session first
      await prisma.session.create({
        data: {
          title: 'Test Session',
          description: 'Test',
          sessionDate: new Date(),
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
          coachId: coachUser.id,
          clubId: testClub.id,
          maxCapacity: 15,
          location: 'Field A',
          statusId: sessionStatusId,
        }
      });

      const response = await request(app)
        .get('/api/sessions')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('📍 Student Module Smoke Tests', () => {
    it('should create a new student', async () => {
      const studentUser = await createTestUser({
        name: 'Student User',
        email: `student${Date.now()}@test.com`,
        role: 'PARENT',
        clubId: testClub.id,
      });

      const studentData = {
        userId: studentUser.id,
        parentId: parentUser.id,
        coachId: coachUser.id,
        name: 'Test Student',
        age: 14,
        level: 'Intermediate',
        sport: 'Tennis',
      };

      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(studentData)
        .expect(201);

      expect(response.body.name).toBe(studentData.name);
    });

    it('should list students for club', async () => {
      // Create test student
      const studentUser = await createTestUser({
        name: 'Existing Student User',
        email: `existing${Date.now()}@student.com`,
        role: 'PARENT',
        clubId: testClub.id,
      });

      await prisma.student.create({
        data: {
          userId: studentUser.id,
          parentId: parentUser.id,
          coachId: coachUser.id,
          name: 'Existing Student',
          age: 13,
          level: 'Beginner',
          sport: 'Soccer',
          clubId: testClub.id,
        }
      });

      const response = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('📍 Attendance Module Smoke Tests', () => {
    it('records and updates attendance for completed sessions', async () => {
      const session = await createSessionRecord();
      const student = await createStudentRecord();

      const recordResponse = await request(app)
        .post(`/api/attendance/session/${session.id}/student/${student.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'PRESENT', notes: 'Arrived on time' })
        .expect(200);

      expect(recordResponse.body.student.id).toBe(student.id);
      expect(recordResponse.body.status.code).toBe('PRESENT');

      const listResponse = await request(app)
        .get(`/api/attendance/session/${session.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(listResponse.body)).toBe(true);
      expect(listResponse.body[0].student.id).toBe(student.id);

      const updateResponse = await request(app)
        .put(`/api/attendance/${recordResponse.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ABSENT', notes: 'Left early' })
        .expect(200);

      expect(updateResponse.body.status.code).toBe('ABSENT');
    });
  });

  describe('📍 Coach Module Smoke Tests', () => {
    it('lists and fetches coach profiles', async () => {
      const listResponse = await request(app)
        .get('/api/coaches')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(listResponse.body)).toBe(true);

      const detailResponse = await request(app)
        .get(`/api/coaches/${coachProfile.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(detailResponse.body.id).toBe(coachProfile.id);
      expect(detailResponse.body.userId).toBe(coachUser.id);
    });

    it('creates a new coach for the club', async () => {
      const payload = {
        email: `coach${Date.now()}@example.com`,
        password: 'Password123!',
        name: 'Smoke Coach',
        specializations: ['Strength'],
        experienceYears: 8,
        certification: 'NSCA',
        hourlyRate: 60,
      };

      const response = await request(app)
        .post('/api/coaches')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(payload)
        .expect(200);

      expect(response.body.email).toBe(payload.email);
      expect(response.body.specialty).toContain('Strength');
    });
  });

  describe('📍 Booking Module Smoke Tests', () => {
    it('creates bookings and lists client history', async () => {
      const sessionDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
      const payload = {
        freelancerId: freelancerUser.id,
        sessionDate: sessionDate.toISOString(),
        startTime: sessionDate.toISOString(),
        endTime: new Date(sessionDate.getTime() + 60 * 60 * 1000).toISOString(),
        serviceType: 'LESSON',
        amount: 120,
        notes: 'Smoke booking'
      };

      const createResponse = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(payload)
        .expect(201);

      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.data.freelancer.id).toBe(freelancerUser.id);

      const listResponse = await request(app)
        .get('/api/bookings?type=as_client')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(listResponse.body.success).toBe(true);
      expect(listResponse.body.data.bookings.length).toBeGreaterThan(0);
    });
  });

  describe('📍 Evaluation Module Smoke Tests', () => {
    it('captures session evaluations and returns history', async () => {
      const session = await createSessionRecord();
      const student = await createStudentRecord();

      const createResponse = await request(app)
        .post(`/api/evaluations/session/${session.id}/student/${student.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ evaluationType: 'PERFORMANCE', overallScore: 4, comments: 'Solid showing' })
        .expect(200);

      expect(createResponse.body.student.id).toBe(student.id);

      const listResponse = await request(app)
        .get(`/api/evaluations/session/${session.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(listResponse.body)).toBe(true);
      expect(listResponse.body[0].student.id).toBe(student.id);
    });
  });

  describe('📍 File Module Smoke Tests', () => {
    it('uploads, lists, and deletes user files', async () => {
      const uploadResponse = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('fileType', 'DOCUMENT')
        .attach('file', Buffer.from('Smoke test document'), 'smoke.txt')
        .expect(201);

      expect(uploadResponse.body.file).toBeDefined();
      const fileId = uploadResponse.body.file.id;

      const listResponse = await request(app)
        .get('/api/files/user')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(listResponse.body.files)).toBe(true);
      expect(listResponse.body.files.find((file: any) => file.id === fileId)).toBeDefined();

      await request(app)
        .delete(`/api/files/${fileId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  describe('📍 Message Module Smoke Tests', () => {
    it('sends, lists, and marks messages as read', async () => {
      const sendResponse = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ toUserId: parentUser.id, subject: 'Welcome', content: 'Smoke messaging flow' })
        .expect(201);

      expect(sendResponse.body.success).toBe(true);
      const messageId = sendResponse.body.data.id;

      const inboxResponse = await request(app)
        .get('/api/messages?type=received')
        .set('Authorization', `Bearer ${parentToken}`)
        .expect(200);

      expect(inboxResponse.body.success).toBe(true);
      expect(inboxResponse.body.data.messages.length).toBeGreaterThan(0);

      const unreadCount = await request(app)
        .get('/api/messages/unread-count')
        .set('Authorization', `Bearer ${parentToken}`)
        .expect(200);

      expect(unreadCount.body.data.unreadCount).toBeGreaterThan(0);

      await request(app)
        .patch('/api/messages/mark-read')
        .set('Authorization', `Bearer ${parentToken}`)
        .send({ messageIds: [messageId] })
        .expect(200);

      const clearedCount = await request(app)
        .get('/api/messages/unread-count')
        .set('Authorization', `Bearer ${parentToken}`)
        .expect(200);

      expect(clearedCount.body.data.unreadCount).toBe(0);
    });
  });

  describe('📍 Payment Module Smoke Tests', () => {
    it('creates payments and updates status', async () => {
      const paymentResponse = await request(app)
        .post('/api/payments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: parentUser.id,
          amount: 150.5,
          paymentType: 'SESSION',
          description: 'Smoke payment'
        })
        .expect(200);

      expect(paymentResponse.body.id).toBeDefined();

      const updateResponse = await request(app)
        .put(`/api/payments/${paymentResponse.body.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'COMPLETED' })
        .expect(200);

      expect(updateResponse.body.status.code).toBe('COMPLETED');

      const listResponse = await request(app)
        .get('/api/payments')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(listResponse.body)).toBe(true);
      expect(listResponse.body.find((payment: any) => payment.id === paymentResponse.body.id)).toBeDefined();
    });
  });

  describe('📍 Review Module Smoke Tests', () => {
    it('submits booking reviews and lists history', async () => {
      const completedBooking = await createBookingRecord({ statusCode: 'COMPLETED' });

      const createResponse = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          revieweeId: freelancerUser.id,
          bookingId: completedBooking.id,
          rating: 5,
          comment: 'Excellent session'
        })
        .expect(201);

      expect(createResponse.body.success).toBe(true);

      const listResponse = await request(app)
        .get('/api/reviews?type=given')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(listResponse.body.success).toBe(true);
      expect(listResponse.body.data.reviews.length).toBeGreaterThan(0);
    });
  });

  describe('📍 Status Lookup Smoke Tests', () => {
    it('returns lookup values for user and booking statuses', async () => {
      const userStatuses = await request(app)
        .get('/api/statuses/user')
        .expect(200);

      expect(Array.isArray(userStatuses.body)).toBe(true);
      expect(userStatuses.body.find((status: any) => status.code === 'ACTIVE')).toBeDefined();

      const bookingStatuses = await request(app)
        .get('/api/statuses/booking')
        .expect(200);

      expect(Array.isArray(bookingStatuses.body)).toBe(true);
      expect(bookingStatuses.body.find((status: any) => status.code === 'PENDING')).toBeDefined();
    });
  });

  describe('📍 User Module Smoke Tests', () => {
    it('returns the current user profile and roles', async () => {
      const meResponse = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(meResponse.body.user.id).toBe(adminUser.id);

      const rolesResponse = await request(app)
        .get('/api/users/roles')
        .expect(200);

      expect(Array.isArray(rolesResponse.body)).toBe(true);
    });

    it('allows admins to manage club users', async () => {
      const newUserPayload = {
        email: `clubuser${Date.now()}@example.com`,
        password: 'TestPassword123',
        name: 'Smoke Club User',
        role: 'PARENT',
        display_name: 'Smoke User'
      };

      const createResponse = await request(app)
        .post('/api/users/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUserPayload)
        .expect(200);

      expect(createResponse.body.email).toBe(newUserPayload.email);

      const listResponse = await request(app)
        .get('/api/users/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(listResponse.body)).toBe(true);
      expect(listResponse.body.find((user: any) => user.email === newUserPayload.email)).toBeDefined();
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
      const response1 = await request(app)
        .get('/api/clubs')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response1.body).toHaveProperty('data');
      expect(Array.isArray(response1.body.data)).toBe(true);

      await request(app)
        .get('/api/clubs')
        .set('Authorization', `Bearer ${otherAdminToken}`)
        .expect(403);

      const otherClubResponse = await request(app)
        .get('/api/clubs/my')
        .set('Authorization', `Bearer ${otherAdminToken}`)
        .expect(200);

      expect(otherClubResponse.body.id).toBe(otherClub.id);
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
