import express from 'express';
import prisma from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [CLUB_ADMIN, COACH, FREELANCER, PARENT, KID]
 *         clubId:
 *           type: integer
 *           nullable: true
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [CLUB_ADMIN, COACH, FREELANCER, PARENT, KID]
 *         clubId:
 *           type: integer
 *           nullable: true
 *         display_name:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, display_name, clubId } = req.body;
    if (!email || !password || !name || !role) return res.status(400).json({ message: 'Email, password, name, and role are required' });

    const hashed = await bcrypt.hash(password, 10);

    const userData: any = {
      email,
      passwordHash: hashed,
      name,
      role: role as any,
      profile: {
        create: {
          displayName: display_name || name,
        }
      }
    };

    // Handle CLUB_ADMIN registration - create a club if not provided
    if (role === 'CLUB_ADMIN' && !clubId) {
      // First create the user
      const user = await prisma.user.create({
        data: userData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          clubId: true,
          profile: {
            select: {
              displayName: true
            }
          },
          createdAt: true,
          updatedAt: true
        }
      });

      // Then create the club with the user's ID
      const club = await prisma.club.create({
        data: {
          name: `${name}'s Club`,
          location: 'To be updated',
          description: 'Club created during registration',
          adminId: user.id
        }
      });

      // Update user with clubId
      await prisma.user.update({
        where: { id: user.id },
        data: { clubId: club.id }
      });

      // Create user role mapping
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

      // Generate JWT token
      const token = jwt.sign({ sub: user.id, clubId: club.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

      // Format user data for frontend
      const formattedUser = {
        id: user.id.toString(),
        email: user.email,
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        role: role.toLowerCase() as 'admin' | 'coach' | 'student', // Convert to frontend expected format
        clubId: club.id.toString(),
        avatar: null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };

      return res.json({ token, user: formattedUser });
    } else if (clubId) {
      const club = await prisma.club.findUnique({
        where: { id: parseInt(clubId) },
        select: { id: true }
      });
      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
      }
      userData.clubId = parseInt(clubId);
    }

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        clubId: true,
        profile: {
          select: {
            displayName: true
          }
        },
        createdAt: true,
        updatedAt: true
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

    // Generate JWT token
    const token = jwt.sign({ sub: user.id, clubId: user.clubId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    // Format user data for frontend
    const formattedUser = {
      id: user.id.toString(),
      email: user.email,
      firstName: user.name.split(' ')[0] || '',
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      role: role.toLowerCase() as 'admin' | 'coach' | 'student', // Convert to frontend expected format
      clubId: user.clubId?.toString(),
      avatar: null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };

    res.json({ token, user: formattedUser });
  } catch (err) {
    console.error(err);
    if ((err as any).code === 'P2002') {
      return res.status(409).json({ message: 'Email already exists' });
    }
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

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
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "logged out"
 */

// Logout (client can just drop token; we optionally support server blacklisting in future)
router.post('/logout', (req, res) => {
  // For JWT, logout on client side; respond 200
  res.json({ message: 'logged out' });
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resetToken:
 *                   type: string
 *                   example: "uuid-token-here"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

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
  }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 example: "uuid-reset-token"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset"
 *       404:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       410:
 *         description: Token expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

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
