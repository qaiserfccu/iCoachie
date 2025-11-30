import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole } from '../middleware/requireRole';

const router = express.Router();

// Get all clubs (SuperAdmin only)
router.get('/', requireAuth, requireRole('SuperAdmin'), async (req: AuthRequest, res) => {
  try {
    const clubs = await prisma.club.findMany({
      where: {
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        location: true,
        description: true,
        logoUrl: true,
        createdAt: true,
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(clubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get current user's club
router.get('/my', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = req.user!.clubId;
    if (!clubId) return res.status(404).json({ message: 'No club associated' });

    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: {
        id: true,
        name: true,
        location: true,
        description: true,
        logoUrl: true,
        createdAt: true,
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Create club (SuperAdmin only)
router.post('/', requireAuth, requireRole('SuperAdmin'), async (req: AuthRequest, res) => {
  try {
    const { name, location, description, logoUrl, adminId } = req.body;
    if (!name || !adminId) return res.status(400).json({ message: 'Name and adminId are required' });

    // Verify admin user exists
    const admin = await prisma.user.findUnique({
      where: { id: parseInt(adminId) },
      select: { id: true }
    });

    if (!admin) return res.status(404).json({ message: 'Admin user not found' });

    const club = await prisma.club.create({
      data: {
        name,
        location,
        description,
        logoUrl,
        adminId: parseInt(adminId)
      },
      select: {
        id: true,
        name: true,
        location: true,
        description: true,
        logoUrl: true,
        createdAt: true
      }
    });

    res.json(club);
  } catch (err) {
    console.error(err);
    if ((err as any).code === 'P2002') {
      return res.status(409).json({ message: 'Club name already exists' });
    }
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update club (admin of the club or SuperAdmin)
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const currentUserId = req.user!.id;
    const userClubId = req.user!.clubId;

    // Check if user is admin of this club or SuperAdmin
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { adminId: true, id: true }
    });

    if (!club) return res.status(404).json({ message: 'Club not found' });

    const isClubAdmin = club.adminId === currentUserId;
    const isSuperAdmin = await prisma.userRoleAssignment.findFirst({
      where: {
        userId: currentUserId,
        role: { name: 'SuperAdmin' }
      }
    });

    if (!isClubAdmin && !isSuperAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, location, description, logoUrl } = req.body;

    const updatedClub = await prisma.club.update({
      where: { id: clubId },
      data: {
        name,
        location,
        description,
        logoUrl,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        location: true,
        description: true,
        logoUrl: true,
        updatedAt: true
      }
    });

    res.json(updatedClub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Soft delete club (SuperAdmin only)
router.delete('/:id', requireAuth, requireRole('SuperAdmin'), async (req: AuthRequest, res) => {
  try {
    const clubId = parseInt(req.params.id);

    await prisma.club.update({
      where: { id: clubId },
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

export default router;