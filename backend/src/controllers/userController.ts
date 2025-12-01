import express from 'express';
import prisma from '../db';
import bcrypt from 'bcrypt';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole } from '../middleware/requireRole';
import { getRoleIdByCode, getUserStatusIdByCode, getAllActiveRoles } from '../utils/lookups';

const router = express.Router();

// Get current user
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            bio: true,
            avatarUrl: true,
            phone: true
          }
        },
        userRoles: {
          select: {
            role: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!user) return res.status(404).json({ message: 'Not found' });

    const roles = user.userRoles.map((ur: any) => ur.role.name);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      },
      profile: user.profile,
      roles
    });
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

    const profile = await prisma.profile.update({
      where: { userId: id },
      data: {
        displayName: display_name,
        bio,
        avatarUrl: avatar_url,
        phone,
        updatedAt: new Date()
      },
      select: {
        displayName: true,
        bio: true,
        avatarUrl: true,
        phone: true
      }
    });

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get roles list
router.get('/roles', async (_, res) => {
  try {
    const roles = await getAllActiveRoles();
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// List users in the club (admin only)
router.get('/users', requireAuth, requireRole('SuperAdmin'), async (req: AuthRequest, res) => {
  try {
    const clubId = req.user!.clubId;
    const users = await prisma.user.findMany({
      where: {
        clubId,
        deletedAt: null
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            bio: true,
            avatarUrl: true,
            phone: true
          }
        },
        userRoles: {
          select: {
            role: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const result = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      profile: user.profile,
      roles: user.userRoles.map((ur: any) => ur.role.name)
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Create user in the club (admin only)
router.post('/users', requireAuth, requireRole('SuperAdmin'), async (req: AuthRequest, res) => {
  try {
    const { email, password, name, role, display_name } = req.body;
    if (!email || !password || !name || !role) return res.status(400).json({ message: 'Email, password, name, and role are required' });

    const clubId = req.user!.clubId;
    const hashed = await bcrypt.hash(password, 10);

    // Get role ID from database
    const roleId = await getRoleIdByCode(role);
    if (!roleId) {
      return res.status(400).json({ message: `Invalid role: ${role}` });
    }

    // Get active status ID
    const activeStatusId = await getUserStatusIdByCode('ACTIVE');

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashed,
        name,
        primaryRoleId: roleId,
        statusId: activeStatusId,
        clubId,
        profile: {
          create: {
            displayName: display_name || name,
          }
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        primaryRole: {
          select: {
            code: true,
            name: true
          }
        }
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

// Update user (admin or self)
router.put('/users/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    // Check if user exists and is in the same club
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { clubId: true, id: true }
    });

    if (!existingUser || existingUser.clubId !== clubId) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only admin or self can update
    const isAdmin = req.user && await prisma.userRoleAssignment.findFirst({
      where: {
        userId: currentUserId,
        role: { name: 'SuperAdmin' }
      }
    });

    if (currentUserId !== userId && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true
      }
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Soft delete user (admin only)
router.delete('/users/:id', requireAuth, requireRole('SuperAdmin'), async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    // Check if user exists and is in the same club
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { clubId: true }
    });

    if (!existingUser || existingUser.clubId !== clubId) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date()
      }
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Assign role to a user (admin only)
router.post('/assign-role', requireAuth, requireRole('SuperAdmin'), async (req: AuthRequest, res) => {
  try {
    const { userId, roleName } = req.body;
    if (!userId || !roleName) return res.status(400).json({ message: 'userId and roleName required' });

    const clubId = req.user!.clubId;

    // Ensure the target user is in the same club
    const targetUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { clubId: true }
    });

    if (!targetUser || targetUser.clubId !== clubId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName }
    });

    await prisma.userRoleAssignment.upsert({
      where: {
        userId_roleId: {
          userId: parseInt(userId),
          roleId: role.id
        }
      },
      update: {},
      create: {
        userId: parseInt(userId),
        roleId: role.id
      }
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

export default router;
