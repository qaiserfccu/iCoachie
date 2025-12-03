/**
 * Unit Tests for Lookups Utilities
 * 
 * Tests the caching and lookup functions for roles, statuses, etc.
 * These tests mock Prisma since we want pure unit tests
 */

// Mock the db module first (before any imports)
jest.mock('../../src/db', () => ({
  __esModule: true,
  default: {
    role: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    userStatus: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    sessionStatus: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    attendanceStatus: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    paymentStatus: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    bookingStatus: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

import {
  getRoleIdByCode,
  getAllActiveRoles,
  getUserStatusIdByCode,
  getSessionStatusIdByCode,
  getAttendanceStatusIdByCode,
  getPaymentStatusIdByCode,
  getBookingStatusIdByCode,
  getAllUserStatuses,
  getAllSessionStatuses,
  getAllAttendanceStatuses,
  getAllPaymentStatuses,
  getAllBookingStatuses,
  clearLookupCaches
} from '../../src/utils/lookups';

import prisma from '../../src/db';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Lookups Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearLookupCaches();
  });

  describe('getRoleIdByCode', () => {
    it('should return role ID when role exists', async () => {
      (mockPrisma.role.findUnique as jest.Mock).mockResolvedValue({ id: 8 });

      const result = await getRoleIdByCode('SUPER_ADMIN');

      expect(result).toBe(8);
      expect(mockPrisma.role.findUnique).toHaveBeenCalledWith({
        where: { code: 'SUPER_ADMIN' },
        select: { id: true },
      });
    });

    it('should return null when role does not exist', async () => {
      (mockPrisma.role.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getRoleIdByCode('NONEXISTENT');

      expect(result).toBeNull();
    });

    it('should cache role ID on subsequent calls', async () => {
      (mockPrisma.role.findUnique as jest.Mock).mockResolvedValue({ id: 5 });

      await getRoleIdByCode('COACH');
      await getRoleIdByCode('COACH');

      expect(mockPrisma.role.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should make separate DB calls for different role codes', async () => {
      (mockPrisma.role.findUnique as jest.Mock)
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 });

      await getRoleIdByCode('ADMIN');
      await getRoleIdByCode('COACH');

      expect(mockPrisma.role.findUnique).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAllActiveRoles', () => {
    it('should return all active roles', async () => {
      const mockRoles = [
        { id: 1, code: 'ADMIN', name: 'Admin', description: 'Administrator', scope: 'GLOBAL' },
        { id: 2, code: 'COACH', name: 'Coach', description: 'Coach', scope: 'CLUB' },
      ];
      (mockPrisma.role.findMany as jest.Mock).mockResolvedValue(mockRoles);

      const result = await getAllActiveRoles();

      expect(result).toEqual(mockRoles);
      expect(mockPrisma.role.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          scope: true,
        },
        orderBy: { sortOrder: 'asc' },
      });
    });
  });

  describe('getUserStatusIdByCode', () => {
    it('should return status ID when status exists', async () => {
      (mockPrisma.userStatus.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

      const result = await getUserStatusIdByCode('ACTIVE');

      expect(result).toBe(1);
    });

    it('should return null when status does not exist', async () => {
      (mockPrisma.userStatus.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getUserStatusIdByCode('NONEXISTENT');

      expect(result).toBeNull();
    });

    it('should cache status ID on subsequent calls', async () => {
      (mockPrisma.userStatus.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

      await getUserStatusIdByCode('ACTIVE');
      await getUserStatusIdByCode('ACTIVE');

      expect(mockPrisma.userStatus.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSessionStatusIdByCode', () => {
    it('should return status ID when status exists', async () => {
      (mockPrisma.sessionStatus.findUnique as jest.Mock).mockResolvedValue({ id: 2 });

      const result = await getSessionStatusIdByCode('COMPLETED');

      expect(result).toBe(2);
    });

    it('should return null when status does not exist', async () => {
      (mockPrisma.sessionStatus.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getSessionStatusIdByCode('NONEXISTENT');

      expect(result).toBeNull();
    });

    it('should cache status ID on subsequent calls', async () => {
      (mockPrisma.sessionStatus.findUnique as jest.Mock).mockResolvedValue({ id: 2 });

      await getSessionStatusIdByCode('COMPLETED');
      await getSessionStatusIdByCode('COMPLETED');

      expect(mockPrisma.sessionStatus.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAttendanceStatusIdByCode', () => {
    it('should return status ID when status exists', async () => {
      (mockPrisma.attendanceStatus.findUnique as jest.Mock).mockResolvedValue({ id: 3 });

      const result = await getAttendanceStatusIdByCode('PRESENT');

      expect(result).toBe(3);
    });

    it('should return null when status does not exist', async () => {
      (mockPrisma.attendanceStatus.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getAttendanceStatusIdByCode('NONEXISTENT');

      expect(result).toBeNull();
    });

    it('should cache status ID on subsequent calls', async () => {
      (mockPrisma.attendanceStatus.findUnique as jest.Mock).mockResolvedValue({ id: 3 });

      await getAttendanceStatusIdByCode('PRESENT');
      await getAttendanceStatusIdByCode('PRESENT');

      expect(mockPrisma.attendanceStatus.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPaymentStatusIdByCode', () => {
    it('should return status ID when status exists', async () => {
      (mockPrisma.paymentStatus.findUnique as jest.Mock).mockResolvedValue({ id: 4 });

      const result = await getPaymentStatusIdByCode('PENDING');

      expect(result).toBe(4);
    });

    it('should return null when status does not exist', async () => {
      (mockPrisma.paymentStatus.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getPaymentStatusIdByCode('NONEXISTENT');

      expect(result).toBeNull();
    });

    it('should cache status ID on subsequent calls', async () => {
      (mockPrisma.paymentStatus.findUnique as jest.Mock).mockResolvedValue({ id: 4 });

      await getPaymentStatusIdByCode('PENDING');
      await getPaymentStatusIdByCode('PENDING');

      expect(mockPrisma.paymentStatus.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBookingStatusIdByCode', () => {
    it('should return status ID when status exists', async () => {
      (mockPrisma.bookingStatus.findUnique as jest.Mock).mockResolvedValue({ id: 5 });

      const result = await getBookingStatusIdByCode('CONFIRMED');

      expect(result).toBe(5);
    });

    it('should return null when status does not exist', async () => {
      (mockPrisma.bookingStatus.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getBookingStatusIdByCode('NONEXISTENT');

      expect(result).toBeNull();
    });

    it('should cache status ID on subsequent calls', async () => {
      (mockPrisma.bookingStatus.findUnique as jest.Mock).mockResolvedValue({ id: 5 });

      await getBookingStatusIdByCode('CONFIRMED');
      await getBookingStatusIdByCode('CONFIRMED');

      expect(mockPrisma.bookingStatus.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllUserStatuses', () => {
    it('should return all user statuses', async () => {
      const mockStatuses = [
        { id: 1, code: 'ACTIVE', name: 'Active' },
        { id: 2, code: 'PENDING', name: 'Pending' },
      ];
      (mockPrisma.userStatus.findMany as jest.Mock).mockResolvedValue(mockStatuses);

      const result = await getAllUserStatuses();

      expect(result).toEqual(mockStatuses);
      expect(mockPrisma.userStatus.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        select: { id: true, code: true, name: true },
        orderBy: { sortOrder: 'asc' },
      });
    });
  });

  describe('getAllSessionStatuses', () => {
    it('should return all session statuses', async () => {
      const mockStatuses = [
        { id: 1, code: 'SCHEDULED', name: 'Scheduled' },
        { id: 2, code: 'COMPLETED', name: 'Completed' },
      ];
      (mockPrisma.sessionStatus.findMany as jest.Mock).mockResolvedValue(mockStatuses);

      const result = await getAllSessionStatuses();

      expect(result).toEqual(mockStatuses);
    });
  });

  describe('getAllAttendanceStatuses', () => {
    it('should return all attendance statuses', async () => {
      const mockStatuses = [
        { id: 1, code: 'PRESENT', name: 'Present' },
        { id: 2, code: 'ABSENT', name: 'Absent' },
      ];
      (mockPrisma.attendanceStatus.findMany as jest.Mock).mockResolvedValue(mockStatuses);

      const result = await getAllAttendanceStatuses();

      expect(result).toEqual(mockStatuses);
    });
  });

  describe('getAllPaymentStatuses', () => {
    it('should return all payment statuses', async () => {
      const mockStatuses = [
        { id: 1, code: 'PENDING', name: 'Pending' },
        { id: 2, code: 'COMPLETED', name: 'Completed' },
      ];
      (mockPrisma.paymentStatus.findMany as jest.Mock).mockResolvedValue(mockStatuses);

      const result = await getAllPaymentStatuses();

      expect(result).toEqual(mockStatuses);
    });
  });

  describe('getAllBookingStatuses', () => {
    it('should return all booking statuses', async () => {
      const mockStatuses = [
        { id: 1, code: 'PENDING', name: 'Pending' },
        { id: 2, code: 'CONFIRMED', name: 'Confirmed' },
      ];
      (mockPrisma.bookingStatus.findMany as jest.Mock).mockResolvedValue(mockStatuses);

      const result = await getAllBookingStatuses();

      expect(result).toEqual(mockStatuses);
    });
  });

  describe('clearLookupCaches', () => {
    it('should clear all caches', async () => {
      // Populate caches
      (mockPrisma.role.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrisma.userStatus.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

      await getRoleIdByCode('ADMIN');
      await getUserStatusIdByCode('ACTIVE');

      // Clear caches
      clearLookupCaches();

      // Subsequent calls should hit DB again
      await getRoleIdByCode('ADMIN');
      await getUserStatusIdByCode('ACTIVE');

      expect(mockPrisma.role.findUnique).toHaveBeenCalledTimes(2);
      expect(mockPrisma.userStatus.findUnique).toHaveBeenCalledTimes(2);
    });
  });
});
