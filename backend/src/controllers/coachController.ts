import express from 'express';
import prisma from '../db';
import bcrypt from 'bcrypt';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole } from '../middleware/requireRole';

const router = express.Router();

// Get all coaches in the club
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = req.user!.clubId;

    // Get coaches with their user data and calculate stats
    const coaches = await prisma.coach.findMany({
      where: {
        clubId,
        deletedAt: null,
        user: {
          deletedAt: null,
          status: 'ACTIVE'
        }
      },
      include: {
        user: {
          include: {
            profile: true,
            reviewsReceived: {
              select: {
                rating: true
              }
            },
            coachedStudents: {
              where: {
                deletedAt: null
              },
              select: {
                id: true
              }
            },
            coachedSessions: {
              where: {
                deletedAt: null,
                status: {
                  in: ['SCHEDULED', 'COMPLETED']
                }
              },
              select: {
                id: true
              }
            }
          }
        }
      }
    });

    const result = coaches.map(coach => {
      const user = coach.user;
      const reviews = user.reviewsReceived;
      const rating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

      return {
        id: coach.id,
        userId: user.id,
        name: user.name,
        email: user.email,
        avatar: user.profile?.avatarUrl,
        phone: user.profile?.phone,
        specialty: coach.specializations,
        rating: Math.round(rating * 10) / 10, // Round to 1 decimal
        students: user.coachedStudents.length,
        sessions: user.coachedSessions.length,
        status: user.status === 'ACTIVE' ? 'Active' : 'Inactive',
        experienceYears: coach.experienceYears,
        certification: coach.certification,
        hourlyRate: coach.hourlyRate ? parseFloat(coach.hourlyRate.toString()) : undefined
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get coach by ID
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const coachId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    const coach = await prisma.coach.findFirst({
      where: {
        id: coachId,
        clubId,
        deletedAt: null
      },
      include: {
        user: {
          include: {
            profile: true,
            reviewsReceived: {
              select: {
                rating: true,
                comment: true,
                createdAt: true,
                reviewer: {
                  select: {
                    name: true
                  }
                }
              }
            },
            coachedStudents: {
              where: {
                deletedAt: null
              },
              select: {
                id: true,
                name: true,
                sport: true
              }
            },
            coachedSessions: {
              where: {
                deletedAt: null
              },
              select: {
                id: true,
                title: true,
                sessionDate: true,
                status: true
              }
            }
          }
        }
      }
    });

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    const user = coach.user;
    const reviews = user.reviewsReceived;
    const rating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    const result = {
      id: coach.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      avatar: user.profile?.avatarUrl,
      phone: user.profile?.phone,
      specialty: coach.specializations,
      rating: Math.round(rating * 10) / 10,
      students: user.coachedStudents.length,
      sessions: user.coachedSessions.length,
      status: user.status === 'ACTIVE' ? 'Active' : 'Inactive',
      experienceYears: coach.experienceYears,
      certification: coach.certification,
      hourlyRate: coach.hourlyRate ? parseFloat(coach.hourlyRate.toString()) : undefined,
      reviews: reviews.map(review => ({
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        reviewer: review.reviewer.name
      })),
      studentsList: user.coachedStudents,
      sessionsList: user.coachedSessions
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Create coach
router.post('/', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
  try {
    const {
      email,
      password,
      name,
      specializations,
      experienceYears,
      certification,
      hourlyRate
    } = req.body;

    if (!email || !password || !name || !specializations) {
      return res.status(400).json({ message: 'Email, password, name, and specializations are required' });
    }

    const clubId = req.user!.clubId;
    const hashed = await bcrypt.hash(password, 10);

    // Create user first
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashed,
        name,
        role: 'COACH',
        clubId,
        profile: {
          create: {
            displayName: name,
          }
        }
      }
    });

    // Create coach profile
    const coach = await prisma.coach.create({
      data: {
        userId: user.id,
        clubId,
        specializations,
        experienceYears,
        certification,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    // Assign coach role
    const role = await prisma.role.upsert({
      where: { name: 'Coach' },
      update: {},
      create: { name: 'Coach' }
    });

    await prisma.userRoleAssignment.create({
      data: {
        userId: user.id,
        roleId: role.id
      }
    });

    const result = {
      id: coach.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      avatar: coach.user.profile?.avatarUrl,
      phone: coach.user.profile?.phone,
      specialty: coach.specializations,
      rating: 0,
      students: 0,
      sessions: 0,
      status: 'Active',
      experienceYears: coach.experienceYears,
      certification: coach.certification,
      hourlyRate: coach.hourlyRate ? parseFloat(coach.hourlyRate.toString()) : undefined
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    if ((err as any).code === 'P2002') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update coach
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const coachId = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    // Check if coach exists and is in the same club
    const existingCoach = await prisma.coach.findFirst({
      where: {
        id: coachId,
        clubId,
        deletedAt: null
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    if (!existingCoach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    // Only admin or self can update
    const isAdmin = req.user && await prisma.userRoleAssignment.findFirst({
      where: {
        userId: currentUserId,
        role: { name: 'SuperAdmin' }
      }
    });

    if (currentUserId !== existingCoach.user.id && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      name,
      email,
      specializations,
      experienceYears,
      certification,
      hourlyRate
    } = req.body;

    // Update user data
    if (name || email) {
      await prisma.user.update({
        where: { id: existingCoach.user.id },
        data: {
          name,
          email,
          updatedAt: new Date()
        }
      });
    }

    // Update coach profile
    const updatedCoach = await prisma.coach.update({
      where: { id: coachId },
      data: {
        specializations,
        experienceYears,
        certification,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        updatedAt: new Date()
      },
      include: {
        user: {
          include: {
            profile: true,
            reviewsReceived: {
              select: {
                rating: true
              }
            },
            coachedStudents: {
              where: {
                deletedAt: null
              },
              select: {
                id: true
              }
            },
            coachedSessions: {
              where: {
                deletedAt: null,
                status: {
                  in: ['SCHEDULED', 'COMPLETED']
                }
              },
              select: {
                id: true
              }
            }
          }
        }
      }
    });

    const user = updatedCoach.user;
    const reviews = user.reviewsReceived;
    const rating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    const result = {
      id: updatedCoach.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      avatar: user.profile?.avatarUrl,
      phone: user.profile?.phone,
      specialty: updatedCoach.specializations,
      rating: Math.round(rating * 10) / 10,
      students: user.coachedStudents.length,
      sessions: user.coachedSessions.length,
      status: user.status === 'ACTIVE' ? 'Active' : 'Inactive',
      experienceYears: updatedCoach.experienceYears,
      certification: updatedCoach.certification,
      hourlyRate: updatedCoach.hourlyRate ? parseFloat(updatedCoach.hourlyRate.toString()) : undefined
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Soft delete coach
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
  try {
    const coachId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    // Check if coach exists and is in the same club
    const existingCoach = await prisma.coach.findFirst({
      where: {
        id: coachId,
        clubId,
        deletedAt: null
      }
    });

    if (!existingCoach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    await prisma.coach.update({
      where: { id: coachId },
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