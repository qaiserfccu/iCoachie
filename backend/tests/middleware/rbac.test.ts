/**
 * Unit Tests for RBAC Middleware
 * 
 * Tests the role-based access control middleware functions
 */

import { Request, Response, NextFunction } from 'express';
import { requireRole, requireAnyRole, requirePermission, requireScope } from '../../src/middleware/rbac';
import { AuthRequest } from '../../src/middleware/jwtAuth';

// Mock the Prisma client
jest.mock('../../src/db', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

import prisma from '../../src/db';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Mock response object
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('RBAC Middleware', () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Response;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { user: { id: 1, clubId: 1 } };
    mockRes = mockResponse();
    mockNext = jest.fn();
  });

  describe('requireRole', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockReq.user = undefined;

      const middleware = requireRole('ADMIN');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if user is not found', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const middleware = requireRole('ADMIN');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should call next if user has the required role as primary', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: { code: 'ADMIN', name: 'Admin', scope: 'GLOBAL', permissions: {} },
        userRoles: [],
      });

      const middleware = requireRole('ADMIN');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should call next if user has the required role in userRoles', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: { code: 'USER', name: 'User', scope: 'USER', permissions: {} },
        userRoles: [{ role: { code: 'ADMIN', name: 'Admin' } }],
      });

      const middleware = requireRole('ADMIN');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 if user does not have the required role', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: { code: 'USER', name: 'User', scope: 'USER', permissions: {} },
        userRoles: [],
      });

      const middleware = requireRole('ADMIN');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    });

    it('should accept array of roles', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: { code: 'COACH', name: 'Coach', scope: 'CLUB', permissions: {} },
        userRoles: [],
      });

      const middleware = requireRole(['ADMIN', 'COACH']);
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));

      const middleware = requireRole('ADMIN');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal error' });
    });
  });

  describe('requireAnyRole', () => {
    it('should call next if user has any of the required roles', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: { code: 'COACH', name: 'Coach', scope: 'CLUB', permissions: {} },
        userRoles: [],
      });

      const middleware = requireAnyRole(['ADMIN', 'COACH', 'MANAGER']);
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 if user has none of the required roles', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: { code: 'USER', name: 'User', scope: 'USER', permissions: {} },
        userRoles: [],
      });

      const middleware = requireAnyRole(['ADMIN', 'COACH']);
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });

  describe('requirePermission', () => {
    it('should call next if user has the required permission', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: {
          code: 'ADMIN',
          name: 'Admin',
          scope: 'GLOBAL',
          permissions: { manageUsers: true },
        },
        userRoles: [],
      });

      const middleware = requirePermission('manageUsers');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 401 if user has no primary role', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: null,
        userRoles: [],
      });

      const middleware = requirePermission('manageUsers');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should return 403 if user does not have the required permission', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: {
          code: 'USER',
          name: 'User',
          scope: 'USER',
          permissions: { viewProfile: true },
        },
        userRoles: [],
      });

      const middleware = requirePermission('manageUsers');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it('should handle nested permissions object', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: {
          code: 'ADMIN',
          name: 'Admin',
          scope: 'GLOBAL',
          permissions: { venue: { manage: true } },
        },
        userRoles: [],
      });

      const middleware = requirePermission('venue.manage');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle permissions as array', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: {
          code: 'ADMIN',
          name: 'Admin',
          scope: 'GLOBAL',
          permissions: ['manageUsers', 'viewReports'],
        },
        userRoles: [],
      });

      const middleware = requirePermission('manageUsers');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle permissions as JSON string', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: {
          code: 'ADMIN',
          name: 'Admin',
          scope: 'GLOBAL',
          permissions: JSON.stringify({ manageUsers: true }),
        },
        userRoles: [],
      });

      const middleware = requirePermission('manageUsers');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle wildcard permissions', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: {
          code: 'ADMIN',
          name: 'Admin',
          scope: 'GLOBAL',
          permissions: { '*': true },
        },
        userRoles: [],
      });

      const middleware = requirePermission('anyPermission');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle wildcard permissions with a prefix', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: {
          code: 'MANAGER',
          name: 'Manager',
          scope: 'CLUB',
          permissions: { 'venue.manage.*': true },
        },
        userRoles: [],
      });

      const middleware = requirePermission('venue.manage.settings');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('requireScope', () => {
    it('should call next if user has the required scope', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: { code: 'ADMIN', name: 'Admin', scope: 'GLOBAL', permissions: {} },
        userRoles: [],
      });

      const middleware = requireScope('CLUB');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow higher scope to access lower scope requirements', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: { code: 'ADMIN', name: 'Admin', scope: 'GLOBAL', permissions: {} },
        userRoles: [],
      });

      const middleware = requireScope('USER');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 if user scope is lower than required', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: { code: 'USER', name: 'User', scope: 'USER', permissions: {} },
        userRoles: [],
      });

      const middleware = requireScope('GLOBAL');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it('should return 403 if user has no scope', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: { code: 'USER', name: 'User', scope: null, permissions: {} },
        userRoles: [],
      });

      const middleware = requireScope('CLUB');
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it('should accept array of scopes', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        primaryRole: { code: 'MANAGER', name: 'Manager', scope: 'FACILITY', permissions: {} },
        userRoles: [],
      });

      const middleware = requireScope(['VENUE', 'FACILITY']);
      await middleware(mockReq as AuthRequest, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
