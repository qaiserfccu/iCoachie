import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole } from '../middleware/requireRole';

const router = express.Router();

/**
 * @swagger
 * /api/clubs:
 *   get:
 *     summary: Get all clubs
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all clubs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clubs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Club'
 *       403:
 *         description: Access denied
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

// Get all clubs (SuperAdmin only)
router.get('/', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
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
    res.json({ clubs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/clubs/{id}:
 *   get:
 *     summary: Get club by ID
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Club ID
 *     responses:
 *       200:
 *         description: Club details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 club:
 *                   $ref: '#/components/schemas/Club'
 *       400:
 *         description: Invalid club ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Club not found
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

// Get club by ID (accessible to club members or SuperAdmin)
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const currentUserId = req.user!.id;
    const userClubId = req.user!.clubId;

    if (isNaN(clubId)) {
      return res.status(400).json({ message: 'Invalid club ID' });
    }

    // Check if user has access to this club
    const isSuperAdmin = await prisma.userRoleAssignment.findFirst({
      where: {
        userId: currentUserId,
        role: { code: 'SUPER_ADMIN' }
      }
    });

    const hasAccess = isSuperAdmin || userClubId === clubId;

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const club = await prisma.club.findUnique({
      where: { 
        id: clubId,
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
      }
    });

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.json({ club });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/clubs/my:
 *   get:
 *     summary: Get current user's club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user's club details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *       404:
 *         description: No club associated or club not found
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

/**
 * @swagger
 * /api/clubs:
 *   post:
 *     summary: Create a new club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClubRequest'
 *     responses:
 *       200:
 *         description: Club created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Admin user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Club name already exists
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

// Create club (SuperAdmin only)
router.post('/', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
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

/**
 * @swagger
 * /api/clubs/{id}:
 *   put:
 *     summary: Update club details
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Club ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateClubRequest'
 *     responses:
 *       200:
 *         description: Club updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Club not found
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
        role: { code: 'SUPER_ADMIN' }
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

/**
 * @swagger
 * /api/clubs/{id}:
 *   delete:
 *     summary: Soft delete a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Club ID
 *     responses:
 *       200:
 *         description: Club deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       403:
 *         description: Access denied
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

// Soft delete club (SuperAdmin only)
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
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