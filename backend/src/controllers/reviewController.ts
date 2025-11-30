import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { z } from 'zod';
const router = express.Router();

// All review routes require authentication
router.use(requireAuth);

// Validation schemas
const createReviewSchema = z.object({
  revieweeId: z.number().int().positive(),
  bookingId: z.number().int().positive().optional(),
  sessionId: z.number().int().positive().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

// Create a review
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { revieweeId, bookingId, sessionId, rating, comment } = createReviewSchema.parse(req.body);
    const reviewerId = req.user!.id;

    // Verify reviewee exists and is in the same club (tenant isolation)
    const reviewee = await prisma.user.findFirst({
      where: {
        id: revieweeId,
        clubId: req.user!.clubId,
        deletedAt: null,
      },
    });

    if (!reviewee) {
      return res.status(404).json({
        success: false,
        error: 'User to review not found or not in your club',
      });
    }

    // Prevent self-review
    if (reviewerId === revieweeId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot review yourself',
      });
    }

    // Verify booking exists and user is involved (if bookingId provided)
    if (bookingId) {
      const booking = await prisma.booking.findFirst({
        where: {
          id: bookingId,
          OR: [
            { clientId: reviewerId },
            { freelancerId: reviewerId },
          ],
          status: 'COMPLETED',
          deletedAt: null,
        },
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found or not authorized to review',
        });
      }

      // Ensure reviewee is the other party in the booking
      if (booking.clientId !== revieweeId && booking.freelancerId !== revieweeId) {
        return res.status(400).json({
          success: false,
          error: 'Reviewee must be involved in the booking',
        });
      }
    }

    // Verify session exists and user is involved (if sessionId provided)
    if (sessionId) {
      const session = await prisma.session.findFirst({
        where: {
          id: sessionId,
          OR: [
            { coachId: reviewerId },
            {
              enrollments: {
                some: {
                  student: {
                    userId: reviewerId,
                  },
                },
              },
            },
          ],
          deletedAt: null,
        },
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found or not authorized to review',
        });
      }

      // Ensure reviewee is the coach (for student reviews) or student (for coach reviews)
      if (reviewerId !== session.coachId) {
        // Student reviewing coach
        if (session.coachId !== revieweeId) {
          return res.status(400).json({
            success: false,
            error: 'Can only review the coach for this session',
          });
        }
      } else {
        // Coach reviewing student - would need to check enrollment
        const enrollment = await prisma.sessionEnrollment.findFirst({
          where: {
            sessionId,
            student: {
              userId: revieweeId,
            },
          },
        });

        if (!enrollment) {
          return res.status(400).json({
            success: false,
            error: 'Student not enrolled in this session',
          });
        }
      }
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        reviewerId,
        revieweeId,
        bookingId: bookingId || null,
        sessionId: sessionId || null,
        deletedAt: null,
      },
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        error: 'Review already exists for this booking/session',
      });
    }

    const review = await prisma.review.create({
      data: {
        reviewerId,
        revieweeId,
        bookingId,
        sessionId,
        rating,
        comment,
      },
      include: {
        reviewer: {
          select: { id: true, name: true },
        },
        reviewee: {
          select: { id: true, name: true },
        },
        booking: bookingId ? {
          select: { id: true, serviceType: true },
        } : false,
      },
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: (error as z.ZodError).issues,
      });
    }

    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get reviews
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { userId, page = 1, limit = 20, type = 'received' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    let whereClause: any = { deletedAt: null };

    if (userId) {
      // Get reviews for a specific user
      if (type === 'given') {
        whereClause.reviewerId = parseInt(userId as string, 10);
      } else {
        whereClause.revieweeId = parseInt(userId as string, 10);
      }
    } else {
      // Get reviews where current user is involved
      if (type === 'given') {
        whereClause.reviewerId = req.user!.id;
      } else {
        whereClause.revieweeId = req.user!.id;
      }
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
        include: {
          reviewer: {
            select: { id: true, name: true },
          },
          reviewee: {
            select: { id: true, name: true },
          },
          booking: {
            select: { id: true, serviceType: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.review.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get review by ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const review = await prisma.review.findFirst({
      where: {
        id: parseInt(id, 10),
        OR: [
          { reviewerId: userId },
          { revieweeId: userId },
        ],
        deletedAt: null,
      },
      include: {
        reviewer: {
          select: { id: true, name: true },
        },
        reviewee: {
          select: { id: true, name: true },
        },
        booking: {
          select: { id: true, serviceType: true },
        },
      },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Error getting review:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Update review
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updates = updateReviewSchema.parse(req.body);
    const userId = req.user!.id;

    // Only reviewer can update their review
    const review = await prisma.review.findFirst({
      where: {
        id: parseInt(id, 10),
        reviewerId: userId,
        deletedAt: null,
      },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found or not authorized to update',
      });
    }

    // Check if update is within allowed time window (e.g., 30 days)
    const reviewAge = Date.now() - review.createdAt.getTime();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    if (reviewAge > thirtyDays) {
      return res.status(400).json({
        success: false,
        error: 'Reviews can only be updated within 30 days of creation',
      });
    }

    const updatedReview = await prisma.review.update({
      where: { id: review.id },
      data: updates,
      include: {
        reviewer: {
          select: { id: true, name: true },
        },
        reviewee: {
          select: { id: true, name: true },
        },
        booking: {
          select: { id: true, serviceType: true },
        },
      },
    });

    res.json({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: (error as z.ZodError).issues,
      });
    }

    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Delete review
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Only reviewer can delete their review
    const result = await prisma.review.updateMany({
      where: {
        id: parseInt(id, 10),
        reviewerId: userId,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Review not found or not authorized to delete',
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get review stats for a user
router.get('/stats/:userId', async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;

    // Verify user exists and is in the same club
    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(userId, 10),
        clubId: req.user!.clubId,
        deletedAt: null,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Get review statistics
    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: parseInt(userId, 10),
        deletedAt: null,
      },
      select: {
        rating: true,
      },
    });

    if (reviews.length === 0) {
      return res.json({
        success: true,
        data: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
          },
        },
      });
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    const ratingDistribution = reviews.reduce((dist, review) => {
      dist[review.rating as keyof typeof dist] = (dist[review.rating as keyof typeof dist] || 0) + 1;
      return dist;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    res.json({
      success: true,
      data: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error('Error getting review stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;