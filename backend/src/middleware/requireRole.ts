import { Request, Response, NextFunction } from 'express';
import { pool } from '../db';
import { AuthRequest } from './jwtAuth';

export function requireRole(roleName: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Missing user' });
      const q = await pool.query('SELECT r.name FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = $1 AND r.name = $2', [userId, roleName]);
      if (q.rowCount === 0) return res.status(403).json({ message: 'Forbidden' });
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal error' });
    }
  };
};
