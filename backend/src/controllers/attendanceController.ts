import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole } from '../middleware/requireRole';
import { socketService } from '../server';
import { getAttendanceStatusIdByCode } from '../utils/lookups';

const router = express.Router();

// Get attendance for a session
router.get('/session/:sessionId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const clubId = req.user!.clubId;

    // Verify session exists in club
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        clubId,
        deletedAt: null
      }
    });

    if (!session) return res.status(404).json({ message: 'Session not found' });

    const attendances = await prisma.attendance.findMany({
      where: {
        sessionId,
        session: {
          clubId
        }
      },
      select: {
        id: true,
        status: {
          select: {
            code: true,
            name: true
          }
        },
        checkinTime: true,
        notes: true,
        recordedAt: true,
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
        recorder: {
          select: {
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
        recordedAt: 'desc'
      }
    });

    res.json(attendances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get attendance for a student across sessions
router.get('/student/:studentId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    // Verify student exists in club
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        clubId,
        deletedAt: null
      }
    });

    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check permissions (admin, coach, or parent)
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

    const attendances = await prisma.attendance.findMany({
      where: {
        studentId,
        session: {
          clubId
        }
      },
      select: {
        id: true,
        status: true,
        checkinTime: true,
        notes: true,
        recordedAt: true,
        session: {
          select: {
            id: true,
            title: true,
            sessionDate: true,
            startTime: true,
            endTime: true,
            coach: {
              select: {
                name: true
              }
            }
          }
        },
        recorder: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        recordedAt: 'desc'
      }
    });

    res.json(attendances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Record attendance for a student in a session
router.post('/session/:sessionId/student/:studentId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const studentId = parseInt(req.params.studentId);
    const { status, checkinTime, notes } = req.body;
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Validate status with database lookup
    const statusId = await getAttendanceStatusIdByCode(status);
    if (!statusId) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }

    // Verify session exists in club and is not in the future
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        clubId,
        deletedAt: null,
        sessionDate: {
          lte: new Date()
        }
      }
    });

    if (!session) return res.status(404).json({ message: 'Session not found or not yet occurred' });

    // Verify student exists in club
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        clubId,
        deletedAt: null
      }
    });

    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check permissions (admin or coach)
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

    // Check if attendance already exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        sessionId_studentId: {
          sessionId,
          studentId
        }
      }
    });

    if (existingAttendance) {
      return res.status(409).json({ message: 'Attendance already recorded for this student in this session' });
    }

    const attendance = await prisma.attendance.create({
      data: {
        sessionId,
        studentId,
        statusId,
        checkinTime: checkinTime ? new Date(checkinTime) : null,
        notes,
        recordedBy: currentUserId
      },
      select: {
        id: true,
        status: {
          select: {
            code: true,
            name: true
          }
        },
        checkinTime: true,
        notes: true,
        recordedAt: true,
        student: {
          select: {
            id: true,
            name: true
          }
        },
        recorder: {
          select: {
            name: true
          }
        }
      }
    });

    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update attendance record
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const attendanceId = parseInt(req.params.id);
    const { status, checkinTime, notes } = req.body;
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    // Validate status with database lookup if provided
    let statusId = undefined;
    if (status) {
      statusId = await getAttendanceStatusIdByCode(status);
      if (!statusId) {
        return res.status(400).json({ message: `Invalid status: ${status}` });
      }
    }

    // Verify attendance exists and belongs to user's club
    const attendance = await prisma.attendance.findFirst({
      where: {
        id: attendanceId,
        session: {
          clubId
        }
      },
      select: {
        recordedBy: true
      }
    });

    if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });

    // Check permissions (admin or original recorder)
    const isAdmin = await prisma.userRoleAssignment.findFirst({
      where: {
        userId: currentUserId,
        role: { name: 'SuperAdmin' }
      }
    });

    if (!isAdmin && attendance.recordedBy !== currentUserId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        statusId,
        checkinTime: checkinTime ? new Date(checkinTime) : undefined,
        notes
      },
      select: {
        id: true,
        sessionId: true,
        status: {
          select: {
            code: true,
            name: true
          }
        },
        checkinTime: true,
        notes: true,
        recordedAt: true,
        student: {
          select: {
            id: true,
            name: true
          }
        },
        recorder: {
          select: {
            name: true
          }
        }
      }
    });

    // Emit real-time attendance update to club
    socketService.broadcastToClub(clubId!, 'attendance-updated', {
      sessionId: updatedAttendance.sessionId,
      attendance: updatedAttendance,
    });

    res.json(updatedAttendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Delete attendance record (admin only)
router.delete('/:id', requireAuth, requireRole('SuperAdmin'), async (req: AuthRequest, res) => {
  try {
    const attendanceId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    // Verify attendance exists in user's club
    const attendance = await prisma.attendance.findFirst({
      where: {
        id: attendanceId,
        session: {
          clubId
        }
      }
    });

    if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });

    await prisma.attendance.delete({
      where: { id: attendanceId }
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Bulk record attendance for a session
router.post('/session/:sessionId/bulk', requireAuth, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const { attendances } = req.body; // Array of { studentId, status, checkinTime?, notes? }
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    if (!Array.isArray(attendances) || attendances.length === 0) {
      return res.status(400).json({ message: 'attendances array is required' });
    }

    // Verify session exists in club and is not in the future
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        clubId,
        deletedAt: null,
        sessionDate: {
          lte: new Date()
        }
      }
    });

    if (!session) return res.status(404).json({ message: 'Session not found or not yet occurred' });

    // Check permissions (admin or coach)
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

    // Validate all attendances
    const studentIds = attendances.map(a => a.studentId);
    const students = await prisma.student.findMany({
      where: {
        id: { in: studentIds },
        clubId,
        deletedAt: null
      },
      select: { id: true }
    });

    const validStudentIds = students.map(s => s.id);
    const invalidAttendances = attendances.filter(a => !validStudentIds.includes(a.studentId));

    if (invalidAttendances.length > 0) {
      return res.status(400).json({ message: 'Some students not found in this club' });
    }

    // Check for existing attendances
    const existingAttendances = await prisma.attendance.findMany({
      where: {
        sessionId,
        studentId: { in: studentIds }
      },
      select: { studentId: true }
    });

    if (existingAttendances.length > 0) {
      return res.status(409).json({ message: 'Some students already have attendance recorded' });
    }

    // Create attendances in transaction
    const createdAttendances = await prisma.$transaction(
      attendances.map(attendance =>
        prisma.attendance.create({
          data: {
            sessionId,
            studentId: attendance.studentId,
            status: attendance.status,
            checkinTime: attendance.checkinTime ? new Date(attendance.checkinTime) : null,
            notes: attendance.notes,
            recordedBy: currentUserId
          },
          select: {
            id: true,
            status: true,
            student: {
              select: {
                id: true,
                name: true
              }
            }
          }
        })
      )
    );

    res.json(createdAttendances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

export default router;