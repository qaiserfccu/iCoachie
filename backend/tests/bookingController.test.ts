import request from 'supertest';
import express from 'express';

// Define mockPrisma first
const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
  booking: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  userRoleAssignment: {
    findFirst: jest.fn(),
  },
  coach: {
    findFirst: jest.fn(),
  },
};

// Mock dependencies
jest.mock('@prisma/client', () => ({
  Prisma: {
    validator: jest.fn(() => jest.fn()),
  },
}));

jest.mock('../src/db', () => mockPrisma);

jest.mock('../src/middleware/jwtAuth', () => ({
  requireAuth: jest.fn((req: any, res: any, next: any) => {
    req.user = { id: 1, clubId: 1 };
    next();
  }),
}));

jest.mock('../src/middleware/rbac', () => ({
  requireRole: jest.fn(() => (req: any, res: any, next: any) => next()),
  requirePermission: jest.fn(() => (req: any, res: any, next: any) => next()),
  requireScope: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

jest.mock('../src/server', () => ({
  socketService: {
    sendToUser: jest.fn(),
  },
}));

jest.mock('../src/utils/lookups', () => ({
  getBookingStatusIdByCode: jest.fn(),
}));

jest.resetModules();

// Now import
import bookingRoutes from '../src/controllers/bookingController';
import { socketService } from '../src/server';
import { getBookingStatusIdByCode } from '../src/utils/lookups';
const mockSocketService = socketService as any;
const mockGetBookingStatusIdByCode = getBookingStatusIdByCode as any;

const app = express();
app.use(express.json());
app.use('/api/bookings', bookingRoutes);

describe('Booking Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/bookings', () => {
    it('should create a booking successfully', async () => {
      const freelancerId = 2;
      const clientId = 1;
      const clubId = 1;
      const mockFreelancer = {
        id: freelancerId,
        primaryRole: { code: 'FREELANCER' },
      };
      const mockBooking = {
        id: 1,
        freelancerId,
        clientId,
        sessionDate: new Date().toISOString(),
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        serviceType: 'Training',
        amount: 100,
        notes: 'Test booking',
        statusId: 1,
        freelancer: { id: freelancerId, name: 'Freelancer', email: 'freelancer@test.com' },
        client: { id: clientId, name: 'Client', email: 'client@test.com' },
        status: { code: 'PENDING', name: 'Pending' },
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockFreelancer);
      mockGetBookingStatusIdByCode.mockResolvedValue(1);
      mockPrisma.booking.findFirst.mockResolvedValue(null); // No conflict
      mockPrisma.booking.create.mockResolvedValue(mockBooking);

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', 'Bearer token')
        .send({
          freelancerId,
          sessionDate: new Date().toISOString(),
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          serviceType: 'Training',
          amount: 100,
          notes: 'Test booking',
        })
        .expect(201);

      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: freelancerId,
          clubId,
          deletedAt: null,
        },
        select: {
          id: true,
          primaryRole: {
            select: {
              code: true
            }
          }
        }
      });
      expect(mockPrisma.booking.create).toHaveBeenCalled();
      expect(response.body).toEqual({
        success: true,
        data: mockBooking,
      });
    });

    it('should return 404 if freelancer not found', async () => {
      const freelancerId = 2;

      mockPrisma.user.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', 'Bearer token')
        .send({
          freelancerId,
          sessionDate: new Date().toISOString(),
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          serviceType: 'Training',
        })
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Freelancer not found or not in your club',
      });
    });

    it('should return 400 if booking self', async () => {
      const freelancerId = 1; // Same as clientId
      const mockFreelancer = {
        id: freelancerId,
        primaryRole: { code: 'FREELANCER' },
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockFreelancer);

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', 'Bearer token')
        .send({
          freelancerId,
          sessionDate: new Date().toISOString(),
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          serviceType: 'Training',
        })
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Cannot book yourself',
      });
    });

    it('should return 409 if scheduling conflict', async () => {
      const freelancerId = 2;
      const mockFreelancer = {
        id: freelancerId,
        primaryRole: { code: 'FREELANCER' },
      };
      const mockConflict = { id: 1 };

      mockPrisma.user.findFirst.mockResolvedValue(mockFreelancer);
      mockGetBookingStatusIdByCode.mockResolvedValue(1);
      mockPrisma.booking.findFirst.mockResolvedValue(mockConflict);

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', 'Bearer token')
        .send({
          freelancerId,
          sessionDate: new Date().toISOString(),
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          serviceType: 'Training',
        })
        .expect(409);

      expect(response.body).toEqual({
        success: false,
        error: 'Freelancer is not available at this time',
      });
    });

    it('should handle internal error', async () => {
      mockPrisma.user.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', 'Bearer token')
        .send({
          freelancerId: 2,
          sessionDate: new Date().toISOString(),
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          serviceType: 'Training',
        })
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('GET /api/bookings', () => {
    it('should return bookings for user', async () => {
      const mockBookings = [
        {
          id: 1,
          freelancer: { id: 2, name: 'Freelancer', email: 'freelancer@test.com' },
          client: { id: 1, name: 'Client', email: 'client@test.com' },
          status: { code: 'PENDING', name: 'Pending' },
          reviews: [],
        },
      ];

      mockPrisma.booking.findMany.mockResolvedValue(mockBookings);
      mockPrisma.booking.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', 'Bearer token')
        .expect(200);

      expect(mockPrisma.booking.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          OR: [
            { clientId: 1 },
            { freelancerId: 1 },
          ],
        },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
      expect(response.body).toEqual({
        success: true,
        data: {
          bookings: mockBookings,
          pagination: {
            page: 1,
            limit: 20,
            total: 1,
            pages: 1,
          },
        },
      });
    });

    it('should filter by type as_client', async () => {
      const mockBookings: any[] = [];

      mockPrisma.booking.findMany.mockResolvedValue(mockBookings);
      mockPrisma.booking.count.mockResolvedValue(0);

      const response = await request(app)
        .get('/api/bookings?type=as_client')
        .set('Authorization', 'Bearer token')
        .expect(200);

      expect(mockPrisma.booking.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          clientId: 1,
        },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
      expect(response.body.success).toBe(true);
    });

    it('should handle pagination', async () => {
      const mockBookings: any[] = [];

      mockPrisma.booking.findMany.mockResolvedValue(mockBookings);
      mockPrisma.booking.count.mockResolvedValue(0);

      const response = await request(app)
        .get('/api/bookings?page=2&limit=10')
        .set('Authorization', 'Bearer token')
        .expect(200);

      expect(mockPrisma.booking.findMany).toHaveBeenCalledWith({
        where: expect.any(Object),
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
        skip: 10,
        take: 10,
      });
      expect(response.body.data.pagination.page).toBe(2);
    });

    it('should handle internal error', async () => {
      mockPrisma.booking.findMany.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', 'Bearer token')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('GET /api/bookings/:id', () => {
    it('should return specific booking', async () => {
      const bookingId = 1;
      const mockBooking = {
        id: bookingId,
        freelancer: { id: 2, name: 'Freelancer', email: 'freelancer@test.com' },
        client: { id: 1, name: 'Client', email: 'client@test.com' },
        reviews: [],
      };

      mockPrisma.booking.findFirst.mockResolvedValue(mockBooking);

      const response = await request(app)
        .get(`/api/bookings/${bookingId}`)
        .set('Authorization', 'Bearer token')
        .expect(200);

      expect(mockPrisma.booking.findFirst).toHaveBeenCalledWith({
        where: {
          id: bookingId,
          OR: [
            { clientId: 1 },
            { freelancerId: 1 },
          ],
          deletedAt: null,
        },
        include: expect.any(Object),
      });
      expect(response.body).toEqual({
        success: true,
        data: mockBooking,
      });
    });

    it('should return 404 if booking not found', async () => {
      const bookingId = 1;

      mockPrisma.booking.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/bookings/${bookingId}`)
        .set('Authorization', 'Bearer token')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Booking not found',
      });
    });

    it('should handle internal error', async () => {
      const bookingId = 1;

      mockPrisma.booking.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .get(`/api/bookings/${bookingId}`)
        .set('Authorization', 'Bearer token')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('PATCH /api/bookings/:id/status', () => {
    it('should update booking status', async () => {
      const bookingId = 1;
      const mockBooking = {
        id: bookingId,
        freelancerId: 1, // User is the freelancer
        clientId: 2,
        status: { code: 'PENDING' },
      };
      const mockUpdatedBooking = {
        id: bookingId,
        freelancer: { id: 1, name: 'Freelancer', email: 'freelancer@test.com' },
        client: { id: 2, name: 'Client', email: 'client@test.com' },
        status: { code: 'CONFIRMED', name: 'Confirmed' },
      };

      mockPrisma.booking.findFirst.mockResolvedValue(mockBooking);
      mockGetBookingStatusIdByCode.mockResolvedValue(2);
      mockPrisma.booking.update.mockResolvedValue(mockUpdatedBooking);

      const response = await request(app)
        .patch(`/api/bookings/${bookingId}/status`)
        .set('Authorization', 'Bearer token')
        .send({ status: 'CONFIRMED' })
        .expect(200);

      expect(mockPrisma.booking.update).toHaveBeenCalledWith({
        where: { id: bookingId },
        data: { statusId: 2 },
        include: expect.any(Object),
      });
      expect(mockSocketService.sendToUser).toHaveBeenCalledWith(1, 'booking-updated', mockUpdatedBooking);
      expect(mockSocketService.sendToUser).toHaveBeenCalledWith(2, 'booking-updated', mockUpdatedBooking);
      expect(response.body).toEqual({
        success: true,
        data: mockUpdatedBooking,
      });
    });

    it('should return 404 if booking not found', async () => {
      const bookingId = 1;

      mockPrisma.booking.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .patch(`/api/bookings/${bookingId}/status`)
        .set('Authorization', 'Bearer token')
        .send({ status: 'CONFIRMED' })
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Booking not found',
      });
    });

    it('should return 400 for invalid status', async () => {
      const bookingId = 1;
      const mockBooking = {
        id: bookingId,
        freelancerId: 2,
        clientId: 1,
        status: { code: 'PENDING' },
      };

      mockPrisma.booking.findFirst.mockResolvedValue(mockBooking);
      mockGetBookingStatusIdByCode.mockResolvedValue(null);

      const response = await request(app)
        .patch(`/api/bookings/${bookingId}/status`)
        .set('Authorization', 'Bearer token')
        .send({ status: 'INVALID' })
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: `Invalid status: INVALID`,
      });
    });

    it('should return 403 if only freelancer can confirm', async () => {
      const bookingId = 1;
      const mockBooking = {
        id: bookingId,
        freelancerId: 2, // Different freelancer
        clientId: 1, // User is client
        status: { code: 'PENDING' },
      };

      mockPrisma.booking.findFirst.mockResolvedValue(mockBooking);
      mockGetBookingStatusIdByCode.mockResolvedValue(2);

      const response = await request(app)
        .patch(`/api/bookings/${bookingId}/status`)
        .set('Authorization', 'Bearer token')
        .send({ status: 'CONFIRMED' })
        .expect(403);

      expect(response.body).toEqual({
        success: false,
        error: 'Only the freelancer can confirm this booking',
      });
    });

    it('should handle internal error', async () => {
      const bookingId = 1;

      mockPrisma.booking.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .patch(`/api/bookings/${bookingId}/status`)
        .set('Authorization', 'Bearer token')
        .send({ status: 'CONFIRMED' })
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('PATCH /api/bookings/:id/cancel', () => {
    it('should cancel booking', async () => {
      const bookingId = 1;
      const mockBooking = {
        id: bookingId,
        freelancerId: 2,
        clientId: 1,
        startTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
        status: { code: 'PENDING' },
      };
      const mockUpdatedBooking = {
        id: bookingId,
        freelancer: { id: 2, name: 'Freelancer', email: 'freelancer@test.com' },
        client: { id: 1, name: 'Client', email: 'client@test.com' },
        status: { code: 'CANCELLED', name: 'Cancelled' },
      };

      mockPrisma.booking.findFirst.mockResolvedValue(mockBooking);
      mockGetBookingStatusIdByCode.mockResolvedValue(3);
      mockPrisma.booking.update.mockResolvedValue(mockUpdatedBooking);

      const response = await request(app)
        .patch(`/api/bookings/${bookingId}/cancel`)
        .set('Authorization', 'Bearer token')
        .expect(200);

      expect(mockPrisma.booking.update).toHaveBeenCalledWith({
        where: { id: bookingId },
        data: { statusId: 3 },
        include: expect.any(Object),
      });
      expect(mockSocketService.sendToUser).toHaveBeenCalledTimes(2);
      expect(response.body).toEqual({
        success: true,
        data: mockUpdatedBooking,
      });
    });

    it('should return 404 if booking not found', async () => {
      const bookingId = 1;

      mockPrisma.booking.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .patch(`/api/bookings/${bookingId}/cancel`)
        .set('Authorization', 'Bearer token')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Booking not found',
      });
    });

    it('should return 400 if booking starts within 24 hours', async () => {
      const bookingId = 1;
      const mockBooking = {
        id: bookingId,
        freelancerId: 2,
        clientId: 1,
        startTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
        status: { code: 'PENDING' },
      };

      mockPrisma.booking.findFirst.mockResolvedValue(mockBooking);

      const response = await request(app)
        .patch(`/api/bookings/${bookingId}/cancel`)
        .set('Authorization', 'Bearer token')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Cannot cancel booking less than 24 hours before start time',
      });
    });

    it('should handle internal error', async () => {
      const bookingId = 1;

      mockPrisma.booking.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .patch(`/api/bookings/${bookingId}/cancel`)
        .set('Authorization', 'Bearer token')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('GET /api/bookings/freelancers/available', () => {
    it('should return available freelancers', async () => {
      const date = '2024-01-01';
      const startTime = '10:00';
      const endTime = '11:00';
      const mockFreelancers = [
        { id: 2, name: 'Freelancer 1', email: 'freelancer1@test.com' },
        { id: 3, name: 'Freelancer 2', email: 'freelancer2@test.com' },
      ];

      mockGetBookingStatusIdByCode.mockResolvedValue(1);
      mockPrisma.user.findMany.mockResolvedValue(mockFreelancers);

      const response = await request(app)
        .get(`/api/bookings/freelancers/available?date=${date}&startTime=${startTime}&endTime=${endTime}`)
        .set('Authorization', 'Bearer token')
        .expect(200);

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: expect.any(Object),
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      expect(response.body).toEqual({
        success: true,
        data: mockFreelancers,
      });
    });

    it('should return 400 if required params missing', async () => {
      const response = await request(app)
        .get('/api/bookings/freelancers/available')
        .set('Authorization', 'Bearer token')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Date, start time, and end time are required',
      });
    });

    it('should handle internal error', async () => {
      mockGetBookingStatusIdByCode.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .get('/api/bookings/freelancers/available?date=2024-01-01&startTime=10:00&endTime=11:00')
        .set('Authorization', 'Bearer token')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('POST /api/bookings/:id/restore', () => {
    it('should restore booking', async () => {
      const bookingId = 1;
      const mockExisting = {
        id: bookingId,
        deletedAt: new Date().toISOString(),
        freelancerId: 2,
        clientId: 1,
      };
      const mockRestored = {
        id: bookingId,
        freelancer: { id: 2, name: 'Freelancer', email: 'freelancer@test.com' },
        client: { id: 1, name: 'Client', email: 'client@test.com' },
        status: { code: 'PENDING', name: 'Pending' },
      };

      mockPrisma.booking.findFirst.mockResolvedValue(mockExisting);
      mockPrisma.booking.update.mockResolvedValue(mockRestored);

      const response = await request(app)
        .post(`/api/bookings/${bookingId}/restore`)
        .set('Authorization', 'Bearer token')
        .expect(200);

      expect(mockPrisma.booking.update).toHaveBeenCalledWith({
        where: { id: bookingId },
        data: { deletedAt: null },
        include: expect.any(Object),
      });
      expect(response.body).toEqual({
        success: true,
        data: mockRestored,
      });
    });

    it('should return 404 if booking not found', async () => {
      const bookingId = 1;

      mockPrisma.booking.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post(`/api/bookings/${bookingId}/restore`)
        .set('Authorization', 'Bearer token')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Booking not found',
      });
    });

    it('should return 400 if not deleted', async () => {
      const bookingId = 1;
      const mockExisting = {
        id: bookingId,
        deletedAt: null,
        freelancerId: 2,
        clientId: 1,
      };

      mockPrisma.booking.findFirst.mockResolvedValue(mockExisting);

      const response = await request(app)
        .post(`/api/bookings/${bookingId}/restore`)
        .set('Authorization', 'Bearer token')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Booking is not deleted',
      });
    });

    it('should handle internal error', async () => {
      const bookingId = 1;

      mockPrisma.booking.findFirst.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .post(`/api/bookings/${bookingId}/restore`)
        .set('Authorization', 'Bearer token')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
      });
    });
  });
});