import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole } from '../middleware/requireRole';

const router = express.Router();

// Get payments for user's club
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = req.user!.clubId;
    const { status, paymentType, userId, limit = 50, offset = 0 } = req.query;

    const where: any = {
      user: {
        clubId
      }
    };

    if (status) where.status = status;
    if (paymentType) where.paymentType = paymentType;
    if (userId) where.userId = parseInt(userId as string);

    const payments = await prisma.payment.findMany({
      where,
      select: {
        id: true,
        amount: true,
        currency: true,
        paymentType: true,
        status: true,
        description: true,
        createdAt: true,
        user: {
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
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get payment by ID
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const paymentId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        user: {
          clubId
        }
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        paymentType: true,
        status: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        user: {
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
        stripePaymentId: true
      }
    });

    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Create payment record
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;
    const {
      userId,
      amount,
      currency = 'USD',
      paymentType,
      description,
      stripePaymentId
    } = req.body;

    if (!userId || !amount || !paymentType) {
      return res.status(400).json({ message: 'userId, amount, and paymentType are required' });
    }

    // Verify user exists in club
    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(userId),
        clubId,
        deletedAt: null
      }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

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

    const payment = await prisma.payment.create({
      data: {
        userId: parseInt(userId),
        amount: parseFloat(amount),
        currency,
        paymentType,
        description,
        stripePaymentId
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        paymentType: true,
        status: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update payment status
router.put('/:id/status', requireAuth, async (req: AuthRequest, res) => {
  try {
    const paymentId = parseInt(req.params.id);
    const { status, stripePaymentId } = req.body;
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;

    if (!status || !['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].includes(status)) {
      return res.status(400).json({ message: 'Valid status (PENDING, COMPLETED, FAILED, REFUNDED) is required' });
    }

    // Verify payment exists in club
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        user: {
          clubId
        }
      }
    });

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

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

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        stripePaymentId,
        updatedAt: new Date()
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        paymentType: true,
        status: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        stripePaymentId: true,
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json(updatedPayment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update payment details
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const paymentId = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    const currentUserId = req.user!.id;
    const {
      amount,
      currency,
      paymentType,
      description,
      stripePaymentId
    } = req.body;

    // Verify payment exists in club
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        user: {
          clubId
        }
      },
      select: {
        userId: true,
        status: true
      }
    });

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Check permissions (admin or payment owner, and payment not completed)
    const isAdmin = await prisma.userRoleAssignment.findFirst({
      where: {
        userId: currentUserId,
        role: { name: 'SuperAdmin' }
      }
    });

    if (!isAdmin && payment.userId !== currentUserId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (payment.status === 'COMPLETED') {
      return res.status(400).json({ message: 'Cannot modify completed payments' });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        currency,
        paymentType,
        description,
        stripePaymentId,
        updatedAt: new Date()
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        paymentType: true,
        status: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json(updatedPayment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Delete payment (admin only, only if not completed)
router.delete('/:id', requireAuth, requireRole('SuperAdmin'), async (req: AuthRequest, res) => {
  try {
    const paymentId = parseInt(req.params.id);
    const clubId = req.user!.clubId;

    // Verify payment exists in club and is not completed
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        user: {
          clubId
        },
        status: {
          not: 'COMPLETED'
        }
      }
    });

    if (!payment) return res.status(404).json({ message: 'Payment not found or already completed' });

    await prisma.payment.delete({
      where: { id: paymentId }
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get payment statistics for the club
router.get('/stats/overview', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = req.user!.clubId;
    const { period = 'month' } = req.query; // 'week', 'month', 'quarter', 'year'

    let dateFilter;
    const now = new Date();

    switch (period) {
      case 'week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        dateFilter = new Date(now.getFullYear(), quarterStart, 1);
        break;
      case 'year':
        dateFilter = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const payments = await prisma.payment.findMany({
      where: {
        user: {
          clubId
        },
        createdAt: {
          gte: dateFilter
        }
      },
      select: {
        amount: true,
        status: true,
        paymentType: true,
        createdAt: true
      }
    });

    const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
    const completedPayments = payments.filter(p => p.status === 'COMPLETED');
    const completedAmount = completedPayments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
    const pendingAmount = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

    const typeBreakdown = payments.reduce((breakdown, p) => {
      const type = p.paymentType;
      breakdown[type] = (breakdown[type] || 0) + parseFloat(p.amount.toString());
      return breakdown;
    }, {} as Record<string, number>);

    const statusBreakdown = payments.reduce((breakdown, p) => {
      breakdown[p.status] = (breakdown[p.status] || 0) + 1;
      return breakdown;
    }, {} as Record<string, number>);

    res.json({
      period,
      totalPayments: payments.length,
      totalAmount: Math.round(totalAmount * 100) / 100,
      completedAmount: Math.round(completedAmount * 100) / 100,
      pendingAmount: Math.round(pendingAmount * 100) / 100,
      completionRate: payments.length > 0 ? Math.round((completedPayments.length / payments.length) * 100) : 0,
      typeBreakdown,
      statusBreakdown
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

export default router;