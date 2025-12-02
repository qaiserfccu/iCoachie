/**
 * Unit Tests for JWT Auth Middleware (Card 14)
 * 
 * Tests the JWT authentication middleware
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { requireAuth, AuthRequest } from '../../src/middleware/jwtAuth';

// Use the same secret as the middleware when JWT_SECRET is not set
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Mock response object
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock next function
const mockNext = jest.fn() as NextFunction;

describe('JWT Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requireAuth', () => {
    it('should reject request without authorization header', () => {
      const req = { headers: {} } as AuthRequest;
      const res = mockResponse();

      requireAuth(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing authorization header' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with empty authorization header', () => {
      const req = { headers: { authorization: '' } } as AuthRequest;
      const res = mockResponse();

      requireAuth(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request without Bearer token', () => {
      const req = { headers: { authorization: 'Bearer ' } } as AuthRequest;
      const res = mockResponse();

      requireAuth(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', () => {
      const req = { headers: { authorization: 'Bearer invalid-token' } } as AuthRequest;
      const res = mockResponse();

      requireAuth(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should accept request with valid token and set user', () => {
      const userId = 123;
      const clubId = 456;
      const token = jwt.sign({ sub: userId, clubId }, JWT_SECRET);
      const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
      const res = mockResponse();

      requireAuth(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.user).toEqual({ id: userId, clubId });
    });

    it('should handle token without clubId', () => {
      const userId = 789;
      const token = jwt.sign({ sub: userId }, JWT_SECRET);
      const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
      const res = mockResponse();

      requireAuth(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.user?.id).toBe(userId);
      expect(req.user?.clubId).toBeUndefined();
    });

    it('should reject expired token', () => {
      const token = jwt.sign({ sub: 1, clubId: 1 }, JWT_SECRET, { expiresIn: '-1s' });
      const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
      const res = mockResponse();

      requireAuth(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle malformed authorization header', () => {
      const req = { headers: { authorization: 'NotBearer token123' } } as AuthRequest;
      const res = mockResponse();

      requireAuth(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
