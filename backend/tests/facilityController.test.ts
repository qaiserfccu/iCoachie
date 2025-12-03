import request from 'supertest';
import express from 'express';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

jest.resetModules();

const mockPrisma = {
  facility: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  venue: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  ground: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  venueSchedule: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  groundSchedule: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
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
  requireAuth: jest.fn((req: any, res: any, next: any) => {
    req.user = { id: 1, clubId: 123 };
    next();
  }),
}));

jest.mock('../src/middleware/rbac', () => ({
  requireRole: jest.fn(() => (req: any, res: any, next: any) => next()),
  requireScope: jest.fn(() => (req: any, res: any, next: any) => next()),
  requirePermission: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

import facilityController from '../src/controllers/facilityController';

const app = express();
app.use(express.json());
app.use('/api/facilities', facilityController);

describe('Facility Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /api/facilities', () => {
    it('should create a facility successfully', async () => {
      const facilityData = {
        id: 1,
        name: 'Test Facility',
        location: 'Test Location',
        address: '123 Test St',
        description: 'Test Description',
        amenities: ['parking', 'wifi'],
        clubId: 123,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: null,
      };

      mockPrisma.facility.create.mockResolvedValue(facilityData);

      const response = await request(app)
        .post('/api/facilities')
        .send({
          name: 'Test Facility',
          address: '123 Test St',
          location: 'Test Location',
          description: 'Test Description',
          amenities: ['parking', 'wifi'],
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: 1,
        name: 'Test Facility',
        location: 'Test Location',
        address: '123 Test St',
        description: 'Test Description',
        amenities: ['parking', 'wifi'],
        clubId: 123,
        managerId: null,
        manager: null,
        venueCount: undefined,
        groundCount: undefined,
        createdAt: facilityData.createdAt.toISOString(),
        updatedAt: facilityData.updatedAt.toISOString(),
        deletedAt: null,
      });
      expect(mockPrisma.facility.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Facility',
          address: '123 Test St',
          location: 'Test Location',
          description: 'Test Description',
          amenities: ['parking', 'wifi'],
          managerId: null,
          clubId: 123,
        },
        select: expect.any(Object),
      });
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/facilities')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Name is required');
    });

    it('should return 500 on database error', async () => {
      mockPrisma.facility.create.mockRejectedValue(new Error('DB Error'));

      const response = await request(app)
        .post('/api/facilities')
        .send({ name: 'Test Facility' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal error');
    });
  });

  describe('GET /api/facilities', () => {
    it('should list facilities successfully', async () => {
      const facilities = [{
        id: 1,
        name: 'Test Facility',
        location: 'Test Location',
        address: '123 Test St',
        description: 'Test Description',
        amenities: ['parking'],
        clubId: 123,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: null,
        _count: { venues: 2, grounds: 1 },
      }];

      mockPrisma.facility.findMany.mockResolvedValue(facilities);
      mockPrisma.facility.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/facilities');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pageInfo).toEqual({
        page: 1,
        pageSize: 20,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
      expect(response.body.filtersApplied).toEqual({ search: undefined, includeDeleted: false });
    });

    it('should handle search parameter', async () => {
      mockPrisma.facility.findMany.mockResolvedValue([]);
      mockPrisma.facility.count.mockResolvedValue(0);

      const response = await request(app)
        .get('/api/facilities?search=test');

      expect(response.status).toBe(200);
      expect(mockPrisma.facility.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          OR: [
            { name: { contains: 'test', mode: 'insensitive' } },
            { address: { contains: 'test', mode: 'insensitive' } },
            { location: { contains: 'test', mode: 'insensitive' } },
          ],
        }),
        select: expect.any(Object),
        orderBy: { name: 'asc' },
        skip: 0,
        take: 20,
      });
    });

    it('should handle includeDeleted parameter', async () => {
      mockPrisma.facility.findMany.mockResolvedValue([]);
      mockPrisma.facility.count.mockResolvedValue(0);

      const response = await request(app)
        .get('/api/facilities?includeDeleted=true');

      expect(response.status).toBe(200);
      expect(mockPrisma.facility.findMany).toHaveBeenCalledWith({
        where: { clubId: 123 },
        select: expect.any(Object),
        orderBy: { name: 'asc' },
        skip: 0,
        take: 20,
      });
    });

    it('should handle pagination parameters', async () => {
      mockPrisma.facility.findMany.mockResolvedValue([]);
      mockPrisma.facility.count.mockResolvedValue(50);

      const response = await request(app)
        .get('/api/facilities?page=2&pageSize=10');

      expect(response.status).toBe(200);
      expect(mockPrisma.facility.findMany).toHaveBeenCalledWith({
        where: expect.any(Object),
        select: expect.any(Object),
        orderBy: { name: 'asc' },
        skip: 10,
        take: 10,
      });
      expect(response.body.pageInfo.page).toBe(2);
      expect(response.body.pageInfo.hasPrev).toBe(true);
    });
  });

  describe('GET /api/facilities/:id', () => {
    it('should get facility by ID successfully', async () => {
      const facility = {
        id: 1,
        name: 'Test Facility',
        location: 'Test Location',
        address: '123 Test St',
        description: 'Test Description',
        amenities: ['parking'],
        clubId: 123,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: null,
        _count: { venues: 2, grounds: 1 },
      };

      mockPrisma.facility.findUnique.mockResolvedValue(facility);

      const response = await request(app)
        .get('/api/facilities/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test Facility');
      expect(response.body.venueCount).toBe(2);
      expect(response.body.groundCount).toBe(1);
    });

    it('should return 404 if facility not found', async () => {
      mockPrisma.facility.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/facilities/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Not found');
    });

    it('should return 404 if facility belongs to different club', async () => {
      const facility = {
        id: 1,
        name: 'Test Facility',
        clubId: 456, // Different club
        manager: null,
        _count: { venues: 0, grounds: 0 },
      };

      mockPrisma.facility.findUnique.mockResolvedValue(facility);

      const response = await request(app)
        .get('/api/facilities/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Not found');
    });
  });

  describe('PUT /api/facilities/:id', () => {
    it('should update facility successfully', async () => {
      const existing = { id: 1, clubId: 123, deletedAt: null };
      const updated = {
        id: 1,
        name: 'Updated Facility',
        location: 'Updated Location',
        address: '456 Updated St',
        description: 'Updated Description',
        amenities: ['wifi'],
        clubId: 123,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: null,
        _count: { venues: 1, grounds: 0 },
      };

      mockPrisma.facility.findUnique.mockResolvedValue(existing);
      mockPrisma.facility.update.mockResolvedValue(updated);

      const response = await request(app)
        .put('/api/facilities/1')
        .send({
          name: 'Updated Facility',
          address: '456 Updated St',
          location: 'Updated Location',
          description: 'Updated Description',
          amenities: ['wifi'],
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Facility');
      expect(mockPrisma.facility.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Updated Facility',
          address: '456 Updated St',
          location: 'Updated Location',
          description: 'Updated Description',
          amenities: ['wifi'],
        },
        select: expect.any(Object),
      });
    });

    it('should return 400 if no fields provided', async () => {
      const response = await request(app)
        .put('/api/facilities/1')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('At least one field required');
    });

    it('should return 404 if facility not found', async () => {
      mockPrisma.facility.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/facilities/1')
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Not found');
    });

    it('should return 400 if trying to update deleted facility', async () => {
      const existing = { id: 1, clubId: 123, deletedAt: new Date() };
      mockPrisma.facility.findUnique.mockResolvedValue(existing);

      const response = await request(app)
        .put('/api/facilities/1')
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Cannot update deleted facility');
    });
  });

  describe('DELETE /api/facilities/:id', () => {
    it('should soft delete facility successfully', async () => {
      const existing = { id: 1, clubId: 123, deletedAt: null };
      mockPrisma.facility.findUnique.mockResolvedValue(existing);

      const response = await request(app)
        .delete('/api/facilities/1');

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe('Facility soft deleted');
      expect(mockPrisma.facility.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should return 404 if facility not found', async () => {
      mockPrisma.facility.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/facilities/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Not found');
    });

    it('should return 400 if facility already deleted', async () => {
      const existing = { id: 1, clubId: 123, deletedAt: new Date() };
      mockPrisma.facility.findUnique.mockResolvedValue(existing);

      const response = await request(app)
        .delete('/api/facilities/1');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Already deleted');
    });
  });

  describe('POST /api/facilities/:id/restore', () => {
    it('should restore facility successfully', async () => {
      const existing = { id: 1, clubId: 123, deletedAt: new Date() };
      const restored = {
        id: 1,
        name: 'Restored Facility',
        clubId: 123,
        manager: null,
        _count: { venues: 0, grounds: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.facility.findUnique.mockResolvedValue(existing);
      mockPrisma.facility.update.mockResolvedValue(restored);

      const response = await request(app)
        .post('/api/facilities/1/restore');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Restored Facility');
      expect(response.body.deletedAt).toBe(null);
    });

    it('should return 404 if facility not found', async () => {
      mockPrisma.facility.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/facilities/1/restore');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Not found');
    });

    it('should return 400 if facility is not deleted', async () => {
      const existing = { id: 1, clubId: 123, deletedAt: null };
      mockPrisma.facility.findUnique.mockResolvedValue(existing);

      const response = await request(app)
        .post('/api/facilities/1/restore');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Facility is not deleted');
    });
  });

  describe('PUT /api/facilities/:id/manager', () => {
    it('should assign manager successfully', async () => {
      const existing = { id: 1, clubId: 123, deletedAt: null };
      const manager = { id: 2, clubId: 123 };
      const updated = {
        id: 1,
        name: 'Test Facility',
        clubId: 123,
        managerId: 2,
        manager: { id: 2, name: 'Manager', email: 'manager@test.com' },
        _count: { venues: 0, grounds: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.facility.findUnique.mockResolvedValue(existing);
      mockPrisma.user.findUnique.mockResolvedValue(manager);
      mockPrisma.facility.update.mockResolvedValue(updated);

      const response = await request(app)
        .put('/api/facilities/1/manager')
        .send({ managerId: 2 });

      expect(response.status).toBe(200);
      expect(response.body.managerId).toBe(2);
      expect(response.body.manager.name).toBe('Manager');
    });

    it('should remove manager when managerId is null', async () => {
      const existing = { id: 1, clubId: 123, deletedAt: null };
      const updated = {
        id: 1,
        name: 'Test Facility',
        clubId: 123,
        managerId: null,
        manager: null,
        _count: { venues: 0, grounds: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.facility.findUnique.mockResolvedValue(existing);
      mockPrisma.facility.update.mockResolvedValue(updated);

      const response = await request(app)
        .put('/api/facilities/1/manager')
        .send({ managerId: null });

      expect(response.status).toBe(200);
      expect(response.body.managerId).toBe(null);
      expect(response.body.manager).toBe(null);
    });

    it('should return 400 if managerId not provided', async () => {
      const response = await request(app)
        .put('/api/facilities/1/manager')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('managerId required');
    });

    it('should return 400 if manager belongs to different club', async () => {
      const existing = { id: 1, clubId: 123, deletedAt: null };
      const manager = { id: 2, clubId: 456 }; // Different club

      mockPrisma.facility.findUnique.mockResolvedValue(existing);
      mockPrisma.user.findUnique.mockResolvedValue(manager);

      const response = await request(app)
        .put('/api/facilities/1/manager')
        .send({ managerId: 2 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid manager ID');
    });
  });

  describe('GET /api/facilities/:id/staff', () => {
    it('should list facility staff successfully', async () => {
      const facility = {
        clubId: 123,
        staff: [
          { id: 1, name: 'Staff 1', email: 'staff1@test.com', primaryRole: { code: 'COACH', name: 'Coach' } },
          { id: 2, name: 'Staff 2', email: 'staff2@test.com', primaryRole: { code: 'ADMIN', name: 'Admin' } },
        ],
      };

      mockPrisma.facility.findUnique.mockResolvedValue(facility);

      const response = await request(app)
        .get('/api/facilities/1/staff');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].name).toBe('Staff 1');
    });

    it('should return 404 if facility not found', async () => {
      mockPrisma.facility.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/facilities/1/staff');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Not found');
    });
  });

  describe('POST /api/facilities/:id/staff', () => {
    it('should add staff to facility successfully', async () => {
      const facility = { id: 1, clubId: 123, deletedAt: null };
      const user = { id: 2, clubId: 123 };

      mockPrisma.facility.findUnique.mockResolvedValue(facility);
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/facilities/1/staff')
        .send({ userId: 2 });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe('Staff member assigned');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { facilityId: 1 },
      });
    });

    it('should return 400 if userId not provided', async () => {
      const response = await request(app)
        .post('/api/facilities/1/staff')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('userId required');
    });

    it('should return 400 if user belongs to different club', async () => {
      const facility = { id: 1, clubId: 123, deletedAt: null };
      const user = { id: 2, clubId: 456 };

      mockPrisma.facility.findUnique.mockResolvedValue(facility);
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/facilities/1/staff')
        .send({ userId: 2 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid user ID');
    });
  });

  describe('DELETE /api/facilities/:id/staff/:userId', () => {
    it('should remove staff from facility successfully', async () => {
      const facility = { id: 1, clubId: 123 };
      const user = { id: 2, facilityId: 1 };

      mockPrisma.facility.findUnique.mockResolvedValue(facility);
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const response = await request(app)
        .delete('/api/facilities/1/staff/2');

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe('Staff member removed');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { facilityId: null },
      });
    });

    it('should return 400 if user not assigned to facility', async () => {
      const facility = { id: 1, clubId: 123 };
      const user = { id: 2, facilityId: 3 }; // Assigned to different facility

      mockPrisma.facility.findUnique.mockResolvedValue(facility);
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const response = await request(app)
        .delete('/api/facilities/1/staff/2');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User not assigned to this facility');
    });
  });

  describe('POST /api/facilities/:facilityId/venues', () => {
    it('should create venue successfully', async () => {
      const facility = { id: 1, clubId: 123, deletedAt: null };
      const venue = {
        id: 1,
        name: 'Test Venue',
        venueType: 'indoor',
        capacity: 50,
        hourlyRate: 25.00,
        isAvailable: true,
        amenities: ['lights'],
        facilityId: 1,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: null,
      };

      mockPrisma.facility.findUnique.mockResolvedValue(facility);
      mockPrisma.venue.create.mockResolvedValue(venue);

      const response = await request(app)
        .post('/api/facilities/1/venues')
        .send({
          name: 'Test Venue',
          venueType: 'indoor',
          capacity: 50,
          hourlyRate: 25.00,
          amenities: ['lights'],
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test Venue');
      expect(response.body.type).toBe('indoor');
      expect(response.body.hourlyRate).toBe(25);
    });

    it('should return 400 if name or type missing', async () => {
      const response = await request(app)
        .post('/api/facilities/1/venues')
        .send({ capacity: 50 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Venue name and type required');
    });

    it('should return 404 if facility not found', async () => {
      mockPrisma.facility.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/facilities/1/venues')
        .send({ name: 'Test Venue', venueType: 'indoor' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Facility not found');
    });

    it('should return 400 if facility is deleted', async () => {
      const facility = { id: 1, clubId: 123, deletedAt: new Date() };
      mockPrisma.facility.findUnique.mockResolvedValue(facility);

      const response = await request(app)
        .post('/api/facilities/1/venues')
        .send({ name: 'Test Venue', venueType: 'indoor' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Cannot add venue to deleted facility');
    });
  });

  describe('GET /api/facilities/:facilityId/venues', () => {
    it('should list venues successfully', async () => {
      const facility = { id: 1, clubId: 123 };
      const venues = [{
        id: 1,
        name: 'Test Venue',
        venueType: 'indoor',
        capacity: 50,
        hourlyRate: 25.00,
        isAvailable: true,
        amenities: ['lights'],
        facilityId: 1,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: null,
      }];

      mockPrisma.facility.findUnique.mockResolvedValue(facility);
      mockPrisma.venue.findMany.mockResolvedValue(venues);
      mockPrisma.venue.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/facilities/1/venues');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Test Venue');
    });

    it('should handle available filter', async () => {
      const facility = { id: 1, clubId: 123 };
      mockPrisma.facility.findUnique.mockResolvedValue(facility);
      mockPrisma.venue.findMany.mockResolvedValue([]);
      mockPrisma.venue.count.mockResolvedValue(0);

      const response = await request(app)
        .get('/api/facilities/1/venues?available=true');

      expect(response.status).toBe(200);
      expect(mockPrisma.venue.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({ isAvailable: true }),
        select: expect.any(Object),
        orderBy: { name: 'asc' },
        skip: 0,
        take: 20,
      });
    });
  });

  describe('GET /api/facilities/venues/:id', () => {
    it('should get venue by ID successfully', async () => {
      const venue = {
        id: 1,
        name: 'Test Venue',
        venueType: 'indoor',
        capacity: 50,
        hourlyRate: 25.00,
        isAvailable: true,
        amenities: ['lights'],
        facilityId: 1,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: null,
        facility: { id: 1, name: 'Test Facility', clubId: 123 },
      };

      mockPrisma.venue.findUnique.mockResolvedValue(venue);

      const response = await request(app)
        .get('/api/facilities/venues/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test Venue');
      expect(response.body.facility.name).toBe('Test Facility');
    });

    it('should return 404 if venue not found', async () => {
      mockPrisma.venue.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/facilities/venues/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Not found');
    });
  });

  describe('PUT /api/facilities/venues/:id', () => {
    it('should update venue successfully', async () => {
      const existing = {
        facility: { clubId: 123 },
        deletedAt: null,
      };
      const updated = {
        id: 1,
        name: 'Updated Venue',
        venueType: 'outdoor',
        capacity: 100,
        hourlyRate: 30.00,
        isAvailable: false,
        amenities: ['parking'],
        facilityId: 1,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: null,
      };

      mockPrisma.venue.findUnique.mockResolvedValue(existing);
      mockPrisma.venue.update.mockResolvedValue(updated);

      const response = await request(app)
        .put('/api/facilities/venues/1')
        .send({
          name: 'Updated Venue',
          venueType: 'outdoor',
          capacity: 100,
          hourlyRate: 30.00,
          isAvailable: false,
          amenities: ['parking'],
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Venue');
      expect(response.body.type).toBe('outdoor');
    });

    it('should return 400 if no fields provided', async () => {
      const response = await request(app)
        .put('/api/facilities/venues/1')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('At least one field required');
    });
  });

  describe('DELETE /api/facilities/venues/:id', () => {
    it('should soft delete venue successfully', async () => {
      const existing = {
        facility: { clubId: 123 },
        deletedAt: null,
      };

      mockPrisma.venue.findUnique.mockResolvedValue(existing);

      const response = await request(app)
        .delete('/api/facilities/venues/1');

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe('Venue soft deleted');
    });
  });

  describe('POST /api/facilities/venues/:id/restore', () => {
    it('should restore venue successfully', async () => {
      const existing = {
        facility: { clubId: 123 },
        deletedAt: new Date(),
      };
      const restored = {
        id: 1,
        name: 'Restored Venue',
        venueType: 'indoor',
        capacity: 50,
        hourlyRate: 25.00,
        isAvailable: true,
        amenities: [],
        facilityId: 1,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: null,
      };

      mockPrisma.venue.findUnique.mockResolvedValue(existing);
      mockPrisma.venue.update.mockResolvedValue(restored);

      const response = await request(app)
        .post('/api/facilities/venues/1/restore');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Restored Venue');
      expect(response.body.deletedAt).toBe(null);
    });
  });

  describe('PUT /api/facilities/venues/:id/manager', () => {
    it('should assign venue manager successfully', async () => {
      const existing = {
        facility: { clubId: 123 },
        deletedAt: null,
      };
      const manager = { id: 2, clubId: 123 };
      const updated = {
        id: 1,
        name: 'Test Venue',
        venueType: 'indoor',
        capacity: 50,
        hourlyRate: 25.00,
        isAvailable: true,
        amenities: [],
        facilityId: 1,
        managerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: { id: 2, name: 'Manager', email: 'manager@test.com' },
      };

      mockPrisma.venue.findUnique.mockResolvedValue(existing);
      mockPrisma.user.findUnique.mockResolvedValue(manager);
      mockPrisma.venue.update.mockResolvedValue(updated);

      const response = await request(app)
        .put('/api/facilities/venues/1/manager')
        .send({ managerId: 2 });

      expect(response.status).toBe(200);
      expect(response.body.managerId).toBe(2);
    });
  });

  describe('POST /api/facilities/:facilityId/grounds', () => {
    it('should create ground successfully', async () => {
      const facility = { id: 1, clubId: 123, deletedAt: null };
      const ground = {
        id: 1,
        name: 'Test Ground',
        groundType: 'football',
        surfaceType: 'grass',
        dimensions: '100x60',
        capacity: 100,
        isAvailable: true,
        facilityId: 1,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: null,
      };

      mockPrisma.facility.findUnique.mockResolvedValue(facility);
      mockPrisma.ground.create.mockResolvedValue(ground);

      const response = await request(app)
        .post('/api/facilities/1/grounds')
        .send({
          name: 'Test Ground',
          groundType: 'football',
          surfaceType: 'grass',
          dimensions: '100x60',
          capacity: 100,
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test Ground');
      expect(response.body.type).toBe('football');
      expect(response.body.surface).toBe('grass');
    });

    it('should return 400 if name or type missing', async () => {
      const response = await request(app)
        .post('/api/facilities/1/grounds')
        .send({ capacity: 100 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Ground name and type required');
    });
  });

  describe('GET /api/facilities/:facilityId/grounds', () => {
    it('should list grounds successfully', async () => {
      const facility = { id: 1, clubId: 123 };
      const grounds = [{
        id: 1,
        name: 'Test Ground',
        groundType: 'football',
        surfaceType: 'grass',
        dimensions: '100x60',
        capacity: 100,
        isAvailable: true,
        facilityId: 1,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: null,
      }];

      mockPrisma.facility.findUnique.mockResolvedValue(facility);
      mockPrisma.ground.findMany.mockResolvedValue(grounds);
      mockPrisma.ground.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/facilities/1/grounds');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Test Ground');
    });
  });

  describe('GET /api/facilities/grounds/:id', () => {
    it('should get ground by ID successfully', async () => {
      const ground = {
        id: 1,
        name: 'Test Ground',
        groundType: 'football',
        surfaceType: 'grass',
        dimensions: '100x60',
        capacity: 100,
        isAvailable: true,
        facilityId: 1,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: null,
        facility: { id: 1, name: 'Test Facility', clubId: 123 },
      };

      mockPrisma.ground.findUnique.mockResolvedValue(ground);

      const response = await request(app)
        .get('/api/facilities/grounds/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test Ground');
      expect(response.body.facility.name).toBe('Test Facility');
    });
  });

  describe('PUT /api/facilities/grounds/:id', () => {
    it('should update ground successfully', async () => {
      const existing = {
        facility: { clubId: 123 },
        deletedAt: null,
      };
      const updated = {
        id: 1,
        name: 'Updated Ground',
        groundType: 'basketball',
        surfaceType: 'wood',
        dimensions: '28x15',
        capacity: 200,
        isAvailable: false,
        facilityId: 1,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: null,
      };

      mockPrisma.ground.findUnique.mockResolvedValue(existing);
      mockPrisma.ground.update.mockResolvedValue(updated);

      const response = await request(app)
        .put('/api/facilities/grounds/1')
        .send({
          name: 'Updated Ground',
          groundType: 'basketball',
          surfaceType: 'wood',
          dimensions: '28x15',
          capacity: 200,
          isAvailable: false,
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Ground');
      expect(response.body.type).toBe('basketball');
    });
  });

  describe('DELETE /api/facilities/grounds/:id', () => {
    it('should soft delete ground successfully', async () => {
      const existing = {
        facility: { clubId: 123 },
        deletedAt: null,
      };

      mockPrisma.ground.findUnique.mockResolvedValue(existing);

      const response = await request(app)
        .delete('/api/facilities/grounds/1');

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe('Ground soft deleted');
    });
  });

  describe('POST /api/facilities/grounds/:id/restore', () => {
    it('should restore ground successfully', async () => {
      const existing = {
        facility: { clubId: 123 },
        deletedAt: new Date(),
      };
      const restored = {
        id: 1,
        name: 'Restored Ground',
        groundType: 'football',
        surfaceType: 'grass',
        dimensions: '100x60',
        capacity: 100,
        isAvailable: true,
        facilityId: 1,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: null,
      };

      mockPrisma.ground.findUnique.mockResolvedValue(existing);
      mockPrisma.ground.update.mockResolvedValue(restored);

      const response = await request(app)
        .post('/api/facilities/grounds/1/restore');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Restored Ground');
      expect(response.body.deletedAt).toBe(null);
    });
  });

  describe('PUT /api/facilities/grounds/:id/manager', () => {
    it('should assign ground manager successfully', async () => {
      const existing = {
        facility: { clubId: 123 },
        deletedAt: null,
      };
      const manager = { id: 2, clubId: 123 };
      const updated = {
        id: 1,
        name: 'Test Ground',
        groundType: 'football',
        surfaceType: 'grass',
        dimensions: '100x60',
        capacity: 100,
        isAvailable: true,
        facilityId: 1,
        managerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        manager: { id: 2, name: 'Manager', email: 'manager@test.com' },
      };

      mockPrisma.ground.findUnique.mockResolvedValue(existing);
      mockPrisma.user.findUnique.mockResolvedValue(manager);
      mockPrisma.ground.update.mockResolvedValue(updated);

      const response = await request(app)
        .put('/api/facilities/grounds/1/manager')
        .send({ managerId: 2 });

      expect(response.status).toBe(200);
      expect(response.body.managerId).toBe(2);
    });
  });

  describe('POST /api/facilities/venues/:id/schedule', () => {
    it('should create venue schedule slot successfully', async () => {
      const venue = {
        facility: { clubId: 123 },
        deletedAt: null,
      };
      const schedule = {
        id: 1,
        dayOfWeek: 1,
        specificDate: null,
        startTime: '09:00',
        endTime: '17:00',
        isRecurring: true,
        isBlackout: false,
        notes: 'Regular hours',
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.venue.findUnique.mockResolvedValue(venue);
      mockPrisma.venueSchedule.findMany.mockResolvedValue([]);
      mockPrisma.venueSchedule.create.mockResolvedValue(schedule);

      const response = await request(app)
        .post('/api/facilities/venues/1/schedule')
        .send({
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '17:00',
          isRecurring: true,
          notes: 'Regular hours',
        });

      expect(response.status).toBe(201);
      expect(response.body.dayOfWeek).toBe(1);
      expect(response.body.startTime).toBe('09:00');
      expect(response.body.endTime).toBe('17:00');
    });

    it('should create schedule with specific date', async () => {
      const venue = {
        facility: { clubId: 123 },
        deletedAt: null,
      };
      const schedule = {
        id: 1,
        dayOfWeek: null,
        specificDate: new Date('2024-01-01'),
        startTime: '10:00',
        endTime: '12:00',
        isRecurring: false,
        isBlackout: true,
        notes: 'Special event',
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.venue.findUnique.mockResolvedValue(venue);
      mockPrisma.venueSchedule.findMany.mockResolvedValue([]);
      mockPrisma.venueSchedule.create.mockResolvedValue(schedule);

      const response = await request(app)
        .post('/api/facilities/venues/1/schedule')
        .send({
          specificDate: '2024-01-01',
          startTime: '10:00',
          endTime: '12:00',
          isBlackout: true,
          notes: 'Special event',
        });

      expect(response.status).toBe(201);
      expect(response.body.specificDate).toBeDefined();
      expect(response.body.isBlackout).toBe(true);
    });

    it('should return 400 if startTime or endTime missing', async () => {
      const response = await request(app)
        .post('/api/facilities/venues/1/schedule')
        .send({ dayOfWeek: 1 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('startTime and endTime required');
    });

    it('should return 400 if invalid time format', async () => {
      const venue = {
        facility: { clubId: 123 },
        deletedAt: null,
      };
      mockPrisma.venue.findUnique.mockResolvedValue(venue);

      const response = await request(app)
        .post('/api/facilities/venues/1/schedule')
        .send({
          dayOfWeek: 1,
          startTime: '9:00', // Invalid format
          endTime: '17:00',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Time must be in HH:mm format');
    });

    it('should return 400 if endTime before startTime', async () => {
      const venue = {
        facility: { clubId: 123 },
        deletedAt: null,
      };
      mockPrisma.venue.findUnique.mockResolvedValue(venue);

      const response = await request(app)
        .post('/api/facilities/venues/1/schedule')
        .send({
          dayOfWeek: 1,
          startTime: '17:00',
          endTime: '09:00',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('endTime must be after startTime');
    });

    it('should return 409 if schedule conflict detected', async () => {
      const venue = {
        facility: { clubId: 123 },
        deletedAt: null,
      };
      const existingSchedule = {
        startTime: '08:00',
        endTime: '18:00',
      };

      mockPrisma.venue.findUnique.mockResolvedValue(venue);
      mockPrisma.venueSchedule.findMany.mockResolvedValue([existingSchedule]);

      const response = await request(app)
        .post('/api/facilities/venues/1/schedule')
        .send({
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '17:00',
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Schedule conflict detected');
    });
  });

  describe('GET /api/facilities/venues/:id/schedule', () => {
    it('should list venue schedule slots successfully', async () => {
      const venue = { facility: { clubId: 123 } };
      const schedules = [{
        id: 1,
        dayOfWeek: 1,
        specificDate: null,
        startTime: '09:00',
        endTime: '17:00',
        isRecurring: true,
        isBlackout: false,
        notes: 'Regular hours',
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }];

      mockPrisma.venue.findUnique.mockResolvedValue(venue);
      mockPrisma.venueSchedule.findMany.mockResolvedValue(schedules);

      const response = await request(app)
        .get('/api/facilities/venues/1/schedule');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].startTime).toBe('09:00');
    });

    it('should filter blackouts only', async () => {
      const venue = { facility: { clubId: 123 } };
      mockPrisma.venue.findUnique.mockResolvedValue(venue);
      mockPrisma.venueSchedule.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/facilities/venues/1/schedule?blackouts=true');

      expect(response.status).toBe(200);
      expect(mockPrisma.venueSchedule.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({ isBlackout: true }),
        select: expect.any(Object),
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      });
    });
  });

  describe('PUT /api/facilities/venues/:venueId/schedule/:scheduleId', () => {
    it('should update venue schedule slot successfully', async () => {
      const venue = { facility: { clubId: 123 } };
      const existing = { id: 1, venueId: 1, deletedAt: null };
      const updated = {
        id: 1,
        dayOfWeek: 1,
        specificDate: null,
        startTime: '10:00',
        endTime: '18:00',
        isRecurring: true,
        isBlackout: false,
        notes: 'Updated hours',
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.venue.findUnique.mockResolvedValue(venue);
      mockPrisma.venueSchedule.findUnique.mockResolvedValue(existing);
      mockPrisma.venueSchedule.update.mockResolvedValue(updated);

      const response = await request(app)
        .put('/api/facilities/venues/1/schedule/1')
        .send({
          startTime: '10:00',
          endTime: '18:00',
          notes: 'Updated hours',
        });

      expect(response.status).toBe(200);
      expect(response.body.startTime).toBe('10:00');
      expect(response.body.endTime).toBe('18:00');
    });
  });

  describe('DELETE /api/facilities/venues/:venueId/schedule/:scheduleId', () => {
    it('should soft delete venue schedule slot successfully', async () => {
      const venue = { facility: { clubId: 123 } };
      const existing = { id: 1, venueId: 1, deletedAt: null };

      mockPrisma.venue.findUnique.mockResolvedValue(venue);
      mockPrisma.venueSchedule.findUnique.mockResolvedValue(existing);

      const response = await request(app)
        .delete('/api/facilities/venues/1/schedule/1');

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe('Schedule soft deleted');
    });
  });

  describe('POST /api/facilities/grounds/:id/schedule', () => {
    it('should create ground schedule slot successfully', async () => {
      const ground = {
        facility: { clubId: 123 },
        deletedAt: null,
      };
      const schedule = {
        id: 1,
        dayOfWeek: 2,
        specificDate: null,
        startTime: '08:00',
        endTime: '16:00',
        isRecurring: true,
        isBlackout: false,
        notes: 'Training hours',
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.ground.findUnique.mockResolvedValue(ground);
      mockPrisma.groundSchedule.findMany.mockResolvedValue([]);
      mockPrisma.groundSchedule.create.mockResolvedValue(schedule);

      const response = await request(app)
        .post('/api/facilities/grounds/1/schedule')
        .send({
          dayOfWeek: 2,
          startTime: '08:00',
          endTime: '16:00',
          notes: 'Training hours',
        });

      expect(response.status).toBe(201);
      expect(response.body.dayOfWeek).toBe(2);
      expect(response.body.startTime).toBe('08:00');
    });
  });

  describe('GET /api/facilities/grounds/:id/schedule', () => {
    it('should list ground schedule slots successfully', async () => {
      const ground = { facility: { clubId: 123 } };
      const schedules = [{
        id: 1,
        dayOfWeek: 2,
        specificDate: null,
        startTime: '08:00',
        endTime: '16:00',
        isRecurring: true,
        isBlackout: false,
        notes: 'Training hours',
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }];

      mockPrisma.ground.findUnique.mockResolvedValue(ground);
      mockPrisma.groundSchedule.findMany.mockResolvedValue(schedules);

      const response = await request(app)
        .get('/api/facilities/grounds/1/schedule');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].startTime).toBe('08:00');
    });
  });

  describe('PUT /api/facilities/grounds/:groundId/schedule/:scheduleId', () => {
    it('should update ground schedule slot successfully', async () => {
      const ground = { facility: { clubId: 123 } };
      const existing = { id: 1, groundId: 1, deletedAt: null };
      const updated = {
        id: 1,
        dayOfWeek: 2,
        specificDate: null,
        startTime: '09:00',
        endTime: '17:00',
        isRecurring: true,
        isBlackout: false,
        notes: 'Updated training hours',
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.ground.findUnique.mockResolvedValue(ground);
      mockPrisma.groundSchedule.findUnique.mockResolvedValue(existing);
      mockPrisma.groundSchedule.update.mockResolvedValue(updated);

      const response = await request(app)
        .put('/api/facilities/grounds/1/schedule/1')
        .send({
          startTime: '09:00',
          endTime: '17:00',
          notes: 'Updated training hours',
        });

      expect(response.status).toBe(200);
      expect(response.body.startTime).toBe('09:00');
    });
  });

  describe('DELETE /api/facilities/grounds/:groundId/schedule/:scheduleId', () => {
    it('should soft delete ground schedule slot successfully', async () => {
      const ground = { facility: { clubId: 123 } };
      const existing = { id: 1, groundId: 1, deletedAt: null };

      mockPrisma.ground.findUnique.mockResolvedValue(ground);
      mockPrisma.groundSchedule.findUnique.mockResolvedValue(existing);

      const response = await request(app)
        .delete('/api/facilities/grounds/1/schedule/1');

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe('Schedule soft deleted');
    });
  });
});