import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole } from '../middleware/requireRole';

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
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    res.json(roles);
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

    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName }
    });

    await prisma.userRoleAssignment.upsert({
      where: {
        userId_roleId: {
          userId: userId,
          roleId: role.id
        }
      },
      update: {},
      create: {
        userId: userId,
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
