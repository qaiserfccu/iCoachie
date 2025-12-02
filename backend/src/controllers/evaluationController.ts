import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole } from '../middleware/requireRole';

const router = express.Router();

// Get evaluations for a student
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

    const evaluations = await prisma.evaluation.findMany({
      where: {
        studentId,
        session: {
          clubId
        }
      },
      select: {
        id: true,
        overallScore: true,
        comments: true,
        createdAt: true,
        session: {
          select: {
            id: true,
            title: true,
            sessionDate: true,
            coach: {
              select: {
                name: true
              }
            }
          }
        },
        coach: {
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
        createdAt: 'desc'
      }
    });

    res.json(evaluations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get evaluations for a session
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

    const evaluations = await prisma.evaluation.findMany({
      where: {
        sessionId,
        session: {
          clubId
        }
      },
      select: {
        id: true,
        overallScore: true,
        comments: true,
        createdAt: true,
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
        coach: {
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
        createdAt: 'desc'
      }
    });

    res.json(evaluations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Create evaluation for a student in a session
router.post('/session/:sessionId/student/:studentId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const studentId = parseInt(req.params.studentId);
    const { overallScore, comments, evaluationType } = req.body;
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    if (!overallScore || typeof overallScore !== 'number' || overallScore < 1 || overallScore > 5) {
      return res.status(400).json({ message: 'Overall score must be a number between 1 and 5' });
    }

    if (!evaluationType) {
      return res.status(400).json({ message: 'Evaluation type is required' });
    }

    // Verify session exists in club and has occurred
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

    if (!session) return res.status(404).json({ message: 'Session not found or has not occurred yet' });

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

    // Check if evaluation already exists
    const existingEvaluation = await prisma.evaluation.findFirst({
      where: {
        sessionId,
        studentId
      }
    });

    if (existingEvaluation) {
      return res.status(409).json({ message: 'Evaluation already exists for this student in this session' });
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        sessionId,
        studentId,
        coachId: currentUserId,
        evaluationType,
        overallScore,
        comments
      },
      select: {
        id: true,
        overallScore: true,
        comments: true,
        createdAt: true,
        student: {
          select: {
            id: true,
            name: true
          }
        },
        coach: {
          select: {
            name: true
          }
        }
      }
    });

    res.json(evaluation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update evaluation
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const evaluationId = parseInt(req.params.id);
    const { overallScore, comments } = req.body;
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    if (overallScore && (typeof overallScore !== 'number' || overallScore < 1 || overallScore > 5)) {
      return res.status(400).json({ message: 'Overall score must be a number between 1 and 5' });
    }

    // Verify evaluation exists and belongs to user's club
    const evaluation = await prisma.evaluation.findFirst({
      where: {
        id: evaluationId,
        session: {
          clubId
        }
      },
      select: {
        coachId: true
      }
    });

    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });

    // Check permissions (admin or original evaluator)
    const isAdmin = await prisma.userRoleAssignment.findFirst({
      where: {
        userId: currentUserId,
        role: { code: 'SUPER_ADMIN' }
      }
    });

    if (!isAdmin && evaluation.coachId !== currentUserId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedEvaluation = await prisma.evaluation.update({
      where: { id: evaluationId },
      data: {
        overallScore,
        comments,
        updatedAt: new Date()
      },
      select: {
        id: true,
        overallScore: true,
        comments: true,
        createdAt: true,
        updatedAt: true,
        student: {
          select: {
            id: true,
            name: true
          }
        },
        coach: {
          select: {
            name: true
          }
        }
      }
    });

    res.json(updatedEvaluation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Soft delete evaluation (admin only) - Card 22
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
  try {
    const evaluationId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    // Verify evaluation exists in user's club
    const evaluation = await prisma.evaluation.findFirst({
      where: {
        id: evaluationId,
        session: { clubId },
        deletedAt: null
      }
    });

    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });

    await prisma.evaluation.update({
      where: { id: evaluationId },
      data: { deletedAt: new Date() }
    });

    res.json({ ok: true, message: 'Evaluation soft deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Restore evaluation (admin only) - Card 22
router.post('/:id/restore', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
  try {
    const evaluationId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    const existing = await prisma.evaluation.findFirst({
      where: {
        id: evaluationId,
        session: { clubId }
      }
    });
    
    if (!existing) return res.status(404).json({ message: 'Evaluation not found' });
    if (!existing.deletedAt) return res.status(400).json({ message: 'Evaluation is not deleted' });

    const restored = await prisma.evaluation.update({
      where: { id: evaluationId },
      data: { deletedAt: null },
      select: {
        id: true,
        overallScore: true,
        comments: true,
        createdAt: true,
        student: { select: { id: true, name: true } },
        coach: { select: { name: true } }
      }
    });

    res.json(restored);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get evaluation statistics for a student
router.get('/student/:studentId/stats', requireAuth, async (req: AuthRequest, res) => {
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

    const evaluations = await prisma.evaluation.findMany({
      where: {
        studentId,
        session: {
          clubId
        }
      },
      select: {
        overallScore: true,
        createdAt: true
      }
    });

    if (evaluations.length === 0) {
      return res.json({
        totalEvaluations: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        recentTrend: []
      });
    }

    const validEvaluations = evaluations.filter(e => e.overallScore !== null);
    const totalEvaluations = validEvaluations.length;
    const averageRating = totalEvaluations > 0 ? validEvaluations.reduce((sum, e) => sum + e.overallScore!, 0) / totalEvaluations : 0;

    const ratingDistribution = validEvaluations.reduce((dist, e) => {
      const score = e.overallScore!;
      dist[score] = (dist[score] || 0) + 1;
      return dist;
    }, {} as Record<number, number>);

    // Fill in missing ratings
    for (let i = 1; i <= 5; i++) {
      if (!(i in ratingDistribution)) ratingDistribution[i] = 0;
    }

    // Recent trend (last 10 evaluations)
    const recentTrend = validEvaluations
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
      .reverse()
      .map(e => ({
        date: e.createdAt.toISOString().split('T')[0],
        rating: e.overallScore!
      }));

    res.json({
      totalEvaluations,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      recentTrend
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

export default router;