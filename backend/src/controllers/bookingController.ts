import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { socketService } from '../server';
import { getBookingStatusIdByCode } from '../utils/lookups';
const router = express.Router();

// All booking routes require authentication
router.use(requireAuth);

// Create a booking
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { freelancerId, sessionDate, startTime, endTime, serviceType, amount, notes } = req.body;
    const clientId = req.user!.id;

    // Verify freelancer exists and is in the same club (tenant isolation)
    const freelancer = await prisma.user.findFirst({
      where: {
        id: freelancerId,
        clubId: req.user!.clubId,
        deletedAt: null,
      },
      select: {
        id: true,
        primaryRole: {
          select: {
            code: true
          }
        }
      }
    });

    if (!freelancer || !freelancer.primaryRole || freelancer.primaryRole.code !== 'FREELANCER') {
      return res.status(404).json({
        success: false,
        error: 'Freelancer not found or not in your club',
      });
    }

    // Prevent booking with self
    if (clientId === freelancerId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot book yourself',
      });
    }

    // Check for scheduling conflicts - get PENDING and CONFIRMED status IDs
    const pendingStatusId = await getBookingStatusIdByCode('PENDING');
    const confirmedStatusId = await getBookingStatusIdByCode('CONFIRMED');
    const statusIds = [pendingStatusId, confirmedStatusId].filter(id => id !== null) as number[];

    const conflict = await prisma.booking.findFirst({
      where: {
        freelancerId,
        OR: [
          {
            AND: [
              { sessionDate: new Date(sessionDate) },
              {
                OR: [
                  {
                    AND: [
                      { startTime: { lte: new Date(startTime) } },
                      { endTime: { gt: new Date(startTime) } },
                    ],
                  },
                  {
                    AND: [
                      { startTime: { lt: new Date(endTime) } },
                      { endTime: { gte: new Date(endTime) } },
                    ],
                  },
                  {
                    AND: [
                      { startTime: { gte: new Date(startTime) } },
                      { endTime: { lte: new Date(endTime) } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        statusId: { in: statusIds },
        deletedAt: null,
      },
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        error: 'Freelancer is not available at this time',
      });
    }

    // Get default PENDING status (reuse from conflict check)
    const booking = await prisma.booking.create({
      data: {
        freelancerId,
        clientId,
        sessionDate: new Date(sessionDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        serviceType,
        amount: amount ? amount : null,
        notes,
        statusId: pendingStatusId
      },
      include: {
        freelancer: {
          select: { id: true, name: true, email: true },
        },
        client: {
          select: { id: true, name: true, email: true },
        },
        status: {
          select: {
            code: true,
            name: true
          }
        }
      },
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get bookings for user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20, status, type = 'all' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    let whereClause: any = { deletedAt: null };

    // Filter by user role and type
    if (type === 'as_client') {
      whereClause.clientId = userId;
    } else if (type === 'as_freelancer') {
      whereClause.freelancerId = userId;
    } else {
      // Show all bookings where user is involved
      whereClause.OR = [
        { clientId: userId },
        { freelancerId: userId },
      ];
    }

    // Filter by status if provided
    if (status) {
      whereClause.status = status;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: whereClause,
        include: {
          freelancer: {
            select: { id: true, name: true, email: true },
          },
          client: {
            select: { id: true, name: true, email: true },
          },
          status: {
            select: {
              code: true,
              name: true
            }
          },
          reviews: {
            include: {
              reviewer: {
                select: { id: true, name: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.booking.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get specific booking
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(id, 10),
        OR: [
          { clientId: userId },
          { freelancerId: userId },
        ],
        deletedAt: null,
      },
      include: {
        freelancer: {
          select: { id: true, name: true, email: true },
        },
        client: {
          select: { id: true, name: true, email: true },
        },
        reviews: {
          include: {
            reviewer: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Update booking status
router.patch('/:id/status', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.id;

    // Find booking and verify user has permission to update
    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(id, 10),
        OR: [
          { clientId: userId },
          { freelancerId: userId },
        ],
        deletedAt: null,
      },
      include: {
        status: {
          select: {
            code: true,
            name: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Business rules for status updates
    if (!booking.status || booking.status.code === 'COMPLETED' || booking.status.code === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update status of completed or cancelled booking',
      });
    }

    // Validate and get new status ID
    const newStatusId = await getBookingStatusIdByCode(status);
    if (!newStatusId) {
      return res.status(400).json({
        success: false,
        error: `Invalid status: ${status}`,
      });
    }

    // Only freelancer can confirm pending bookings
    if (status === 'CONFIRMED' && booking.freelancerId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only the freelancer can confirm this booking',
      });
    }

    // Only client or freelancer can complete bookings
    if (status === 'COMPLETED' && booking.status && booking.status.code === 'CONFIRMED' &&
        booking.clientId !== userId && booking.freelancerId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only client or freelancer can complete this booking',
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { statusId: newStatusId },
      include: {
        freelancer: {
          select: { id: true, name: true, email: true },
        },
        client: {
          select: { id: true, name: true, email: true },
        },
        status: {
          select: {
            code: true,
            name: true
          }
        }
      },
    });

    // Emit real-time booking update to both parties
    socketService.sendToUser(booking.freelancerId, 'booking-updated', updatedBooking);
    socketService.sendToUser(booking.clientId, 'booking-updated', updatedBooking);

    res.json({
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Cancel booking
router.patch('/:id/cancel', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Find booking and verify user has permission to cancel
    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(id, 10),
        OR: [
          { clientId: userId },
          { freelancerId: userId },
        ],
        deletedAt: null,
      },
      include: {
        status: {
          select: {
            code: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Cannot cancel completed bookings
    if (!booking.status || booking.status.code === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel a completed booking',
      });
    }

    // Cannot cancel bookings that start within 24 hours
    const bookingStart = new Date(booking.startTime);
    const now = new Date();
    const hoursUntilStart = (bookingStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilStart < 24) {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel booking less than 24 hours before start time',
      });
    }

    // Get CANCELLED status ID
    const cancelledStatusId = await getBookingStatusIdByCode('CANCELLED');

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { statusId: cancelledStatusId },
      include: {
        freelancer: {
          select: { id: true, name: true, email: true },
        },
        client: {
          select: { id: true, name: true, email: true },
        },
        status: {
          select: {
            code: true,
            name: true
          }
        }
      },
    });

    // Emit real-time booking update to both parties
    socketService.sendToUser(booking.freelancerId, 'booking-updated', updatedBooking);
    socketService.sendToUser(booking.clientId, 'booking-updated', updatedBooking);

    res.json({
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get available freelancers
router.get('/freelancers/available', async (req: AuthRequest, res) => {
  try {
    const { date, startTime, endTime, serviceType } = req.query;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: 'Date, start time, and end time are required',
      });
    }

    // Get status IDs for active bookings
    const activePendingStatusId = await getBookingStatusIdByCode('PENDING');
    const activeConfirmedStatusId = await getBookingStatusIdByCode('CONFIRMED');
    const activeStatusIds = [activePendingStatusId, activeConfirmedStatusId].filter(id => id !== null) as number[];

    // Find freelancers who are not booked during the requested time
    const availableFreelancers = await prisma.user.findMany({
      where: {
        primaryRole: {
          code: 'FREELANCER'
        },
        clubId: req.user!.clubId,
        deletedAt: null,
        AND: [
          {
            NOT: {
              bookings: {
                some: {
                  sessionDate: new Date(date as string),
                  OR: [
                    {
                      AND: [
                        { startTime: { lte: new Date(startTime as string) } },
                        { endTime: { gt: new Date(startTime as string) } },
                      ],
                    },
                    {
                      AND: [
                        { startTime: { lt: new Date(endTime as string) } },
                        { endTime: { gte: new Date(endTime as string) } },
                      ],
                    },
                    {
                      AND: [
                        { startTime: { gte: new Date(startTime as string) } },
                        { endTime: { lte: new Date(endTime as string) } },
                      ],
                    },
                  ],
                  statusId: { in: activeStatusIds },
                  deletedAt: null,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Filter by service type if provided (TODO: implement service type filtering with profile data)
    let filteredFreelancers = availableFreelancers;

    res.json({
      success: true,
      data: filteredFreelancers,
    });
  } catch (error) {
    console.error('Error getting available freelancers:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;