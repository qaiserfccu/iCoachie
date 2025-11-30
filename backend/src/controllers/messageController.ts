import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const sendMessageSchema = z.object({
  toUserId: z.number().int().positive(),
  subject: z.string().optional(),
  content: z.string().min(1, 'Message content is required'),
});

const markAsReadSchema = z.object({
  messageIds: z.array(z.number().int().positive()),
});

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { toUserId, subject, content } = sendMessageSchema.parse(req.body);
    const fromUserId = req.userId;

    // Verify recipient exists and is in the same club (tenant isolation)
    const recipient = await prisma.user.findFirst({
      where: {
        id: toUserId,
        clubId: req.clubId,
        deletedAt: null,
      },
    });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        error: 'Recipient not found or not in your club',
      });
    }

    // Prevent sending messages to self
    if (fromUserId === toUserId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot send message to yourself',
      });
    }

    const message = await prisma.message.create({
      data: {
        fromUserId,
        toUserId,
        subject,
        content,
      },
      include: {
        fromUser: {
          select: { id: true, name: true, email: true },
        },
        toUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }

    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20, type = 'all' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    let whereClause: any = {
      OR: [
        { fromUserId: userId },
        { toUserId: userId },
      ],
      deletedAt: null,
    };

    // Filter by type
    if (type === 'sent') {
      whereClause = { fromUserId: userId, deletedAt: null };
    } else if (type === 'received') {
      whereClause = { toUserId: userId, deletedAt: null };
    } else if (type === 'unread') {
      whereClause = { toUserId: userId, isRead: false, deletedAt: null };
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: whereClause,
        include: {
          fromUser: {
            select: { id: true, name: true, email: true },
          },
          toUser: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.message.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getMessageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const message = await prisma.message.findFirst({
      where: {
        id: parseInt(id, 10),
        OR: [
          { fromUserId: userId },
          { toUserId: userId },
        ],
        deletedAt: null,
      },
      include: {
        fromUser: {
          select: { id: true, name: true, email: true },
        },
        toUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    // Mark as read if user is the recipient
    if (message.toUserId === userId && !message.isRead) {
      await prisma.message.update({
        where: { id: message.id },
        data: { isRead: true },
      });
      message.isRead = true;
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Error getting message:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const { messageIds } = markAsReadSchema.parse(req.body);
    const userId = req.userId;

    // Only mark messages where user is the recipient
    const result = await prisma.message.updateMany({
      where: {
        id: { in: messageIds },
        toUserId: userId,
        isRead: false,
        deletedAt: null,
      },
      data: { isRead: true },
    });

    res.json({
      success: true,
      data: {
        markedAsRead: result.count,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }

    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Soft delete - only if user is sender or recipient
    const result = await prisma.message.updateMany({
      where: {
        id: parseInt(id, 10),
        OR: [
          { fromUserId: userId },
          { toUserId: userId },
        ],
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found or already deleted',
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const count = await prisma.message.count({
      where: {
        toUserId: userId,
        isRead: false,
        deletedAt: null,
      },
    });

    res.json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};