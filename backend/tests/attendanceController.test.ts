import request from 'supertest';
import express from 'express';

// Mock PrismaClient
const mockPrisma = {
  session: {
    findFirst: jest.fn(),
  },
  attendance: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
  },
  student: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
  user: {
    findFirst: jest.fn(),
  },
  attendanceStatus: {
    findUnique: jest.fn(),
  },
  userRoleAssignment: {
    findFirst: jest.fn(),
  },
  coach: {
    findFirst: jest.fn(),
  },
  $transaction: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

jest.mock('../src/middleware/jwtAuth', () => ({
  requireAuth: jest.fn((req: any, res: any, next: any) => {
    req.user = { id: 1, clubId: 1 };
    next();
  }),
}));

jest.mock('../src/middleware', () => ({
  requireRole: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

jest.mock('../src/server', () => ({
  socketService: {
    broadcastToClub: jest.fn(),
  },
}));

jest.mock('../src/utils/lookups', () => ({
  getAttendanceStatusIdByCode: jest.fn(),
}));

jest.resetModules();

// Now import
import attendanceRoutes from '../src/controllers/attendanceController';
import { socketService } from '../src/server';
import { getAttendanceStatusIdByCode } from '../src/utils/lookups';

const mockSocketService = socketService as any;
const mockGetAttendanceStatusIdByCode = getAttendanceStatusIdByCode as any;

const app = express();
app.use(express.json());
app.use('/api/attendance', attendanceRoutes);

describe('Attendance Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/attendance/session/:sessionId', () => {
    it('should return attendance for a session', async () => {
      const sessionId = 1;
      const clubId = 1;
      const mockSession = { id: sessionId, clubId };
      const mockAttendances = [
        {
          id: 1,
          status: { code: 'PRESENT', name: 'Present' },
          checkinTime: new Date(),
          notes: 'On time',
          recordedAt: new Date(),
          student: {
            id: 1,
            name: 'John Doe',
            user: { profile: { displayName: 'Johnny' } },
          },
          recorder: {
            name: 'Coach Smith',
            profile: { displayName: 'Coach' },
          },
        },
      ];

      mockPrisma.session.findFirst.mockResolvedValue(mockSession);
      mockPrisma.attendance.findMany.mockResolvedValue(mockAttendances);

      const response = await request(app)
        .get(`/api/attendance/session/${sessionId}`)
        .set('Authorization', 'Bearer token')
        .expect(200);

      expect(mockPrisma.session.findFirst).toHaveBeenCalledWith({
        where: {
          id: sessionId,
          clubId,
          deletedAt: null,
        },
      });
      expect(mockPrisma.attendance.findMany).toHaveBeenCalledWith({
        where: {
          sessionId,
          session: { clubId },
        },
        select: expect.any(Object),
        orderBy: { recordedAt: 'desc' },
      });
      // Dates are serialized to strings in JSON response
      expect(response.body[0]).toMatchObject({
        id: 1,
        status: { code: 'PRESENT', name: 'Present' },
        notes: 'On time',
        student: {
          id: 1,
          name: 'John Doe',
          user: { profile: { displayName: 'Johnny' } },
        },
        recorder: {
          name: 'Coach Smith',
          profile: { displayName: 'Coach' },
        },
      });
    });

    it('should return 404 if session not found', async () => {
      const sessionId = 1;
      const clubId = 1;

      mockPrisma.session.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/attendance/session/${sessionId}`)
        .set('Authorization', 'Bearer token')
        .expect(404);

      expect(response.body.message).toBe('Session not found');
    });

    it('should handle internal error', async () => {
      const sessionId = 1;

      mockPrisma.session.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .get(`/api/attendance/session/${sessionId}`)
        .set('Authorization', 'Bearer token')
        .expect(500);

      expect(response.body.message).toBe('Internal error');
    });
  });

  describe('POST /api/attendance/session/:sessionId/student/:studentId', () => {
    it('should create attendance record', async () => {
      const sessionId = 1;
      const studentId = 1;
      const clubId = 1;
      const statusCode = 'PRESENT';
      const mockSession = { id: sessionId, clubId, sessionDate: new Date(Date.now() - 1000) }; // Past date
      const mockStudent = { id: studentId, clubId };
      const mockStatus = { id: 1 };
      const mockAttendance = {
        id: 1,
        statusId: 1,
        checkinTime: new Date().toISOString(),
        notes: 'Test',
        recordedAt: new Date().toISOString(),
        studentId,
        sessionId,
        recorderId: 1,
      };

      mockPrisma.session.findFirst.mockResolvedValue(mockSession);
      mockPrisma.student.findFirst.mockResolvedValue(mockStudent);
      mockGetAttendanceStatusIdByCode.mockResolvedValue(1);
      mockPrisma.attendanceStatus.findUnique.mockResolvedValue(mockStatus);
      mockPrisma.attendance.findUnique.mockResolvedValue(null); // No existing attendance
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null); // Not admin
      mockPrisma.coach.findFirst.mockResolvedValue({ id: 1 }); // Is coach
      mockPrisma.attendance.create.mockResolvedValue(mockAttendance);
      mockSocketService.broadcastToClub.mockReturnValue(undefined);

      const response = await request(app)
        .post(`/api/attendance/session/${sessionId}/student/${studentId}`)
        .set('Authorization', 'Bearer token')
        .send({ status: statusCode, notes: 'Test' })
        .expect(200);

      expect(mockPrisma.session.findFirst).toHaveBeenCalledWith({
        where: { 
          id: sessionId, 
          clubId, 
          deletedAt: null,
          sessionDate: { lte: expect.any(Date) }
        },
      });
      expect(mockPrisma.student.findFirst).toHaveBeenCalledWith({
        where: { id: studentId, clubId, deletedAt: null },
      });
      expect(mockGetAttendanceStatusIdByCode).toHaveBeenCalledWith(statusCode);
      expect(mockPrisma.attendance.create).toHaveBeenCalled();
      expect(response.body).toEqual(mockAttendance);
    });

    it('should return 404 if session not found', async () => {
      const sessionId = 1;
      const studentId = 1;

      mockPrisma.session.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post(`/api/attendance/session/${sessionId}/student/${studentId}`)
        .set('Authorization', 'Bearer token')
        .send({ status: 'PRESENT' })
        .expect(404);

      expect(response.body.message).toBe('Session not found or not yet occurred');
    });

    it('should return 404 if student not found', async () => {
      const sessionId = 1;
      const studentId = 1;
      const clubId = 1;
      const mockSession = { id: sessionId, clubId };

      mockPrisma.session.findFirst.mockResolvedValue(mockSession);
      mockPrisma.student.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post(`/api/attendance/session/${sessionId}/student/${studentId}`)
        .set('Authorization', 'Bearer token')
        .send({ status: 'PRESENT' })
        .expect(404);

      expect(response.body.message).toBe('Student not found');
    });

    it('should return 400 for invalid status', async () => {
      const sessionId = 1;
      const studentId = 1;
      const clubId = 1;
      const mockSession = { id: sessionId, clubId, sessionDate: new Date(Date.now() - 1000) };
      const mockStudent = { id: studentId, clubId };

      mockPrisma.session.findFirst.mockResolvedValue(mockSession);
      mockPrisma.student.findFirst.mockResolvedValue(mockStudent);
      mockGetAttendanceStatusIdByCode.mockResolvedValue(null);

      const response = await request(app)
        .post(`/api/attendance/session/${sessionId}/student/${studentId}`)
        .set('Authorization', 'Bearer token')
        .send({ status: 'INVALID' })
        .expect(400);

      expect(response.body.message).toBe('Invalid status: INVALID');
    });
  });

  describe('GET /api/attendance/student/:studentId', () => {
    it('should return attendance for a student', async () => {
      const studentId = 1;
      const clubId = 1;
      const mockStudent = { id: studentId, clubId, parentId: null };
      const mockAttendances = [
        {
          id: 1,
          status: { code: 'PRESENT' },
          checkinTime: new Date().toISOString(),
          notes: 'Good',
          recordedAt: new Date().toISOString(),
          session: {
            id: 1,
            title: 'Session 1',
            sessionDate: new Date().toISOString(),
            startTime: '10:00',
            endTime: '11:00',
            coach: { name: 'Coach Smith' },
          },
          recorder: { name: 'Recorder' },
        },
      ];

      mockPrisma.student.findFirst.mockResolvedValue(mockStudent);
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null); // Not admin
      mockPrisma.coach.findFirst.mockResolvedValue({ id: 1 }); // Is coach
      mockPrisma.attendance.findMany.mockResolvedValue(mockAttendances);

      const response = await request(app)
        .get(`/api/attendance/student/${studentId}`)
        .set('Authorization', 'Bearer token')
        .expect(200);

      expect(mockPrisma.student.findFirst).toHaveBeenCalledWith({
        where: { id: studentId, clubId, deletedAt: null },
      });
      expect(mockPrisma.attendance.findMany).toHaveBeenCalledWith({
        where: { studentId, session: { clubId } },
        select: expect.any(Object),
        orderBy: { recordedAt: 'desc' },
      });
      expect(response.body).toEqual(mockAttendances);
    });

    it('should return 404 if student not found', async () => {
      const studentId = 1;

      mockPrisma.student.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/attendance/student/${studentId}`)
        .set('Authorization', 'Bearer token')
        .expect(404);

      expect(response.body.message).toBe('Student not found');
    });

    it('should return 403 if access denied', async () => {
      const studentId = 1;
      const clubId = 1;
      const mockStudent = { id: studentId, clubId, parentId: 999 }; // Not current user

      mockPrisma.student.findFirst.mockResolvedValue(mockStudent);
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null); // Not admin
      mockPrisma.coach.findFirst.mockResolvedValue(null); // Not coach

      const response = await request(app)
        .get(`/api/attendance/student/${studentId}`)
        .set('Authorization', 'Bearer token')
        .expect(403);

      expect(response.body.message).toBe('Access denied');
    });

    it('should handle internal error', async () => {
      const studentId = 1;

      mockPrisma.student.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .get(`/api/attendance/student/${studentId}`)
        .set('Authorization', 'Bearer token')
        .expect(500);

      expect(response.body.message).toBe('Internal error');
    });
  });

  describe('PUT /api/attendance/:id', () => {
    it('should update attendance record', async () => {
      const attendanceId = 1;
      const clubId = 1;
      const statusCode = 'ABSENT';
      const mockAttendance = {
        recordedBy: 1,
      };
      const mockUpdatedAttendance = {
        id: attendanceId,
        sessionId: 1,
        status: { code: statusCode, name: 'Absent' },
        checkinTime: new Date().toISOString(),
        notes: 'Updated',
        recordedAt: new Date().toISOString(),
        student: { id: 1, name: 'John' },
        recorder: { name: 'Recorder' },
      };

      mockPrisma.attendance.findFirst.mockResolvedValue(mockAttendance);
      mockGetAttendanceStatusIdByCode.mockResolvedValue(2);
      mockPrisma.attendance.update.mockResolvedValue(mockUpdatedAttendance);

      const response = await request(app)
        .put(`/api/attendance/${attendanceId}`)
        .set('Authorization', 'Bearer token')
        .send({ status: statusCode, notes: 'Updated' })
        .expect(200);

      expect(mockPrisma.attendance.findFirst).toHaveBeenCalledWith({
        where: { id: attendanceId, session: { clubId } },
        select: { recordedBy: true },
      });
      expect(mockGetAttendanceStatusIdByCode).toHaveBeenCalledWith(statusCode);
      expect(mockPrisma.attendance.update).toHaveBeenCalledWith({
        where: { id: attendanceId },
        data: { statusId: 2, checkinTime: undefined, notes: 'Updated' },
        select: expect.any(Object),
      });
      expect(mockSocketService.broadcastToClub).toHaveBeenCalledWith(clubId, 'attendance-updated', {
        sessionId: 1,
        attendance: mockUpdatedAttendance,
      });
      expect(response.body).toEqual(mockUpdatedAttendance);
    });

    it('should return 400 for invalid status', async () => {
      const attendanceId = 1;
      const clubId = 1;
      const mockAttendance = { recordedBy: 1 };

      mockPrisma.attendance.findFirst.mockResolvedValue(mockAttendance);
      mockGetAttendanceStatusIdByCode.mockResolvedValue(null);

      const response = await request(app)
        .put(`/api/attendance/${attendanceId}`)
        .set('Authorization', 'Bearer token')
        .send({ status: 'INVALID' })
        .expect(400);

      expect(response.body.message).toBe('Invalid status: INVALID');
    });

    it('should return 404 if attendance not found', async () => {
      const attendanceId = 1;

      mockPrisma.attendance.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .put(`/api/attendance/${attendanceId}`)
        .set('Authorization', 'Bearer token')
        .send({ notes: 'Updated' })
        .expect(404);

      expect(response.body.message).toBe('Attendance record not found');
    });

    it('should return 403 if access denied', async () => {
      const attendanceId = 1;
      const clubId = 1;
      const mockAttendance = { recordedBy: 999 }; // Not current user

      mockPrisma.attendance.findFirst.mockResolvedValue(mockAttendance);
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null); // Not admin

      const response = await request(app)
        .put(`/api/attendance/${attendanceId}`)
        .set('Authorization', 'Bearer token')
        .send({ notes: 'Updated' })
        .expect(403);

      expect(response.body.message).toBe('Access denied');
    });

    it('should handle internal error', async () => {
      const attendanceId = 1;

      mockPrisma.attendance.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .put(`/api/attendance/${attendanceId}`)
        .set('Authorization', 'Bearer token')
        .send({ notes: 'Updated' })
        .expect(500);

      expect(response.body.message).toBe('Internal error');
    });
  });

  describe('DELETE /api/attendance/:id', () => {
    it('should soft delete attendance record', async () => {
      const attendanceId = 1;
      const clubId = 1;
      const mockAttendance = { id: attendanceId };

      mockPrisma.attendance.findFirst.mockResolvedValue(mockAttendance);
      mockPrisma.attendance.update.mockResolvedValue({});

      const response = await request(app)
        .delete(`/api/attendance/${attendanceId}`)
        .set('Authorization', 'Bearer token')
        .expect(200);

      expect(mockPrisma.attendance.findFirst).toHaveBeenCalledWith({
        where: { id: attendanceId, session: { clubId }, deletedAt: null },
      });
      expect(mockPrisma.attendance.update).toHaveBeenCalledWith({
        where: { id: attendanceId },
        data: { deletedAt: expect.any(Date) },
      });
      expect(response.body).toEqual({ ok: true, message: 'Attendance record soft deleted' });
    });

    it('should return 404 if attendance not found', async () => {
      const attendanceId = 1;

      mockPrisma.attendance.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .delete(`/api/attendance/${attendanceId}`)
        .set('Authorization', 'Bearer token')
        .expect(404);

      expect(response.body.message).toBe('Attendance record not found');
    });

    it('should handle internal error', async () => {
      const attendanceId = 1;

      mockPrisma.attendance.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .delete(`/api/attendance/${attendanceId}`)
        .set('Authorization', 'Bearer token')
        .expect(500);

      expect(response.body.message).toBe('Internal error');
    });
  });

  describe('POST /api/attendance/:id/restore', () => {
    it('should restore attendance record', async () => {
      const attendanceId = 1;
      const clubId = 1;
      const mockExisting = { id: attendanceId, deletedAt: new Date() };
      const mockRestored = {
        id: attendanceId,
        status: { code: 'PRESENT', name: 'Present' },
        checkinTime: new Date().toISOString(),
        notes: 'Restored',
        recordedAt: new Date().toISOString(),
        student: { id: 1, name: 'John' },
        recorder: { name: 'Recorder' },
      };

      mockPrisma.attendance.findFirst.mockResolvedValue(mockExisting);
      mockPrisma.attendance.update.mockResolvedValue(mockRestored);

      const response = await request(app)
        .post(`/api/attendance/${attendanceId}/restore`)
        .set('Authorization', 'Bearer token')
        .expect(200);

      expect(mockPrisma.attendance.findFirst).toHaveBeenCalledWith({
        where: { id: attendanceId, session: { clubId } },
      });
      expect(mockPrisma.attendance.update).toHaveBeenCalledWith({
        where: { id: attendanceId },
        data: { deletedAt: null },
        select: expect.any(Object),
      });
      expect(response.body).toEqual(mockRestored);
    });

    it('should return 404 if attendance not found', async () => {
      const attendanceId = 1;

      mockPrisma.attendance.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post(`/api/attendance/${attendanceId}/restore`)
        .set('Authorization', 'Bearer token')
        .expect(404);

      expect(response.body.message).toBe('Attendance record not found');
    });

    it('should return 400 if not deleted', async () => {
      const attendanceId = 1;
      const clubId = 1;
      const mockExisting = { id: attendanceId, deletedAt: null };

      mockPrisma.attendance.findFirst.mockResolvedValue(mockExisting);

      const response = await request(app)
        .post(`/api/attendance/${attendanceId}/restore`)
        .set('Authorization', 'Bearer token')
        .expect(400);

      expect(response.body.message).toBe('Attendance record is not deleted');
    });

    it('should handle internal error', async () => {
      const attendanceId = 1;

      mockPrisma.attendance.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .post(`/api/attendance/${attendanceId}/restore`)
        .set('Authorization', 'Bearer token')
        .expect(500);

      expect(response.body.message).toBe('Internal error');
    });
  });

  describe('POST /api/attendance/session/:sessionId/bulk', () => {
    it('should create bulk attendance records', async () => {
      const sessionId = 1;
      const clubId = 1;
      const mockSession = { id: sessionId, clubId, sessionDate: new Date(Date.now() - 1000) };
      const attendances = [
        { studentId: 1, status: 'PRESENT', notes: 'Good' },
        { studentId: 2, status: 'ABSENT', notes: 'Sick' },
      ];
      const mockStudents = [
        { id: 1 },
        { id: 2 },
      ];
      const mockCreated = [
        {
          id: 1,
          status: { code: 'PRESENT' },
          student: { id: 1, name: 'John' },
        },
        {
          id: 2,
          status: { code: 'ABSENT' },
          student: { id: 2, name: 'Jane' },
        },
      ];

      mockPrisma.session.findFirst.mockResolvedValue(mockSession);
      mockPrisma.student.findMany.mockResolvedValue(mockStudents);
      mockPrisma.attendance.findMany.mockResolvedValue([]); // No existing
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null); // Not admin
      mockPrisma.coach.findFirst.mockResolvedValue({ id: 1 }); // Is coach
      mockPrisma.$transaction.mockResolvedValue(mockCreated);

      const response = await request(app)
        .post(`/api/attendance/session/${sessionId}/bulk`)
        .set('Authorization', 'Bearer token')
        .send({ attendances })
        .expect(200);

      expect(mockPrisma.session.findFirst).toHaveBeenCalledWith({
        where: { id: sessionId, clubId, deletedAt: null, sessionDate: { lte: expect.any(Date) } },
      });
      expect(mockPrisma.student.findMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2] }, clubId, deletedAt: null },
        select: { id: true },
      });
      expect(mockPrisma.attendance.findMany).toHaveBeenCalledWith({
        where: { sessionId, studentId: { in: [1, 2] } },
        select: { studentId: true },
      });
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(response.body).toEqual(mockCreated);
    });

    it('should return 400 if no attendances array', async () => {
      const sessionId = 1;

      const response = await request(app)
        .post(`/api/attendance/session/${sessionId}/bulk`)
        .set('Authorization', 'Bearer token')
        .send({})
        .expect(400);

      expect(response.body.message).toBe('attendances array is required');
    });

    it('should return 404 if session not found', async () => {
      const sessionId = 1;
      const attendances = [{ studentId: 1, status: 'PRESENT' }];

      mockPrisma.session.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post(`/api/attendance/session/${sessionId}/bulk`)
        .set('Authorization', 'Bearer token')
        .send({ attendances })
        .expect(404);

      expect(response.body.message).toBe('Session not found or not yet occurred');
    });

    it('should return 403 if access denied', async () => {
      const sessionId = 1;
      const clubId = 1;
      const mockSession = { id: sessionId, clubId, sessionDate: new Date(Date.now() - 1000) };
      const attendances = [{ studentId: 1, status: 'PRESENT' }];

      mockPrisma.session.findFirst.mockResolvedValue(mockSession);
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null); // Not admin
      mockPrisma.coach.findFirst.mockResolvedValue(null); // Not coach

      const response = await request(app)
        .post(`/api/attendance/session/${sessionId}/bulk`)
        .set('Authorization', 'Bearer token')
        .send({ attendances })
        .expect(403);

      expect(response.body.message).toBe('Access denied');
    });

    it('should return 400 if some students not found', async () => {
      const sessionId = 1;
      const clubId = 1;
      const mockSession = { id: sessionId, clubId, sessionDate: new Date(Date.now() - 1000) };
      const attendances = [{ studentId: 1, status: 'PRESENT' }];
      const mockStudents: any[] = []; // None found

      mockPrisma.session.findFirst.mockResolvedValue(mockSession);
      mockPrisma.student.findMany.mockResolvedValue(mockStudents);
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null); // Not admin
      mockPrisma.coach.findFirst.mockResolvedValue({ id: 1 }); // Is coach

      const response = await request(app)
        .post(`/api/attendance/session/${sessionId}/bulk`)
        .set('Authorization', 'Bearer token')
        .send({ attendances })
        .expect(400);

      expect(response.body.message).toBe('Some students not found in this club');
    });

    it('should return 409 if some already recorded', async () => {
      const sessionId = 1;
      const clubId = 1;
      const mockSession = { id: sessionId, clubId, sessionDate: new Date(Date.now() - 1000) };
      const attendances = [{ studentId: 1, status: 'PRESENT' }];
      const mockStudents = [{ id: 1 }];
      const mockExisting = [{ studentId: 1 }];

      mockPrisma.session.findFirst.mockResolvedValue(mockSession);
      mockPrisma.student.findMany.mockResolvedValue(mockStudents);
      mockPrisma.attendance.findMany.mockResolvedValue(mockExisting);
      mockPrisma.userRoleAssignment.findFirst.mockResolvedValue(null); // Not admin
      mockPrisma.coach.findFirst.mockResolvedValue({ id: 1 }); // Is coach

      const response = await request(app)
        .post(`/api/attendance/session/${sessionId}/bulk`)
        .set('Authorization', 'Bearer token')
        .send({ attendances })
        .expect(409);

      expect(response.body.message).toBe('Some students already have attendance recorded');
    });

    it('should handle internal error', async () => {
      const sessionId = 1;
      const attendances = [{ studentId: 1, status: 'PRESENT' }];

      mockPrisma.session.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .post(`/api/attendance/session/${sessionId}/bulk`)
        .set('Authorization', 'Bearer token')
        .send({ attendances })
        .expect(500);

      expect(response.body.message).toBe('Internal error');
    });
  });
});
