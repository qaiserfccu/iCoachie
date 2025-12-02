import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole, requirePermission } from '../middleware';
import {
  parsePaginationParams,
  buildPageInfo,
  PaginatedResponse
} from '../utils/pagination';

const router = express.Router();

// =============================================================================
// Card 19 - Complete DTO Shapes for Student
// =============================================================================

const studentSelect = {
  id: true,
  userId: true,
  parentId: true,
  clubId: true,
  coachId: true,
  name: true,
  age: true,
  level: true,
  sport: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  user: {
    select: {
      id: true,
      email: true,
      profile: {
        select: { displayName: true, phone: true, avatarUrl: true }
      }
    }
  },
  parent: {
    select: {
      id: true,
      name: true,
      email: true,
      profile: {
        select: { displayName: true, phone: true }
      }
    }
  },
  coach: {
    select: {
      id: true,
      name: true,
      profile: {
        select: { displayName: true }
      }
    }
  }
};

// Response mapper for consistent DTOs
const mapStudentResponse = (student: any) => ({
  id: student.id,
  userId: student.userId,
  parentId: student.parentId,
  clubId: student.clubId,
  coachId: student.coachId,
  name: student.name,
  age: student.age,
  level: student.level,
  sport: student.sport,
  user: student.user || null,
  parent: student.parent || null,
  coach: student.coach || null,
  enrollmentCount: student._count?.enrollments,
  attendanceCount: student._count?.attendances,
  evaluationCount: student._count?.evaluations,
  createdAt: student.createdAt,
  updatedAt: student.updatedAt,
  deletedAt: student.deletedAt
});

// Get students in user's club - Card 22 & 23: Pagination + soft delete filter
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = req.user!.clubId;
    const { page, pageSize, search } = parsePaginationParams(req.query);
    const includeDeleted = req.query.includeDeleted === 'true';
    const coachId = req.query.coachId ? parseInt(req.query.coachId as string) : undefined;
    const level = req.query.level as string | undefined;
    const sport = req.query.sport as string | undefined;

    const where: any = {
      clubId,
      ...(includeDeleted ? {} : { deletedAt: null }),
      ...(coachId ? { coachId } : {}),
      ...(level ? { level } : {}),
      ...(sport ? { sport } : {}),
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sport: { contains: search, mode: 'insensitive' } },
          { level: { contains: search, mode: 'insensitive' } }
        ]
      } : {})
    };

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        select: {
          ...studentSelect,
          _count: {
            select: { enrollments: true, attendances: true, evaluations: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.student.count({ where })
    ]);

    const response: PaginatedResponse<any> = {
      data: students.map(mapStudentResponse),
      pageInfo: buildPageInfo(total, page, pageSize),
      filtersApplied: { search, includeDeleted, coachId, level, sport }
    };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get student by ID (in user's club) - Card 19: Complete DTO
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
        ...studentSelect,
        enrollments: {
          where: { deletedAt: null },
          select: {
            id: true,
            session: {
              select: { id: true, title: true, sessionDate: true }
            },
            enrolledAt: true,
            status: true
          }
        },
        attendances: {
          where: { deletedAt: null },
          select: {
            id: true,
            session: {
              select: { id: true, title: true, sessionDate: true }
            },
            status: true,
            checkinTime: true,
            notes: true,
            recordedAt: true
          },
          orderBy: { recordedAt: 'desc' }
        },
        evaluations: {
          where: { deletedAt: null },
          select: {
            id: true,
            coach: { select: { name: true } },
            session: { select: { title: true, sessionDate: true } },
            evaluationType: true,
            overallScore: true,
            comments: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { enrollments: true, attendances: true, evaluations: true }
        }
      }
    });

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(mapStudentResponse(student));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Create student (admin or coach) - Card 19: Accept all fields
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
        level: level || null,
        sport: sport || null
      },
      select: studentSelect
    });

    res.status(201).json(mapStudentResponse(student));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update student (admin or coach) - Card 19: Accept all fields
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    // Check if user is admin or coach
    const isAdmin = await prisma.userRoleAssignment.findFirst({
      where: { userId: currentUserId, role: { code: 'SUPER_ADMIN' } }
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
      select: studentSelect
    });

    res.json(mapStudentResponse(updatedStudent));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Soft delete student (admin only) - Card 22
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
      data: { deletedAt: new Date() }
    });

    res.json({ ok: true, message: 'Student soft deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Restore student (admin only) - Card 22
router.post('/:id/restore', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    const existing = await prisma.student.findFirst({
      where: { id: studentId, clubId }
    });
    
    if (!existing) return res.status(404).json({ message: 'Student not found' });
    if (!existing.deletedAt) return res.status(400).json({ message: 'Student is not deleted' });

    const restored = await prisma.student.update({
      where: { id: studentId },
      data: { deletedAt: null },
      select: studentSelect
    });

    res.json(mapStudentResponse(restored));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

export default router;