import { Response, NextFunction } from 'express';
import prisma from '../db';
import { AuthRequest } from './jwtAuth';
import { getIsolationContext } from '../types/isolation';

export async function populateContext(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return next();
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        primaryRole: true,
      },
    });

    if (user) {
      req.isolation = getIsolationContext(user);
    }
  } catch (error) {
    console.error('Failed to populate context:', error);
    // We don't block the request here, but isolation might be missing
  }

  next();
}
