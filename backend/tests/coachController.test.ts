import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';

jest.resetModules();

// Define mockPrisma first
const mockPrisma = {
  coach: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  user: {
    create: jest.fn(),
    update: jest.fn(),
  },
  role: {
    upsert: jest.fn(),
  },
  userRoleAssignment: {
    create: jest.fn(),
    findFirst: jest.fn(),
  },
  profile: {
    create: jest.fn(),
  },
};

// Mock dependencies
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
  Prisma: {
    validator: jest.fn(() => (include: any) => include),
  },
}));

jest.mock('../src/db', () => mockPrisma);

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

jest.mock('../src/middleware/jwtAuth', () => ({
  requireAuth: jest.fn((req, res, next) => {
    req.user = { id: 1, clubId: 1 };
    next();
  }),
}));

jest.mock('../src/middleware/rbac', () => ({
  requireRole: jest.fn((roles) => (req: any, res: any, next: any) => {
    next();
  }),
}));

jest.mock('../src/utils/lookups', () => ({
  getUserStatusIdByCode: jest.fn(),
}));

// Import after mocks
import coachController from '../src/controllers/coachController';

const app = express();
app.use(express.json());
app.use('/coaches', coachController);

describe('Coach Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /coaches', () => {
    it('should return all coaches in the club', async () => {
      const mockCoaches = [
        {
          id: 1,
          specializations: ['Soccer'],
          experienceYears: 5,
          certification: 'Level 1',
          hourlyRate: 50,
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            profile: { avatarUrl: 'avatar.jpg', phone: '123-456-7890' },
            status: { code: 'ACTIVE' },
            reviewsReceived: [{ rating: 5 }, { rating: 4 }],
            coachedStudents: [{ id: 1, name: 'Student 1', sport: 'Soccer' }],
            coachedSessions: [{ id: 1, title: 'Session 1', sessionDate: new Date(), status: { code: 'SCHEDULED', name: 'Scheduled' } }],
          },
        },
      ];

      (mockPrisma.coach.findMany as any).mockResolvedValue(mockCoaches);

      const response = await request(app).get('/coaches');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          userId: 1,
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'avatar.jpg',
          phone: '123-456-7890',
          specialty: ['Soccer'],
          rating: 4.5,
          students: 1,
          sessions: 1,
          status: 'Active',
          experienceYears: 5,
          certification: 'Level 1',
          hourlyRate: 50,
        },
      ]);
      expect(mockPrisma.coach.findMany).toHaveBeenCalledWith({
        where: {
          clubId: 1,
          deletedAt: null,
          user: {
            deletedAt: null,
            status: {
              is: {
                code: 'ACTIVE',
              },
            },
          },
        },
        include: expect.any(Object),
      });
    });

    it('should return 500 on internal error', async () => {
      (mockPrisma.coach.findMany as any).mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/coaches');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal error' });
    });
  });

  describe('GET /coaches/:id', () => {
    it('should return coach by ID', async () => {
      const mockCoach = {
        id: 1,
        specializations: ['Soccer'],
        experienceYears: 5,
        certification: 'Level 1',
        hourlyRate: 50,
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          profile: { avatarUrl: 'avatar.jpg', phone: '123-456-7890' },
          status: { code: 'ACTIVE' },
          reviewsReceived: [
            { rating: 5, comment: 'Great coach', createdAt: new Date(), reviewer: { name: 'Reviewer 1' } },
          ],
          coachedStudents: [{ id: 1, name: 'Student 1', sport: 'Soccer' }],
          coachedSessions: [{ id: 1, title: 'Session 1', sessionDate: new Date(), status: { code: 'SCHEDULED', name: 'Scheduled' } }],
        },
      };

      (mockPrisma.coach.findFirst as any).mockResolvedValue(mockCoach);

      const response = await request(app).get('/coaches/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        userId: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'avatar.jpg',
        phone: '123-456-7890',
        specialty: ['Soccer'],
        rating: 5,
        students: 1,
        sessions: 1,
        status: 'Active',
        experienceYears: 5,
        certification: 'Level 1',
        hourlyRate: 50,
        reviews: [
          {
            rating: 5,
            comment: 'Great coach',
            createdAt: expect.any(String),
            reviewer: 'Reviewer 1',
          },
        ],
        studentsList: [{ id: 1, name: 'Student 1', sport: 'Soccer' }],
        sessionsList: [
          {
            id: 1,
            title: 'Session 1',
            sessionDate: expect.any(String),
            status: { code: 'SCHEDULED', name: 'Scheduled' },
          },
        ],
      });
      expect(mockPrisma.coach.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
          clubId: 1,
          deletedAt: null,
        },
        include: expect.any(Object),
      });
    });

    it('should return 404 if coach not found', async () => {
      (mockPrisma.coach.findFirst as any).mockResolvedValue(null);

      const response = await request(app).get('/coaches/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Coach not found' });
    });

    it('should return 500 on internal error', async () => {
      (mockPrisma.coach.findFirst as any).mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/coaches/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal error' });
    });
  });

  describe('POST /coaches', () => {
    it('should create a new coach', async () => {
      const coachData = {
        email: 'john@example.com',
        password: 'password123',
        name: 'John Doe',
        specializations: ['Soccer'],
        experienceYears: 5,
        certification: 'Level 1',
        hourlyRate: 50,
      };

      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        profile: { avatarUrl: null, phone: null },
        status: { code: 'ACTIVE' },
      };

      const mockCoach = {
        id: 1,
        userId: 1,
        specializations: ['Soccer'],
        experienceYears: 5,
        certification: 'Level 1',
        hourlyRate: 50,
      };

      (require('../src/utils/lookups').getUserStatusIdByCode as any).mockResolvedValue(1);
      (require('bcrypt').hash as any).mockResolvedValue('hashedPassword');
      (mockPrisma.role.upsert as any).mockResolvedValue({ id: 1, code: 'COACH', name: 'Coach', scope: 'CLUB' });
      (mockPrisma.user.create as any).mockResolvedValue(mockUser);
      (mockPrisma.coach.create as any).mockResolvedValue(mockCoach);
      (mockPrisma.userRoleAssignment.create as any).mockResolvedValue({});

      const response = await request(app).post('/coaches').send(coachData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        userId: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
        phone: null,
        specialty: ['Soccer'],
        rating: 0,
        students: 0,
        sessions: 0,
        status: 'Active',
        experienceYears: 5,
        certification: 'Level 1',
        hourlyRate: 50,
      });
      expect(require('bcrypt').hash).toHaveBeenCalledWith('password123', 10);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'john@example.com',
          passwordHash: 'hashedPassword',
          name: 'John Doe',
          clubId: 1,
          primaryRoleId: 1,
          statusId: 1,
          profile: {
            create: {
              displayName: 'John Doe',
            },
          },
        },
        include: expect.any(Object),
      });
      expect(mockPrisma.coach.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          clubId: 1,
          specializations: ['Soccer'],
          experienceYears: 5,
          certification: 'Level 1',
          hourlyRate: 50,
        },
      });
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/coaches').send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Email, password, name, and specializations are required' });
    });

    it('should return 409 if email already exists', async () => {
      const coachData = {
        email: 'john@example.com',
        password: 'password123',
        name: 'John Doe',
        specializations: ['Soccer'],
      };

      (require('../src/utils/lookups').getUserStatusIdByCode as any).mockResolvedValue(1);
      (require('bcrypt').hash as any).mockResolvedValue('hashedPassword');
      (mockPrisma.role.upsert as any).mockResolvedValue({ id: 1 });
      (mockPrisma.user.create as any).mockRejectedValue({ code: 'P2002' });

      const response = await request(app).post('/coaches').send(coachData);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ message: 'Email already exists' });
    });

    it('should return 500 if unable to resolve ACTIVE user status', async () => {
      const coachData = {
        email: 'john@example.com',
        password: 'password123',
        name: 'John Doe',
        specializations: ['Soccer'],
      };

      (require('../src/utils/lookups').getUserStatusIdByCode as any).mockResolvedValue(null);

      const response = await request(app).post('/coaches').send(coachData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Unable to resolve ACTIVE user status' });
    });

    it('should return 500 on internal error', async () => {
      const coachData = {
        email: 'john@example.com',
        password: 'password123',
        name: 'John Doe',
        specializations: ['Soccer'],
      };

      (require('../src/utils/lookups').getUserStatusIdByCode as any).mockResolvedValue(1);
      (require('bcrypt').hash as any).mockRejectedValue(new Error('Hash error'));

      const response = await request(app).post('/coaches').send(coachData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal error' });
    });
  });

  describe('PUT /coaches/:id', () => {
    it('should update coach as admin', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        specializations: ['Basketball'],
        experienceYears: 6,
        certification: 'Level 2',
        hourlyRate: 60,
      };

      const mockExistingCoach = {
        id: 1,
        user: {
          id: 1,
          profile: { avatarUrl: 'avatar.jpg', phone: '123-456-7890' },
        },
      };

      const mockUpdatedCoach = {
        id: 1,
        specializations: ['Basketball'],
        experienceYears: 6,
        certification: 'Level 2',
        hourlyRate: 60,
        user: {
          id: 1,
          name: 'Updated Name',
          email: 'updated@example.com',
          profile: { avatarUrl: 'avatar.jpg', phone: '123-456-7890' },
          status: { code: 'ACTIVE' },
          reviewsReceived: [{ rating: 5 }],
          coachedStudents: [{ id: 1, name: 'Student 1', sport: 'Soccer' }],
          coachedSessions: [{ id: 1, title: 'Session 1', sessionDate: new Date(), status: { code: 'SCHEDULED', name: 'Scheduled' } }],
        },
      };

      (mockPrisma.coach.findFirst as any).mockResolvedValue(mockExistingCoach);
      (mockPrisma.userRoleAssignment.findFirst as any).mockResolvedValue({ role: { code: 'SUPER_ADMIN' } });
      (mockPrisma.user.update as any).mockResolvedValue({});
      (mockPrisma.coach.update as any).mockResolvedValue(mockUpdatedCoach);

      const response = await request(app).put('/coaches/1').send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        userId: 1,
        name: 'Updated Name',
        email: 'updated@example.com',
        avatar: 'avatar.jpg',
        phone: '123-456-7890',
        specialty: ['Basketball'],
        rating: 5,
        students: 1,
        sessions: 1,
        status: 'Active',
        experienceYears: 6,
        certification: 'Level 2',
        hourlyRate: 60,
      });
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Updated Name',
          email: 'updated@example.com',
          updatedAt: expect.any(Date),
        },
      });
      expect(mockPrisma.coach.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          specializations: ['Basketball'],
          experienceYears: 6,
          certification: 'Level 2',
          hourlyRate: 60,
          updatedAt: expect.any(Date),
        },
        include: expect.any(Object),
      });
    });

    it('should update coach as self', async () => {
      const updateData = {
        specializations: ['Basketball'],
        experienceYears: 6,
      };

      const mockExistingCoach = {
        id: 1,
        user: {
          id: 1, // Same as req.user.id
          profile: { avatarUrl: 'avatar.jpg', phone: '123-456-7890' },
        },
      };

      const mockUpdatedCoach = {
        id: 1,
        specializations: ['Basketball'],
        experienceYears: 6,
        certification: 'Level 1',
        hourlyRate: 50,
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          profile: { avatarUrl: 'avatar.jpg', phone: '123-456-7890' },
          status: { code: 'ACTIVE' },
          reviewsReceived: [{ rating: 5 }],
          coachedStudents: [{ id: 1, name: 'Student 1', sport: 'Soccer' }],
          coachedSessions: [{ id: 1, title: 'Session 1', sessionDate: new Date(), status: { code: 'SCHEDULED', name: 'Scheduled' } }],
        },
      };

      (mockPrisma.coach.findFirst as any).mockResolvedValue(mockExistingCoach);
      (mockPrisma.userRoleAssignment.findFirst as any).mockResolvedValue(null); // Not admin
      (mockPrisma.coach.update as any).mockResolvedValue(mockUpdatedCoach);

      const response = await request(app).put('/coaches/1').send(updateData);

      expect(response.status).toBe(200);
      expect(mockPrisma.coach.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          specializations: ['Basketball'],
          experienceYears: 6,
          updatedAt: expect.any(Date),
        },
        include: expect.any(Object),
      });
    });

    it('should return 404 if coach not found', async () => {
      (mockPrisma.coach.findFirst as any).mockResolvedValue(null);

      const response = await request(app).put('/coaches/1').send({ specializations: ['Soccer'] });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Coach not found' });
    });

    it('should return 403 if not admin or self', async () => {
      const mockExistingCoach = {
        id: 1,
        user: {
          id: 2, // Different from req.user.id (1)
          profile: { avatarUrl: 'avatar.jpg', phone: '123-456-7890' },
        },
      };

      (mockPrisma.coach.findFirst as any).mockResolvedValue(mockExistingCoach);
      (mockPrisma.userRoleAssignment.findFirst as any).mockResolvedValue(null); // Not admin

      const response = await request(app).put('/coaches/1').send({ specializations: ['Soccer'] });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: 'Access denied' });
    });

    it('should return 500 on internal error', async () => {
      (mockPrisma.coach.findFirst as any).mockRejectedValue(new Error('DB error'));

      const response = await request(app).put('/coaches/1').send({ specializations: ['Soccer'] });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal error' });
    });
  });

  describe('DELETE /coaches/:id', () => {
    it('should soft delete coach', async () => {
      const mockExistingCoach = { id: 1 };

      (mockPrisma.coach.findFirst as any).mockResolvedValue(mockExistingCoach);
      (mockPrisma.coach.update as any).mockResolvedValue({});

      const response = await request(app).delete('/coaches/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true });
      expect(mockPrisma.coach.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          deletedAt: expect.any(Date),
        },
      });
    });

    it('should return 404 if coach not found', async () => {
      (mockPrisma.coach.findFirst as any).mockResolvedValue(null);

      const response = await request(app).delete('/coaches/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Coach not found' });
    });

    it('should return 500 on internal error', async () => {
      (mockPrisma.coach.findFirst as any).mockRejectedValue(new Error('DB error'));

      const response = await request(app).delete('/coaches/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal error' });
    });
  });
});