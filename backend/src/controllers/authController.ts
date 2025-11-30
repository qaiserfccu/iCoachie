import express from 'express';
import prisma from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, display_name, clubId } = req.body;
    if (!email || !password || !name || !role || !clubId) return res.status(400).json({ message: 'Email, password, name, role, and clubId are required' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashed,
        name,
        role: 'CLUB_ADMIN', // Default user type
        clubId: parseInt(clubId),
        profile: {
          create: {
            displayName: display_name || name,
          }
        }
      },
      select: {
        id: true,
        email: true,
      }
    });

    // create user role mapping
    const roleRecord = await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role }
    });

    await prisma.userRoleAssignment.create({
      data: {
        userId: user.id,
        roleId: roleRecord.id
      }
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    if ((err as any).code === 'P2002') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Internal error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        passwordHash: true,
        clubId: true
      }
    });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ sub: user.id, clubId: user.clubId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
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
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (!user) return res.status(404).json({ message: 'Not found' });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt: expiresAt
      }
    });

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
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      select: {
        userId: true,
        expiresAt: true
      }
    });

    if (!resetRecord) return res.status(404).json({ message: 'Invalid token' });

    if (new Date(resetRecord.expiresAt) < new Date()) {
      return res.status(410).json({ message: 'Token expired' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: {
        passwordHash: hashed,
        updatedAt: new Date()
      }
    });

    // Delete token
    await prisma.passwordReset.delete({
      where: { token }
    });

    res.json({ message: 'Password reset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

export default router;
