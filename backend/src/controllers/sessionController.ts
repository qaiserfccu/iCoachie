import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole } from '../middleware/requireRole';

const router = express.Router();

// Get sessions in user's club
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = req.user!.clubId;

    const sessions = await prisma.session.findMany({
      where: {
        clubId,
        deletedAt: null
      },
      select: {
        id: true,
        title: true,
        description: true,
        sessionDate: true,
        startTime: true,
        endTime: true,
        location: true,
        maxCapacity: true,
        currentEnrolled: true,
        status: true,
        createdAt: true,
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
        club: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            enrollments: true,
            attendances: true
          }
        }
      },
      orderBy: {
        sessionDate: 'desc'
      }
    });

    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get session by ID (in user's club)
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        clubId,
        deletedAt: null
      },
      select: {
        id: true,
        title: true,
        description: true,
        sessionDate: true,
        startTime: true,
        endTime: true,
        location: true,
        maxCapacity: true,
        currentEnrolled: true,
        status: true,
        createdAt: true,
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
        club: {
          select: {
            id: true,
            name: true
          }
        },
        enrollments: {
          select: {
            id: true,
            student: {
              select: {
                id: true,
                name: true,
                user: {
                  select: {
                    profile: {
                      select: {
                        displayName: true
                      }
                    }
                  }
                }
              }
            },
            enrolledAt: true,
            status: true
          }
        },
        attendances: {
          select: {
            id: true,
            student: {
              select: {
                id: true,
                name: true
              }
            },
            status: true,
            checkinTime: true,
            notes: true,
            recordedAt: true,
            recorder: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            recordedAt: 'desc'
          }
        }
      }
    });

    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Create session (admin or coach)
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    // Check if user is admin or coach
    const isAdmin = await prisma.userRoleAssignment.findFirst({
      where: {
        userId: currentUserId,
        role: { name: 'SuperAdmin' }
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

    const { coachId, title, description, sessionDate, startTime, endTime, location, maxCapacity } = req.body;
    if (!coachId || !title || !sessionDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'coachId, title, sessionDate, startTime, and endTime are required' });
    }

    // Verify coach exists and is in the same club
    const coach = await prisma.user.findUnique({
      where: { id: parseInt(coachId) },
      select: { clubId: true }
    });

    if (!coach || coach.clubId !== clubId) {
      return res.status(400).json({ message: 'Coach not found in this club' });
    }

    const session = await prisma.session.create({
      data: {
        coachId: parseInt(coachId),
        clubId,
        title,
        description,
        sessionDate: new Date(sessionDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : null,
        currentEnrolled: 0
      },
      select: {
        id: true,
        title: true,
        description: true,
        sessionDate: true,
        startTime: true,
        endTime: true,
        location: true,
        maxCapacity: true,
        status: true,
        createdAt: true
      }
    });

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update session (admin or session coach)
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    // Check permissions
    const isAdmin = await prisma.userRoleAssignment.findFirst({
      where: {
        userId: currentUserId,
        role: { name: 'SuperAdmin' }
      }
    });

    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        clubId,
        deletedAt: null
      },
      select: {
        coachId: true
      }
    });

    if (!session) return res.status(404).json({ message: 'Session not found' });

    const isSessionCoach = session.coachId === currentUserId;

    if (!isAdmin && !isSessionCoach) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, sessionDate, startTime, endTime, location, maxCapacity, status } = req.body;

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        title,
        description,
        sessionDate: sessionDate ? new Date(sessionDate) : undefined,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        location,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : undefined,
        status,
        updatedAt: new Date()
      },
      select: {
        id: true,
        title: true,
        description: true,
        sessionDate: true,
        startTime: true,
        endTime: true,
        location: true,
        maxCapacity: true,
        status: true,
        updatedAt: true
      }
    });

    res.json(updatedSession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Soft delete session (admin only)
router.delete('/:id', requireAuth, requireRole('SuperAdmin'), async (req: AuthRequest, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        clubId,
        deletedAt: null
      }
    });

    if (!session) return res.status(404).json({ message: 'Session not found' });

    await prisma.session.update({
      where: { id: sessionId },
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

// Enroll student in session
router.post('/:id/enroll', requireAuth, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const { studentId } = req.body;
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    if (!studentId) return res.status(400).json({ message: 'studentId is required' });

    // Verify session exists in club
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        clubId,
        deletedAt: null
      },
      select: {
        maxCapacity: true,
        currentEnrolled: true
      }
    });

    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Check capacity
    if (session.maxCapacity && session.currentEnrolled >= session.maxCapacity) {
      return res.status(400).json({ message: 'Session is full' });
    }

    // Verify student exists in club
    const student = await prisma.student.findFirst({
      where: {
        id: parseInt(studentId),
        clubId,
        deletedAt: null
      }
    });

    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check if already enrolled
    const existingEnrollment = await prisma.sessionEnrollment.findUnique({
      where: {
        sessionId_studentId: {
          sessionId,
          studentId: parseInt(studentId)
        }
      }
    });

    if (existingEnrollment) return res.status(409).json({ message: 'Student already enrolled' });

    // Check permissions (admin, coach, or parent of student)
    const isAdmin = await prisma.userRoleAssignment.findFirst({
      where: {
        userId: currentUserId,
        role: { name: 'SuperAdmin' }
      }
    });

    const isCoach = await prisma.coach.findFirst({
      where: {
        userId: currentUserId,
        clubId
      }
    });

    const isParent = student.parentId === currentUserId;

    if (!isAdmin && !isCoach && !isParent) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await prisma.$transaction(async (tx) => {
      // Create enrollment
      await tx.sessionEnrollment.create({
        data: {
          sessionId,
          studentId: parseInt(studentId)
        }
      });

      // Update enrolled count
      await tx.session.update({
        where: { id: sessionId },
        data: {
          currentEnrolled: {
            increment: 1
          }
        }
      });
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Unenroll student from session
router.delete('/:id/enroll/:studentId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const studentId = parseInt(req.params.studentId);
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    // Verify session and student exist in club
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        clubId,
        deletedAt: null
      }
    });

    if (!session) return res.status(404).json({ message: 'Session not found' });

    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        clubId,
        deletedAt: null
      }
    });

    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check permissions
    const isAdmin = await prisma.userRoleAssignment.findFirst({
      where: {
        userId: currentUserId,
        role: { name: 'SuperAdmin' }
      }
    });

    const isCoach = await prisma.coach.findFirst({
      where: {
        userId: currentUserId,
        clubId
      }
    });

    const isParent = student.parentId === currentUserId;

    if (!isAdmin && !isCoach && !isParent) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await prisma.$transaction(async (tx) => {
      // Delete enrollment
      await tx.sessionEnrollment.delete({
        where: {
          sessionId_studentId: {
            sessionId,
            studentId
          }
        }
      });

      // Update enrolled count
      await tx.session.update({
        where: { id: sessionId },
        data: {
          currentEnrolled: {
            decrement: 1
          }
        }
      });
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    if ((err as any).code === 'P2025') {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.status(500).json({ message: 'Internal error' });
  }
});

export default router;