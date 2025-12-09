import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IsolationContext } from '../types/isolation';

export interface AuthRequest extends Request {
  user?: { id: number; clubId: number };
  isolation?: IsolationContext;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Missing authorization header' });
  const [, token] = header.split(' ');
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    req.user = { id: payload.sub, clubId: payload.clubId };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
