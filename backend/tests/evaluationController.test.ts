import request from 'supertest';
import express from 'express';

jest.resetModules();

const mockPrisma = {
  evaluation: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  student: {
    findFirst: jest.fn(),
  },
  session: {
    findFirst: jest.fn(),
  },
  userRoleAssignment: {
    findFirst: jest.fn(),
  },
  coach: {
    findFirst: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
  Prisma: {
    validator: jest.fn(() => (include: any) => include),
  },
}));

jest.mock('../src/db', () => mockPrisma);

jest.mock('../src/middleware/jwtAuth', () => ({
  requireAuth: (req: any, res: any, next: any) => {
    req.user = { id: 1, clubId: 1 };
    next();
  },
  AuthRequest: {},
}));

jest.mock('../src/middleware/rbac', () => ({
  requireRole: (roles: string[]) => (req: any, res: any, next: any) => {
    next();
  },
}));

import evaluationController from '../src/controllers/evaluationController';

const app = express();
app.use(express.json());
app.use('/evaluations', evaluationController);

describe('Evaluation Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /evaluations/student/:studentId', () => {
    it('should return evaluations for a student as admin', async () => {
      mockPrisma.student.findFirst.mockResolvedValue({ id: 1, parentId: 2 });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue({ userId: 1 });
      mockPrisma.evaluation.findMany.mockResolvedValue([
        {
          id: 1,
          overallScore: 4,
          comments: 'Good job',
          createdAt: new Date(),
          session: { id: 1, title: 'Session 1', sessionDate: new Date(), coach: { name: 'Coach 1' } },
          coach: { name: 'Coach 1', profile: { displayName: 'Coach One' } },
        },
      ]);

      const response = await request(app).get('/evaluations/student/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(mockPrisma.student.findFirst).toHaveBeenCalledWith({
        where: { id: 1, clubId: 1, deletedAt: null },
      });
      expect(mockPrisma.userRoleAssignment.findFirst).toHaveBeenCalledWith({
        where: { userId: 1, role: { code: 'SUPER_ADMIN' } },
      });
      expect(mockPrisma.evaluation.findMany).toHaveBeenCalledWith({
        where: { studentId: 1, session: { clubId: 1 } },
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return evaluations for a student as coach', async () => {
      mockPrisma.student.findFirst.mockResolvedValue({ id: 1, parentId: 2 });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null);
      mockPrisma.coach.findFirst.mockResolvedValue({ userId: 1 });
      mockPrisma.evaluation.findMany.mockResolvedValue([]);

      const response = await request(app).get('/evaluations/student/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(mockPrisma.coach.findFirst).toHaveBeenCalledWith({
        where: { userId: 1, clubId: 1 },
      });
    });

    it('should return evaluations for a student as parent', async () => {
      mockPrisma.student.findFirst.mockResolvedValue({ id: 1, parentId: 1 });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null);
      mockPrisma.coach.findFirst.mockResolvedValue(null);
      mockPrisma.evaluation.findMany.mockResolvedValue([]);

      const response = await request(app).get('/evaluations/student/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return 404 if student not found', async () => {
      mockPrisma.student.findFirst.mockResolvedValue(null);

      const response = await request(app).get('/evaluations/student/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Student not found');
    });

    it('should return 403 if access denied', async () => {
      mockPrisma.student.findFirst.mockResolvedValue({ id: 1, parentId: 2 });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null);
      mockPrisma.coach.findFirst.mockResolvedValue(null);

      const response = await request(app).get('/evaluations/student/1');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied');
    });

    it('should return 500 on internal error', async () => {
      mockPrisma.student.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/evaluations/student/1');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal error');
    });
  });

  describe('GET /evaluations/session/:sessionId', () => {
    it('should return evaluations for a session', async () => {
      mockPrisma.session.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.evaluation.findMany.mockResolvedValue([
        {
          id: 1,
          overallScore: 4,
          comments: 'Good job',
          createdAt: new Date(),
          student: { id: 1, name: 'Student 1', user: { profile: { displayName: 'Student One' } } },
          coach: { name: 'Coach 1', profile: { displayName: 'Coach One' } },
        },
      ]);

      const response = await request(app).get('/evaluations/session/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(mockPrisma.session.findFirst).toHaveBeenCalledWith({
        where: { id: 1, clubId: 1, deletedAt: null },
      });
      expect(mockPrisma.evaluation.findMany).toHaveBeenCalledWith({
        where: { sessionId: 1, session: { clubId: 1 } },
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return 404 if session not found', async () => {
      mockPrisma.session.findFirst.mockResolvedValue(null);

      const response = await request(app).get('/evaluations/session/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Session not found');
    });

    it('should return 500 on internal error', async () => {
      mockPrisma.session.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/evaluations/session/1');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal error');
    });
  });

  describe('POST /evaluations/session/:sessionId/student/:studentId', () => {
    it('should create a new evaluation', async () => {
      const evaluationData = {
        overallScore: 4,
        comments: 'Good job',
        evaluationType: 'performance',
      };
      mockPrisma.session.findFirst.mockResolvedValue({ id: 1, sessionDate: new Date() });
      mockPrisma.student.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue({ userId: 1 });
      mockPrisma.evaluation.findFirst.mockResolvedValue(null);
      mockPrisma.evaluation.create.mockResolvedValue({
        id: 1,
        overallScore: 4,
        comments: 'Good job',
        createdAt: new Date(),
        student: { id: 1, name: 'Student 1' },
        coach: { name: 'Coach 1' },
      });

      const response = await request(app)
        .post('/evaluations/session/1/student/1')
        .send(evaluationData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(mockPrisma.session.findFirst).toHaveBeenCalledWith({
        where: { id: 1, clubId: 1, deletedAt: null, sessionDate: { lte: expect.any(Date) } },
      });
      expect(mockPrisma.evaluation.create).toHaveBeenCalledWith({
        data: {
          sessionId: 1,
          studentId: 1,
          coachId: 1,
          evaluationType: 'performance',
          overallScore: 4,
          comments: 'Good job',
        },
        select: expect.any(Object),
      });
    });

    it('should return 400 if overallScore is invalid', async () => {
      const response = await request(app)
        .post('/evaluations/session/1/student/1')
        .send({ overallScore: 6, evaluationType: 'performance' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Overall score must be a number between 1 and 5');
    });

    it('should return 400 if evaluationType is missing', async () => {
      const response = await request(app)
        .post('/evaluations/session/1/student/1')
        .send({ overallScore: 4 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Evaluation type is required');
    });

    it('should return 404 if session not found', async () => {
      mockPrisma.session.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post('/evaluations/session/1/student/1')
        .send({ overallScore: 4, evaluationType: 'performance' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Session not found or has not occurred yet');
    });

    it('should return 404 if student not found', async () => {
      mockPrisma.session.findFirst.mockResolvedValue({ id: 1, sessionDate: new Date() });
      mockPrisma.student.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post('/evaluations/session/1/student/1')
        .send({ overallScore: 4, evaluationType: 'performance' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Student not found');
    });

    it('should return 403 if access denied', async () => {
      mockPrisma.session.findFirst.mockResolvedValue({ id: 1, sessionDate: new Date() });
      mockPrisma.student.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null);
      mockPrisma.coach.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post('/evaluations/session/1/student/1')
        .send({ overallScore: 4, evaluationType: 'performance' });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied');
    });

    it('should return 409 if evaluation already exists', async () => {
      mockPrisma.session.findFirst.mockResolvedValue({ id: 1, sessionDate: new Date() });
      mockPrisma.student.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue({ userId: 1 });
      mockPrisma.evaluation.findFirst.mockResolvedValue({ id: 1 });

      const response = await request(app)
        .post('/evaluations/session/1/student/1')
        .send({ overallScore: 4, evaluationType: 'performance' });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Evaluation already exists for this student in this session');
    });

    it('should return 500 on internal error', async () => {
      mockPrisma.session.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .post('/evaluations/session/1/student/1')
        .send({ overallScore: 4, evaluationType: 'performance' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal error');
    });
  });

  describe('PUT /evaluations/:id', () => {
    it('should update evaluation as admin', async () => {
      const updateData = { overallScore: 5, comments: 'Excellent' };
      mockPrisma.evaluation.findFirst.mockResolvedValue({ coachId: 2 });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue({ userId: 1 });
      mockPrisma.evaluation.update.mockResolvedValue({
        id: 1,
        overallScore: 5,
        comments: 'Excellent',
        createdAt: new Date(),
        updatedAt: new Date(),
        student: { id: 1, name: 'Student 1' },
        coach: { name: 'Coach 1' },
      });

      const response = await request(app).put('/evaluations/1').send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.overallScore).toBe(5);
      expect(mockPrisma.evaluation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { overallScore: 5, comments: 'Excellent', updatedAt: expect.any(Date) },
        select: expect.any(Object),
      });
    });

    it('should update evaluation as original evaluator', async () => {
      const updateData = { overallScore: 5, comments: 'Excellent' };
      mockPrisma.evaluation.findFirst.mockResolvedValue({ coachId: 1 });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null);
      mockPrisma.evaluation.update.mockResolvedValue({
        id: 1,
        overallScore: 5,
        comments: 'Excellent',
        createdAt: new Date(),
        updatedAt: new Date(),
        student: { id: 1, name: 'Student 1' },
        coach: { name: 'Coach 1' },
      });

      const response = await request(app).put('/evaluations/1').send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.overallScore).toBe(5);
    });

    it('should return 400 if overallScore is invalid', async () => {
      const response = await request(app).put('/evaluations/1').send({ overallScore: 6 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Overall score must be a number between 1 and 5');
    });

    it('should return 404 if evaluation not found', async () => {
      mockPrisma.evaluation.findFirst.mockResolvedValue(null);

      const response = await request(app).put('/evaluations/1').send({ overallScore: 5 });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Evaluation not found');
    });

    it('should return 403 if access denied', async () => {
      mockPrisma.evaluation.findFirst.mockResolvedValue({ coachId: 2 });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null);

      const response = await request(app).put('/evaluations/1').send({ overallScore: 5 });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied');
    });

    it('should return 500 on internal error', async () => {
      mockPrisma.evaluation.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app).put('/evaluations/1').send({ overallScore: 5 });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal error');
    });
  });

  describe('DELETE /evaluations/:id', () => {
    it('should soft delete evaluation', async () => {
      mockPrisma.evaluation.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.evaluation.update.mockResolvedValue({});

      const response = await request(app).delete('/evaluations/1');

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe('Evaluation soft deleted');
      expect(mockPrisma.evaluation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should return 404 if evaluation not found', async () => {
      mockPrisma.evaluation.findFirst.mockResolvedValue(null);

      const response = await request(app).delete('/evaluations/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Evaluation not found');
    });

    it('should return 500 on internal error', async () => {
      mockPrisma.evaluation.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app).delete('/evaluations/1');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal error');
    });
  });

  describe('POST /evaluations/:id/restore', () => {
    it('should restore evaluation', async () => {
      mockPrisma.evaluation.findFirst.mockResolvedValue({ id: 1, deletedAt: new Date() });
      mockPrisma.evaluation.update.mockResolvedValue({
        id: 1,
        overallScore: 4,
        comments: 'Good job',
        createdAt: new Date(),
        student: { id: 1, name: 'Student 1' },
        coach: { name: 'Coach 1' },
      });

      const response = await request(app).post('/evaluations/1/restore');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(mockPrisma.evaluation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: null },
        select: expect.any(Object),
      });
    });

    it('should return 404 if evaluation not found', async () => {
      mockPrisma.evaluation.findFirst.mockResolvedValue(null);

      const response = await request(app).post('/evaluations/1/restore');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Evaluation not found');
    });

    it('should return 400 if evaluation is not deleted', async () => {
      mockPrisma.evaluation.findFirst.mockResolvedValue({ id: 1, deletedAt: null });

      const response = await request(app).post('/evaluations/1/restore');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Evaluation is not deleted');
    });

    it('should return 500 on internal error', async () => {
      mockPrisma.evaluation.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app).post('/evaluations/1/restore');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal error');
    });
  });

  describe('GET /evaluations/student/:studentId/stats', () => {
    it('should return evaluation statistics', async () => {
      mockPrisma.student.findFirst.mockResolvedValue({ id: 1, parentId: 2 });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue({ userId: 1 });
      mockPrisma.evaluation.findMany.mockResolvedValue([
        { overallScore: 4, createdAt: new Date() },
        { overallScore: 5, createdAt: new Date() },
        { overallScore: 3, createdAt: new Date() },
      ]);

      const response = await request(app).get('/evaluations/student/1/stats');

      expect(response.status).toBe(200);
      expect(response.body.totalEvaluations).toBe(3);
      expect(response.body.averageRating).toBe(4);
      expect(response.body.ratingDistribution).toEqual({ 1: 0, 2: 0, 3: 1, 4: 1, 5: 1 });
      expect(response.body.recentTrend).toHaveLength(3);
    });

    it('should return empty stats if no evaluations', async () => {
      mockPrisma.student.findFirst.mockResolvedValue({ id: 1, parentId: 2 });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue({ userId: 1 });
      mockPrisma.evaluation.findMany.mockResolvedValue([]);

      const response = await request(app).get('/evaluations/student/1/stats');

      expect(response.status).toBe(200);
      expect(response.body.totalEvaluations).toBe(0);
      expect(response.body.averageRating).toBe(0);
      expect(response.body.ratingDistribution).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      expect(response.body.recentTrend).toEqual([]);
    });

    it('should return 404 if student not found', async () => {
      mockPrisma.student.findFirst.mockResolvedValue(null);

      const response = await request(app).get('/evaluations/student/1/stats');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Student not found');
    });

    it('should return 403 if access denied', async () => {
      mockPrisma.student.findFirst.mockResolvedValue({ id: 1, parentId: 2 });
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null);
      mockPrisma.coach.findFirst.mockResolvedValue(null);

      const response = await request(app).get('/evaluations/student/1/stats');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied');
    });

    it('should return 500 on internal error', async () => {
      mockPrisma.student.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/evaluations/student/1/stats');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal error');
    });
  });
});