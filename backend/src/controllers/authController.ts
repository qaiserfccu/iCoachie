import express from 'express';
import { pool } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, display_name, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const hashed = await bcrypt.hash(password, 10);
    const insertUser = await pool.query('INSERT INTO users (email, password_hash, created_at, updated_at) VALUES ($1, $2, now(), now()) RETURNING id', [email, hashed]);
    const userId = insertUser.rows[0].id;
    // create profile
    await pool.query('INSERT INTO profiles (user_id, display_name, created_at) VALUES ($1, $2, now())', [userId, display_name || '']);

    // create user role mapping
    if (role) {
      // find role id
      const roleQuery = await pool.query('SELECT id FROM roles WHERE name = $1', [role]);
      let roleId;
      if (roleQuery.rowCount === 0) {
        const r = await pool.query('INSERT INTO roles (name) VALUES ($1) RETURNING id', [role]);
        roleId = r.rows[0].id;
      } else {
        roleId = roleQuery.rows[0].id;
      }
      await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [userId, roleId]);
    }

    res.json({ id: userId, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const q = await pool.query('SELECT id, password_hash FROM users WHERE email = $1', [email]);
    if (q.rowCount === 0) return res.status(401).json({ message: 'Invalid credentials' });
    const user = q.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Logout (client can just drop token; we optionally support server blacklisting in future)
router.post('/logout', (req, res) => {
  // For JWT, logout on client side; respond 200
  res.json({ message: 'logged out' });
});

// Forgot password - generate reset token and store
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const q = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (q.rowCount === 0) return res.status(404).json({ message: 'Not found' });
    const userId = q.rows[0].id;
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour
    await pool.query('INSERT INTO password_resets (user_id, token, expires_at, created_at) VALUES ($1, $2, $3, now())', [userId, token, expiresAt]);
    // Send email using real SMTP if configured
    try {
      const { sendPasswordReset } = await import('../services/emailService');
      await sendPasswordReset(email, token);
    } catch (e) {
      console.error('Email service failed or not configured', e);
    }
    res.json({ resetToken: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    const q = await pool.query('SELECT user_id, expires_at FROM password_resets WHERE token = $1', [token]);
    if (q.rowCount === 0) return res.status(404).json({ message: 'Invalid token' });
    const pr = q.rows[0];
    if (new Date(pr.expires_at) < new Date()) return res.status(410).json({ message: 'Token expired' });
    const hashed = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2', [hashed, pr.user_id]);
    // Delete token
    await pool.query('DELETE FROM password_resets WHERE token = $1', [token]);
    res.json({ message: 'Password reset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

export default router;
