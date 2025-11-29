import { Request, Response, NextFunction } from 'express';
import prisma from '../db';
import { AuthRequest } from './jwtAuth';

export function requireRole(roleName: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Missing user' });

      const userRole = await prisma.userRoleAssignment.findFirst({
        where: {
          userId: userId,
          role: {
            name: roleName
          }
        },
        select: {
          id: true
        }
      });

      if (!userRole) return res.status(403).json({ message: 'Forbidden' });
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal error' });
    }
  };
};
