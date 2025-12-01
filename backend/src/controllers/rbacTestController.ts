import express from 'express';
import { requireAuth } from '../middleware/jwtAuth';
import { requireRole, requireScope, requirePermission } from '../middleware';

const router = express.Router();

// Simple RBAC smoke tests
router.get('/role', requireAuth, requireRole(['SUPER_ADMIN']), async (_req, res) => {
  res.json({ ok: true, via: 'requireRole SUPER_ADMIN' });
});

router.get('/scope', requireAuth, requireScope('CLUB'), async (_req, res) => {
  res.json({ ok: true, via: 'requireScope CLUB' });
});

router.get('/permission', requireAuth, requirePermission('venue.manage'), async (_req, res) => {
  res.json({ ok: true, via: 'requirePermission venue.manage' });
});

export default router;
