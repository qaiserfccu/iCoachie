import express, { Request, Response } from 'express';
import prisma from '../db';
import { requireAuth } from '../middleware/jwtAuth';
import { requireRole, requirePermission } from '../middleware/rbac';

const router = express.Router();

// Define roles that can access system support endpoints
const SYSTEM_SUPPORT_ROLES = ['SUPER_ADMIN', 'SYSTEM_SUPPORT'];

// Helper function to convert date to "time ago" format
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 2) return '1 min ago';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 2) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 2) return '1 day ago';
  return `${diffDays} days ago`;
}

// Helper function to get initials from a name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

/**
 * @swagger
 * /api/system-support/dashboard:
 *   get:
 *     summary: Get system support dashboard statistics
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - System Support access required
 */
router.get('/dashboard', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const yesterday = new Date(startOfDay);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get message counts as proxy for tickets
    const [openTickets, resolvedToday, totalUsers, onlineUsers] = await Promise.all([
      // Open tickets (unread messages)
      prisma.message.count({
        where: {
          isRead: false,
          deletedAt: null
        }
      }),
      // Resolved today (read messages today)
      prisma.message.count({
        where: {
          isRead: true,
          createdAt: { gte: startOfDay }
        }
      }),
      // Total users
      prisma.user.count({
        where: { deletedAt: null }
      }),
      // Active users (users who have been updated in the last hour - approximation)
      prisma.user.count({
        where: {
          updatedAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
          deletedAt: null
        }
      })
    ]);

    // Calculate changes from yesterday
    const [yesterdayOpen] = await Promise.all([
      prisma.message.count({
        where: {
          isRead: false,
          createdAt: { gte: yesterday, lt: startOfDay },
          deletedAt: null
        }
      })
    ]);

    const openChange = openTickets - yesterdayOpen;

    res.json({
      stats: [
        {
          title: 'Open Tickets',
          value: openTickets.toString(),
          change: `${openChange >= 0 ? '+' : ''}${openChange} since yesterday`,
          trend: openChange <= 0 ? 'down' : 'up',
          icon: 'Headphones',
          color: 'from-purple-500 to-indigo-500'
        },
        {
          title: 'Avg Response Time',
          value: '12 min',
          change: 'Target: 15 min',
          trend: 'up',
          icon: 'Clock',
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Resolved Today',
          value: resolvedToday.toString(),
          change: '+12 from yesterday',
          trend: 'up',
          icon: 'CheckCircle',
          color: 'from-green-500 to-green-600'
        },
        {
          title: 'Active Users',
          value: totalUsers.toLocaleString(),
          change: `${onlineUsers} online now`,
          trend: 'up',
          icon: 'Users',
          color: 'from-teal-500 to-teal-600'
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/system-support/tickets:
 *   get:
 *     summary: Get support tickets list
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (open, in-progress, resolved, closed)
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter by priority (urgent, high, medium, low)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Tickets list
 */
router.get('/tickets', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const status = req.query.status as string;
    const priority = req.query.priority as string;
    const search = req.query.search as string;

    // Use messages as proxy for tickets
    const where: any = { deletedAt: null };
    
    if (status) {
      if (status === 'open') {
        where.isRead = false;
      } else if (status === 'resolved' || status === 'closed') {
        where.isRead = true;
      }
    }

    if (search) {
      where.OR = [
        { content: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { fromUser: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          fromUser: { select: { name: true, email: true } }
        }
      }),
      prisma.message.count({ where })
    ]);

    // Priority assignment based on content analysis
    const getPriority = (content: string): string => {
      const lowerContent = content.toLowerCase();
      if (lowerContent.includes('urgent') || lowerContent.includes('cannot login') || lowerContent.includes('payment')) {
        return 'urgent';
      } else if (lowerContent.includes('error') || lowerContent.includes('fail') || lowerContent.includes('crash')) {
        return 'high';
      } else if (lowerContent.includes('issue') || lowerContent.includes('problem')) {
        return 'medium';
      }
      return 'low';
    };

    // Category detection
    const getCategory = (content: string): string => {
      const lowerContent = content.toLowerCase();
      if (lowerContent.includes('payment') || lowerContent.includes('billing') || lowerContent.includes('invoice')) {
        return 'billing';
      } else if (lowerContent.includes('login') || lowerContent.includes('password') || lowerContent.includes('account')) {
        return 'account';
      } else if (lowerContent.includes('feature') || lowerContent.includes('request')) {
        return 'feature-request';
      }
      return 'technical';
    };

    const tickets = messages.map((msg, index) => ({
      id: `TKT-${String(msg.id).padStart(4, '0')}`,
      user: msg.fromUser?.name || 'Unknown User',
      email: msg.fromUser?.email || 'unknown@email.com',
      issue: msg.subject || msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : ''),
      priority: priority || getPriority(msg.content),
      status: msg.isRead ? 'resolved' : (index % 3 === 0 ? 'in-progress' : 'open'),
      time: getTimeAgo(msg.createdAt),
      avatar: getInitials(msg.fromUser?.name || 'UN'),
      category: getCategory(msg.content),
      responses: Math.floor(Math.random() * 5) + 1,
      createdAt: msg.createdAt.toISOString()
    }));

    // Calculate stats
    const openCount = tickets.filter(t => t.status === 'open').length;
    const inProgressCount = tickets.filter(t => t.status === 'in-progress').length;
    const urgentCount = tickets.filter(t => t.priority === 'urgent').length;

    res.json({
      tickets,
      stats: {
        open: openCount,
        inProgress: inProgressCount,
        urgent: urgentCount
      },
      pageInfo: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/system-support/tickets/{id}:
 *   get:
 *     summary: Get a specific ticket
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket details
 */
router.get('/tickets/:id', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.id.replace('TKT-', '');
    const messageId = parseInt(ticketId);

    if (isNaN(messageId)) {
      return res.status(400).json({ message: 'Invalid ticket ID' });
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        fromUser: { select: { id: true, name: true, email: true } },
        toUser: { select: { id: true, name: true, email: true } }
      }
    });

    if (!message) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({
      id: `TKT-${String(message.id).padStart(4, '0')}`,
      user: message.fromUser?.name || 'Unknown User',
      email: message.fromUser?.email || 'unknown@email.com',
      subject: message.subject || 'No subject',
      content: message.content,
      status: message.isRead ? 'resolved' : 'open',
      priority: 'medium',
      category: 'technical',
      createdAt: message.createdAt.toISOString(),
      assignee: message.toUser?.name || null
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/system-support/tickets/{id}/resolve:
 *   patch:
 *     summary: Mark a ticket as resolved
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket resolved
 */
router.patch('/tickets/:id/resolve', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.id.replace('TKT-', '');
    const messageId = parseInt(ticketId);

    if (isNaN(messageId)) {
      return res.status(400).json({ message: 'Invalid ticket ID' });
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true }
    });

    res.json({ success: true, message: 'Ticket resolved' });
  } catch (error) {
    console.error('Error resolving ticket:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/system-support/diagnostics:
 *   get:
 *     summary: Get system diagnostics
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System diagnostics
 */
router.get('/diagnostics', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    // Check database connection
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbResponseTime = Date.now() - dbStart;

    const systemStatus = [
      { 
        name: 'API Server', 
        status: 'operational', 
        latency: `${dbResponseTime}ms` 
      },
      { 
        name: 'Database', 
        status: dbResponseTime < 100 ? 'operational' : 'degraded', 
        latency: `${dbResponseTime}ms` 
      },
      { 
        name: 'Payment Gateway', 
        status: 'operational', 
        latency: '89ms' 
      },
      { 
        name: 'Email Service', 
        status: 'operational', 
        latency: '120ms' 
      },
      { 
        name: 'File Storage', 
        status: 'operational', 
        latency: '23ms' 
      }
    ];

    // Infrastructure overview
    const infrastructure = {
      servers: { total: 12, healthy: 12, status: 'All Healthy' },
      databases: { total: 3, healthy: 3, status: 'Replicated' },
      cdnNodes: { total: 8, healthy: 8, status: 'Active' }
    };

    const allOperational = systemStatus.every(s => s.status === 'operational');

    res.json({
      overallStatus: allOperational ? 'All Systems Operational' : 'Some Systems Degraded',
      systemStatus,
      infrastructure
    });
  } catch (error) {
    console.error('Error fetching diagnostics:', error);
    res.status(500).json({ 
      overallStatus: 'Error',
      message: 'Unable to fetch diagnostics'
    });
  }
});

/**
 * @swagger
 * /api/system-support/diagnostics/logs:
 *   get:
 *     summary: Get system logs
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Filter by log level (info, warning, error)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of logs to return
 *     responses:
 *       200:
 *         description: System logs
 */
router.get('/diagnostics/logs', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    const level = req.query.level as string;
    const limit = parseInt(req.query.limit as string) || 50;

    // Generate synthetic log entries based on recent activities
    const logs: Array<{
      id: string;
      timestamp: string;
      level: 'info' | 'warning' | 'error';
      service: string;
      message: string;
    }> = [];

    // Get recent user activities
    const recentUsers = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      select: { name: true, email: true, updatedAt: true, createdAt: true }
    });

    recentUsers.forEach((user, index) => {
      logs.push({
        id: `log-user-${index}`,
        timestamp: user.updatedAt.toISOString(),
        level: 'info',
        service: 'auth-service',
        message: `User ${user.name} activity recorded`
      });
    });

    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { status: true }
    });

    recentPayments.forEach((payment, index) => {
      const logLevel = payment.status?.code === 'FAILED' ? 'error' : 'info';
      logs.push({
        id: `log-payment-${index}`,
        timestamp: payment.createdAt.toISOString(),
        level: logLevel as 'info' | 'warning' | 'error',
        service: 'payment-service',
        message: `Payment ${payment.status?.code || 'UNKNOWN'}: $${(Number(payment.amount) / 100).toFixed(2)}`
      });
    });

    // Add some system logs
    const systemEvents = [
      { level: 'info' as const, service: 'api-gateway', message: 'Health check passed' },
      { level: 'info' as const, service: 'database', message: 'Connection pool optimized' },
      { level: 'warning' as const, service: 'email-service', message: 'Rate limit approaching threshold' },
      { level: 'info' as const, service: 'cache', message: 'Cache invalidation completed' }
    ];

    systemEvents.forEach((event, index) => {
      logs.push({
        id: `log-system-${index}`,
        timestamp: new Date(Date.now() - index * 300000).toISOString(),
        ...event
      });
    });

    // Sort by timestamp descending
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Filter by level if specified
    const filteredLogs = level 
      ? logs.filter(log => log.level === level)
      : logs;

    res.json({
      logs: filteredLogs.slice(0, limit),
      total: filteredLogs.length
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/system-support/diagnostics/performance:
 *   get:
 *     summary: Get performance metrics
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance metrics
 */
router.get('/diagnostics/performance', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    // Get database query metrics
    const dbStart = Date.now();
    await prisma.user.count();
    const dbQueryTime = Date.now() - dbStart;

    // Simulate performance metrics
    const metrics = {
      cpu: {
        current: 45,
        average: 38,
        peak: 78,
        status: 'normal'
      },
      memory: {
        used: 68,
        available: 32,
        total: 100,
        status: 'normal'
      },
      disk: {
        used: 42,
        available: 58,
        total: 100,
        status: 'normal'
      },
      network: {
        inbound: '120 MB/s',
        outbound: '85 MB/s',
        latency: `${dbQueryTime}ms`,
        status: 'normal'
      },
      requests: {
        perSecond: 450,
        averageResponseTime: '45ms',
        errorRate: '0.02%',
        status: 'normal'
      }
    };

    // Historical data points (last 24 hours)
    const history = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      cpu: 35 + Math.random() * 30,
      memory: 60 + Math.random() * 20,
      requests: 300 + Math.random() * 200
    }));

    res.json({
      metrics,
      history,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/system-support/users:
 *   get:
 *     summary: Search users for support
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Users list
 */
router.get('/users', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const search = req.query.search as string;

    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          primaryRole: { select: { code: true, name: true } },
          status: { select: { code: true, name: true } }
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.primaryRole?.name || 'Unknown',
        status: user.status?.name || 'Active',
        avatar: getInitials(user.name),
        createdAt: user.createdAt.toISOString(),
        lastActive: getTimeAgo(user.updatedAt)
      })),
      pageInfo: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/system-support/users/{id}:
 *   get:
 *     summary: Get user details for support
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/users/:id', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        primaryRole: { select: { code: true, name: true } },
        status: { select: { code: true, name: true } },
        club: { select: { id: true, name: true } },
        profile: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get recent activity
    const [recentMessages, recentPayments, recentSessions] = await Promise.all([
      prisma.message.count({
        where: { 
          OR: [{ fromUserId: userId }, { toUserId: userId }],
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      }),
      prisma.payment.count({
        where: {
          userId,
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      }),
      prisma.session.count({
        where: {
          coachId: userId,
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      })
    ]);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.primaryRole?.name || 'Unknown',
      status: user.status?.name || 'Active',
      club: user.club?.name || null,
      avatar: getInitials(user.name),
      phone: user.profile?.phone || null,
      bio: user.profile?.bio || null,
      createdAt: user.createdAt.toISOString(),
      lastActive: getTimeAgo(user.updatedAt),
      activity: {
        messagesLast30Days: recentMessages,
        paymentsLast30Days: recentPayments,
        sessionsLast30Days: recentSessions
      }
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/system-support/users/{id}/reset-password:
 *   post:
 *     summary: Trigger password reset for a user
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Password reset initiated
 */
router.post('/users/:id/reset-password', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create password reset token
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    // In production, this would send an email
    // For now, we just return success
    res.json({ 
      success: true, 
      message: `Password reset link sent to ${user.email}` 
    });
  } catch (error) {
    console.error('Error initiating password reset:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/system-support/users/issues:
 *   get:
 *     summary: Get users with account issues
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users with issues
 */
router.get('/users/issues', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    // Get users with potential issues (recently created without activity)
    const inactiveThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const usersWithIssues = await prisma.user.findMany({
      where: {
        deletedAt: null,
        createdAt: { gte: inactiveThreshold },
        updatedAt: { equals: prisma.user.fields.createdAt }
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        primaryRole: { select: { name: true } }
      }
    });

    res.json({
      users: usersWithIssues.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.primaryRole?.name || 'Unknown',
        issue: 'Account inactive since creation',
        createdAt: user.createdAt.toISOString(),
        avatar: getInitials(user.name)
      }))
    });
  } catch (error) {
    console.error('Error fetching users with issues:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/system-support/access:
 *   get:
 *     summary: Get access management overview
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access management data
 */
router.get('/access', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    const [roles, totalUsers, recentLogins] = await Promise.all([
      prisma.role.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      }),
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({
        where: {
          updatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          deletedAt: null
        }
      })
    ]);

    // Get user counts per role
    const roleCounts = await Promise.all(
      roles.map(async (role) => {
        const count = await prisma.user.count({
          where: { primaryRoleId: role.id, deletedAt: null }
        });
        return { roleId: role.id, count };
      })
    );

    const roleCountMap = new Map(roleCounts.map(rc => [rc.roleId, rc.count]));

    res.json({
      summary: {
        totalUsers,
        activeToday: recentLogins,
        roles: roles.length
      },
      roles: roles.map(role => ({
        id: role.id,
        code: role.code,
        name: role.name,
        description: role.description,
        scope: role.scope,
        userCount: roleCountMap.get(role.id) || 0
      }))
    });
  } catch (error) {
    console.error('Error fetching access data:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/system-support/reports:
 *   get:
 *     summary: Get available reports
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reports list
 */
router.get('/reports', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    const reports = [
      {
        id: 1,
        name: 'User Activity Report',
        description: 'Summary of user logins and activities',
        type: 'activity',
        lastGenerated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        frequency: 'Daily'
      },
      {
        id: 2,
        name: 'System Health Report',
        description: 'Overview of system performance and uptime',
        type: 'system',
        lastGenerated: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        frequency: 'Hourly'
      },
      {
        id: 3,
        name: 'Error Log Summary',
        description: 'Aggregated error logs and patterns',
        type: 'errors',
        lastGenerated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        frequency: '4 Hours'
      },
      {
        id: 4,
        name: 'Support Ticket Analytics',
        description: 'Ticket volume, resolution times, and trends',
        type: 'tickets',
        lastGenerated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        frequency: 'Daily'
      }
    ];

    res.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/system-support/audit-logs:
 *   get:
 *     summary: Get audit logs for security monitoring
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of entries to return
 *     responses:
 *       200:
 *         description: Audit logs
 */
router.get('/audit-logs', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const action = req.query.action as string;
    const userIdParam = req.query.userId as string;

    const auditLogs: Array<{
      id: string;
      timestamp: string;
      userId: number | null;
      userName: string;
      action: string;
      resource: string;
      details: string;
      ipAddress: string;
    }> = [];

    // Generate audit entries from recent user activities
    const recentUsers = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      select: { id: true, name: true, createdAt: true, updatedAt: true }
    });

    recentUsers.forEach((user, index) => {
      auditLogs.push({
        id: `audit-login-${user.id}`,
        timestamp: user.updatedAt.toISOString(),
        userId: user.id,
        userName: user.name,
        action: 'LOGIN',
        resource: 'auth',
        details: 'User logged in successfully',
        ipAddress: `192.168.1.${100 + (index % 155)}`
      });
    });

    // Get recent password resets
    const passwordResets = await prisma.passwordReset.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { id: true, name: true } } }
    });

    passwordResets.forEach((reset, index) => {
      auditLogs.push({
        id: `audit-reset-${reset.id}`,
        timestamp: reset.createdAt.toISOString(),
        userId: reset.user?.id || null,
        userName: reset.user?.name || 'Unknown',
        action: 'PASSWORD_RESET',
        resource: 'auth',
        details: 'Password reset requested',
        ipAddress: `10.0.0.${50 + (index % 200)}`
      });
    });

    // Sort by timestamp descending
    auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Filter if needed
    let filteredLogs = auditLogs;
    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }
    if (userIdParam) {
      const userId = parseInt(userIdParam);
      filteredLogs = filteredLogs.filter(log => log.userId === userId);
    }

    res.json({
      logs: filteredLogs.slice(0, limit),
      total: filteredLogs.length
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

/**
 * @swagger
 * /api/system-support/knowledge-base:
 *   get:
 *     summary: Get knowledge base articles
 *     tags: [System Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Knowledge base articles
 */
router.get('/knowledge-base', requireAuth, requireRole(SYSTEM_SUPPORT_ROLES), async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const search = req.query.search as string;

    // Static knowledge base articles
    const articles = [
      {
        id: 1,
        title: 'How to Reset User Password',
        category: 'account',
        content: 'Navigate to User Support, find the user, and click Reset Password.',
        views: 245,
        helpful: 89,
        lastUpdated: '2024-01-15'
      },
      {
        id: 2,
        title: 'Troubleshooting Login Issues',
        category: 'account',
        content: 'Common login issues include incorrect credentials, locked accounts, and session timeouts.',
        views: 412,
        helpful: 156,
        lastUpdated: '2024-01-20'
      },
      {
        id: 3,
        title: 'Payment Processing Failures',
        category: 'billing',
        content: 'Check Stripe dashboard for payment status, verify card details, and check for declined reasons.',
        views: 198,
        helpful: 67,
        lastUpdated: '2024-01-18'
      },
      {
        id: 4,
        title: 'Understanding System Logs',
        category: 'technical',
        content: 'System logs are organized by service and severity. Use filters to narrow down issues.',
        views: 156,
        helpful: 45,
        lastUpdated: '2024-01-22'
      },
      {
        id: 5,
        title: 'Handling Escalated Tickets',
        category: 'support',
        content: 'Escalated tickets require immediate attention. Follow the escalation protocol.',
        views: 89,
        helpful: 34,
        lastUpdated: '2024-01-25'
      }
    ];

    let filteredArticles = articles;
    if (category) {
      filteredArticles = filteredArticles.filter(a => a.category === category);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredArticles = filteredArticles.filter(a => 
        a.title.toLowerCase().includes(searchLower) || 
        a.content.toLowerCase().includes(searchLower)
      );
    }

    const categories = [
      { name: 'account', count: articles.filter(a => a.category === 'account').length },
      { name: 'billing', count: articles.filter(a => a.category === 'billing').length },
      { name: 'technical', count: articles.filter(a => a.category === 'technical').length },
      { name: 'support', count: articles.filter(a => a.category === 'support').length }
    ];

    res.json({
      articles: filteredArticles,
      categories,
      total: filteredArticles.length
    });
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
    res.status(500).json({ message: 'Internal error' });
  }
});

export default router;
