import express from 'express';
import prisma from '../db';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole } from '../middleware';
import { getUserStatusIdByCode } from '../utils/lookups';

const COACH_ACTIVE_SESSION_CODES: string[] = ['SCHEDULED', 'COMPLETED'];

const coachListInclude = Prisma.validator<Prisma.CoachInclude>()({
  user: {
    include: {
      profile: true,
      status: {
        select: {
          code: true
        }
      },
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
          id: true,
          name: true,
          sport: true
        }
      },
      coachedSessions: {
        where: {
          deletedAt: null,
          status: {
            is: {
              code: {
                in: COACH_ACTIVE_SESSION_CODES
              }
            }
          }
        },
        select: {
          id: true,
          title: true,
          sessionDate: true,
          status: {
            select: {
              code: true,
              name: true
            }
          }
        }
      }
    }
  }
});

const coachDetailInclude = Prisma.validator<Prisma.CoachInclude>()({
  user: {
    include: {
      profile: true,
      status: {
        select: {
          code: true
        }
      },
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
          status: {
            select: {
              code: true,
              name: true
            }
          }
        }
      }
    }
  }
});

type CoachListPayload = Prisma.CoachGetPayload<{ include: typeof coachListInclude }>;
type CoachDetailPayload = Prisma.CoachGetPayload<{ include: typeof coachDetailInclude }>;

const getAverageRating = (reviews: { rating: number }[]) => {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
};

const formatUserStatus = (code?: string | null) => (code === 'ACTIVE' ? 'Active' : 'Inactive');

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
          status: {
            is: {
              code: 'ACTIVE'
            }
          }
        }
      },
      include: coachListInclude
    }) as CoachListPayload[];

    const result = coaches.map(coach => {
      const user = coach.user;
      const reviews = user.reviewsReceived;
      const rating = getAverageRating(reviews);

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
        status: formatUserStatus(user.status?.code),
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
      include: coachDetailInclude
    }) as CoachDetailPayload | null;

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    const user = coach.user;
    const reviews = user.reviewsReceived;
    const rating = getAverageRating(reviews);

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
      status: formatUserStatus(user.status?.code),
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
    const activeStatusId = await getUserStatusIdByCode('ACTIVE');

    if (!activeStatusId) {
      return res.status(500).json({ message: 'Unable to resolve ACTIVE user status' });
    }

    const coachRole = await prisma.role.upsert({
      where: { code: 'COACH' },
      update: {
        name: 'Coach',
        scope: 'CLUB'
      },
      create: {
        code: 'COACH',
        name: 'Coach',
        scope: 'CLUB'
      }
    });

    // Create user first
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashed,
        name,
        clubId,
        primaryRoleId: coachRole.id,
        statusId: activeStatusId,
        profile: {
          create: {
            displayName: name
          }
        }
      },
      include: {
        profile: true,
        status: {
          select: {
            code: true
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
      }
    });

    await prisma.userRoleAssignment.create({
      data: {
        userId: user.id,
        roleId: coachRole.id
      }
    });

    const result = {
      id: coach.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      avatar: user.profile?.avatarUrl,
      phone: user.profile?.phone,
      specialty: coach.specializations,
      rating: 0,
      students: 0,
      sessions: 0,
      status: formatUserStatus(user.status?.code),
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
        role: { code: 'SUPER_ADMIN' }
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
      include: coachListInclude
    }) as CoachListPayload;

    const user = updatedCoach.user;
    const reviews = user.reviewsReceived;
    const rating = getAverageRating(reviews);

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
      status: formatUserStatus(user.status?.code),
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