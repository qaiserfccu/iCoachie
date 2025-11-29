import express from 'express';
import { pool } from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole } from '../middleware/requireRole';

const router = express.Router();

// Get current user
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = req.user!.id;
    const q = await pool.query('SELECT id, email, created_at FROM users WHERE id = $1', [id]);
    if (q.rowCount === 0) return res.status(404).json({ message: 'Not found' });
    const user = q.rows[0];
    const profileQ = await pool.query('SELECT display_name, bio, avatar_url, phone FROM profiles WHERE user_id = $1', [id]);
    const rolesQ = await pool.query('SELECT r.name FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = $1', [id]);
    res.json({ user, profile: profileQ.rows[0], roles: rolesQ.rows.map(r => r.name) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update profile
router.put('/me/profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = req.user!.id;
    const { display_name, bio, avatar_url, phone } = req.body;
    await pool.query('UPDATE profiles SET display_name = $1, bio = $2, avatar_url = $3, phone = $4, updated_at = now() WHERE user_id = $5', [display_name, bio, avatar_url, phone, id]);
    const profileQ = await pool.query('SELECT display_name, bio, avatar_url, phone FROM profiles WHERE user_id = $1', [id]);
    res.json(profileQ.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get roles list
router.get('/roles', async (_, res) => {
  try {
    const q = await pool.query('SELECT id, name FROM roles ORDER BY name');
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Assign role to a user (admin only)
router.post('/assign-role', requireAuth, requireRole('SuperAdmin'), async (req, res) => {
  try {
    const { userId, roleName } = req.body;
    if (!userId || !roleName) return res.status(400).json({ message: 'userId and roleName required' });
    // find or create role
    const r = await pool.query('SELECT id FROM roles WHERE name = $1', [roleName]);
    let roleId;
    if (r.rowCount === 0) {
      const ins = await pool.query('INSERT INTO roles (name) VALUES ($1) RETURNING id', [roleName]);
      roleId = ins.rows[0].id;
    } else roleId = r.rows[0].id;
    await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, roleId]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

export default router;
