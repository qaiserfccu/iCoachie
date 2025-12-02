import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole, requirePermission } from '../middleware';
import { getSessionStatusIdByCode } from '../utils/lookups';
import {
  parsePaginationParams,
  buildPageInfo,
  PaginatedResponse
} from '../utils/pagination';

const router = express.Router();

// =============================================================================
// Card 19 - Complete DTO Shapes for Session
// =============================================================================

const sessionSelect = {
  id: true,
  coachId: true,
  clubId: true,
  title: true,
  description: true,
  sessionDate: true,
  startTime: true,
  endTime: true,
  location: true,
  maxCapacity: true,
  currentEnrolled: true,
  statusId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  status: {
    select: { code: true, name: true }
  },
  coach: {
    select: {
      id: true,
      name: true,
      profile: {
        select: { displayName: true, avatarUrl: true }
      }
    }
  },
  club: {
    select: { id: true, name: true }
  }
};

// Response mapper for consistent DTOs
const mapSessionResponse = (session: any) => ({
  id: session.id,
  coachId: session.coachId,
  clubId: session.clubId,
  title: session.title,
  description: session.description,
  sessionDate: session.sessionDate,
  startTime: session.startTime,
  endTime: session.endTime,
  location: session.location,
  maxCapacity: session.maxCapacity,
  currentEnrolled: session.currentEnrolled,
  status: session.status || null,
  coach: session.coach || null,
  club: session.club || null,
  enrollmentCount: session._count?.enrollments,
  attendanceCount: session._count?.attendances,
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
  deletedAt: session.deletedAt
});

// Get sessions in user's club - Card 22 & 23: Pagination + soft delete filter
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = req.user!.clubId;
    const { page, pageSize, search } = parsePaginationParams(req.query);
    const includeDeleted = req.query.includeDeleted === 'true';
    const coachId = req.query.coachId ? parseInt(req.query.coachId as string) : undefined;
    const status = req.query.status as string | undefined;

    const where: any = {
      clubId,
      ...(includeDeleted ? {} : { deletedAt: null }),
      ...(coachId ? { coachId } : {}),
      ...(status ? { status: { code: status } } : {}),
      ...(search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } }
        ]
      } : {})
    };

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        select: {
          ...sessionSelect,
          _count: {
            select: { enrollments: true, attendances: true }
          }
        },
        orderBy: { sessionDate: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.session.count({ where })
    ]);

    const response: PaginatedResponse<any> = {
      data: sessions.map(mapSessionResponse),
      pageInfo: buildPageInfo(total, page, pageSize),
      filtersApplied: { search, includeDeleted, coachId, status }
    };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get session by ID (in user's club) - Card 19: Complete DTO
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
        ...sessionSelect,
        enrollments: {
          where: { deletedAt: null },
          select: {
            id: true,
            student: {
              select: {
                id: true,
                name: true,
                user: {
                  select: {
                    profile: { select: { displayName: true, avatarUrl: true } }
                  }
                }
              }
            },
            enrolledAt: true,
            status: true
          }
        },
        attendances: {
          where: { deletedAt: null },
          select: {
            id: true,
            student: { select: { id: true, name: true } },
            status: { select: { code: true, name: true } },
            checkinTime: true,
            notes: true,
            recordedAt: true,
            recorder: { select: { name: true } }
          },
          orderBy: { recordedAt: 'desc' }
        },
        _count: {
          select: { enrollments: true, attendances: true }
        }
      }
    });

    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(mapSessionResponse(session));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Create session (admin or coach) - Card 19: Accept all fields
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    // Check if user is admin or coach
    const isAdmin = await prisma.userRoleAssignment.findFirst({
      where: { userId: currentUserId, role: { code: 'SUPER_ADMIN' } }
    });

    const isCoach = await prisma.coach.findFirst({
      where: { userId: currentUserId, clubId }
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

    // Get default SCHEDULED status
    const scheduledStatusId = await getSessionStatusIdByCode('SCHEDULED');

    const session = await prisma.session.create({
      data: {
        coachId: parseInt(coachId),
        clubId,
        title,
        description: description || null,
        sessionDate: new Date(sessionDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location: location || null,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : null,
        currentEnrolled: 0,
        statusId: scheduledStatusId
      },
      select: sessionSelect
    });

    res.status(201).json(mapSessionResponse(session));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update session (admin or session coach) - Card 19: Accept all fields
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    // Check permissions
    const isAdmin = await prisma.userRoleAssignment.findFirst({
      where: { userId: currentUserId, role: { code: 'SUPER_ADMIN' } }
    });

    const session = await prisma.session.findFirst({
      where: { id: sessionId, clubId, deletedAt: null },
      select: { coachId: true }
    });

    if (!session) return res.status(404).json({ message: 'Session not found' });

    const isSessionCoach = session.coachId === currentUserId;

    if (!isAdmin && !isSessionCoach) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, sessionDate, startTime, endTime, location, maxCapacity, status } = req.body;

    // Get status ID if status is provided
    let statusId = undefined;
    if (status) {
      statusId = await getSessionStatusIdByCode(status);
      if (!statusId) {
        return res.status(400).json({ message: `Invalid status: ${status}` });
      }
    }
    
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (sessionDate !== undefined) data.sessionDate = new Date(sessionDate);
    if (startTime !== undefined) data.startTime = new Date(startTime);
    if (endTime !== undefined) data.endTime = new Date(endTime);
    if (location !== undefined) data.location = location;
    if (maxCapacity !== undefined) data.maxCapacity = parseInt(maxCapacity);
    if (statusId !== undefined) data.statusId = statusId;

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data,
      select: sessionSelect
    });

    res.json(mapSessionResponse(updatedSession));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Soft delete session (admin only) - Card 22
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    const session = await prisma.session.findFirst({
      where: { id: sessionId, clubId, deletedAt: null }
    });

    if (!session) return res.status(404).json({ message: 'Session not found' });

    await prisma.session.update({
      where: { id: sessionId },
      data: { deletedAt: new Date() }
    });

    res.json({ ok: true, message: 'Session soft deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Restore session (admin only) - Card 22
router.post('/:id/restore', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    const existing = await prisma.session.findFirst({
      where: { id: sessionId, clubId }
    });
    
    if (!existing) return res.status(404).json({ message: 'Session not found' });
    if (!existing.deletedAt) return res.status(400).json({ message: 'Session is not deleted' });

    const restored = await prisma.session.update({
      where: { id: sessionId },
      data: { deletedAt: null },
      select: sessionSelect
    });

    res.json(mapSessionResponse(restored));
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
        role: { code: 'SUPER_ADMIN' }
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
        role: { code: 'SUPER_ADMIN' }
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