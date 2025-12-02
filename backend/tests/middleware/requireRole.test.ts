/**
 * Unit Tests for requireRole Middleware (requireRole.ts)
 * 
 * Tests the role requirement middleware that checks user role assignments
 */

import { Request, Response, NextFunction } from 'express';
import { requireRole } from '../../src/middleware/requireRole';
import { AuthRequest } from '../../src/middleware/jwtAuth';

// Mock the Prisma client
jest.mock('../../src/db', () => ({
  __esModule: true,
  default: {
    userRoleAssignment: {
      findFirst: jest.fn(),
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

describe('requireRole Middleware (requireRole.ts)', () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Response;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { user: { id: 1, clubId: 1 } };
    mockRes = mockResponse();
    mockNext = jest.fn();
  });

  it('should return 401 if user is not authenticated', async () => {
    mockReq.user = undefined;

    const middleware = requireRole('Admin');
    await middleware(mockReq as AuthRequest, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Missing user' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next if user has the required role', async () => {
    (mockPrisma.userRoleAssignment.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

    const middleware = requireRole('Admin');
    await middleware(mockReq as AuthRequest, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockPrisma.userRoleAssignment.findFirst).toHaveBeenCalledWith({
      where: {
        userId: 1,
        role: {
          name: 'Admin',
        },
      },
      select: {
        id: true,
      },
    });
  });

  it('should return 403 if user does not have the required role', async () => {
    (mockPrisma.userRoleAssignment.findFirst as jest.Mock).mockResolvedValue(null);

    const middleware = requireRole('SuperAdmin');
    await middleware(mockReq as AuthRequest, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle database errors gracefully', async () => {
    (mockPrisma.userRoleAssignment.findFirst as jest.Mock).mockRejectedValue(
      new Error('Database connection failed')
    );

    const middleware = requireRole('Admin');
    await middleware(mockReq as AuthRequest, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal error' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should check role by name correctly', async () => {
    (mockPrisma.userRoleAssignment.findFirst as jest.Mock).mockResolvedValue({ id: 5 });

    const middleware = requireRole('Coach');
    await middleware(mockReq as AuthRequest, mockRes, mockNext);

    expect(mockPrisma.userRoleAssignment.findFirst).toHaveBeenCalledWith({
      where: {
        userId: 1,
        role: {
          name: 'Coach',
        },
      },
      select: {
        id: true,
      },
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should work with different user IDs', async () => {
    mockReq.user = { id: 42, clubId: 10 };
    (mockPrisma.userRoleAssignment.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

    const middleware = requireRole('Manager');
    await middleware(mockReq as AuthRequest, mockRes, mockNext);

    expect(mockPrisma.userRoleAssignment.findFirst).toHaveBeenCalledWith({
      where: {
        userId: 42,
        role: {
          name: 'Manager',
        },
      },
      select: {
        id: true,
      },
    });
    expect(mockNext).toHaveBeenCalled();
  });
});
