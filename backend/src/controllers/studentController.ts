import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole } from '../middleware';

const router = express.Router();

// Get students in user's club
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = req.user!.clubId;

    const students = await prisma.student.findMany({
      where: {
        clubId,
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        age: true,
        level: true,
        sport: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                phone: true
              }
            }
          }
        },
        parent: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                displayName: true,
                phone: true
              }
            }
          }
        },
        coach: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get student by ID (in user's club)
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        clubId,
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        age: true,
        level: true,
        sport: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                phone: true
              }
            }
          }
        },
        parent: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                displayName: true,
                phone: true
              }
            }
          }
        },
        coach: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        },
        enrollments: {
          select: {
            id: true,
            session: {
              select: {
                id: true,
                title: true,
                sessionDate: true
              }
            },
            enrolledAt: true,
            status: true
          }
        },
        attendances: {
          select: {
            id: true,
            session: {
              select: {
                id: true,
                title: true,
                sessionDate: true
              }
            },
            status: true,
            checkinTime: true,
            notes: true,
            recordedAt: true
          },
          orderBy: {
            recordedAt: 'desc'
          }
        },
        evaluations: {
          select: {
            id: true,
            coach: {
              select: {
                name: true
              }
            },
            session: {
              select: {
                title: true,
                sessionDate: true
              }
            },
            evaluationType: true,
            overallScore: true,
            comments: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Create student (admin or coach)
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    // Check if user is admin or coach
    const isAdmin = await prisma.userRoleAssignment.findFirst({
      where: {
        userId: currentUserId,
        role: { code: 'SUPER_ADMIN' }
      }
    });

    const isCoach = await prisma.coach.findFirst({
      where: {
        userId: currentUserId,
        clubId
      }
    });

    if (!isAdmin && !isCoach) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { userId, parentId, coachId, name, age, level, sport } = req.body;
    if (!userId || !name) return res.status(400).json({ message: 'userId and name are required' });

    // Verify user exists and is in the same club
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { clubId: true }
    });

    if (!user || user.clubId !== clubId) {
      return res.status(400).json({ message: 'User not found in this club' });
    }

    // Verify parent if provided
    if (parentId) {
      const parent = await prisma.user.findUnique({
        where: { id: parseInt(parentId) },
        select: { clubId: true }
      });

      if (!parent || parent.clubId !== clubId) {
        return res.status(400).json({ message: 'Parent not found in this club' });
      }
    }

    // Verify coach if provided
    if (coachId) {
      const coach = await prisma.user.findUnique({
        where: { id: parseInt(coachId) },
        select: { clubId: true }
      });

      if (!coach || coach.clubId !== clubId) {
        return res.status(400).json({ message: 'Coach not found in this club' });
      }
    }

    const student = await prisma.student.create({
      data: {
        userId: parseInt(userId),
        parentId: parentId ? parseInt(parentId) : null,
        clubId,
        coachId: coachId ? parseInt(coachId) : null,
        name,
        age: age ? parseInt(age) : null,
        level,
        sport
      },
      select: {
        id: true,
        name: true,
        age: true,
        level: true,
        sport: true,
        createdAt: true
      }
    });

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update student (admin or coach)
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    // Check if user is admin or coach
    const isAdmin = await prisma.userRoleAssignment.findFirst({
      where: {
        userId: currentUserId,
        role: { code: 'SUPER_ADMIN' }
      }
    });

    const isCoach = await prisma.coach.findFirst({
      where: {
        userId: currentUserId,
        clubId
      }
    });

    if (!isAdmin && !isCoach) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Verify student exists in club
    const existingStudent = await prisma.student.findFirst({
      where: {
        id: studentId,
        clubId,
        deletedAt: null
      }
    });

    if (!existingStudent) return res.status(404).json({ message: 'Student not found' });

    const { parentId, coachId, name, age, level, sport } = req.body;

    // Verify parent if provided
    if (parentId) {
      const parent = await prisma.user.findUnique({
        where: { id: parseInt(parentId) },
        select: { clubId: true }
      });

      if (!parent || parent.clubId !== clubId) {
        return res.status(400).json({ message: 'Parent not found in this club' });
      }
    }

    // Verify coach if provided
    if (coachId) {
      const coach = await prisma.user.findUnique({
        where: { id: parseInt(coachId) },
        select: { clubId: true }
      });

      if (!coach || coach.clubId !== clubId) {
        return res.status(400).json({ message: 'Coach not found in this club' });
      }
    }

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        parentId: parentId ? parseInt(parentId) : null,
        coachId: coachId ? parseInt(coachId) : null,
        name,
        age: age ? parseInt(age) : null,
        level,
        sport,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        age: true,
        level: true,
        sport: true,
        updatedAt: true
      }
    });

    res.json(updatedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Soft delete student (admin only)
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    // Verify student exists in club
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        clubId,
        deletedAt: null
      }
    });

    if (!student) return res.status(404).json({ message: 'Student not found' });

    await prisma.student.update({
      where: { id: studentId },
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