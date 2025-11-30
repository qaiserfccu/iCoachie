import { Server as SocketIOServer, Socket } from 'socket.io';
import prisma from '../db';

export interface AuthenticatedSocket extends Socket {
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      clubId: number | null;
    };
    clubId: number | null;
  };
}

export class SocketService {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      const user = socket.data.user;
      const clubId = socket.data.clubId;

      console.log(`User ${user.id} (${user.name}) connected from club ${clubId}`);

      // Join tenant-specific room for club-wide broadcasts
      if (clubId) {
        socket.join(`club-${clubId}`);
      }

      // Join user-specific room for personal messages
      socket.join(`user-${user.id}`);

      // Handle real-time messaging
      socket.on('send-message', (data) => this.handleSendMessage(socket, data));

      // Handle attendance updates
      socket.on('update-attendance', (data) => this.handleUpdateAttendance(socket, data));

      // Handle booking updates
      socket.on('update-booking-status', (data) => this.handleUpdateBookingStatus(socket, data));

      // Handle session status updates
      socket.on('update-session-status', (data) => this.handleUpdateSessionStatus(socket, data));

      // Handle dashboard stats requests
      socket.on('get-dashboard-stats', () => this.handleGetDashboardStats(socket));

      // Handle notifications
      socket.on('mark-notification-read', (data) => this.handleMarkNotificationRead(socket, data));

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User ${user.id} disconnected`);
      });
    });
  }

  private async handleSendMessage(socket: AuthenticatedSocket, data: any) {
    try {
      const { toUserId, subject, content } = data;
      const user = socket.data.user;
      const clubId = socket.data.clubId;

      // Verify recipient exists and is in the same club
      const recipient = await prisma.user.findFirst({
        where: {
          id: toUserId,
          clubId: clubId,
          deletedAt: null,
        },
      });

      if (!recipient) {
        socket.emit('message-error', { error: 'Recipient not found or not in your club' });
        return;
      }

      // Prevent sending messages to self
      if (user.id === toUserId) {
        socket.emit('message-error', { error: 'Cannot send message to yourself' });
        return;
      }

      const message = await prisma.message.create({
        data: {
          fromUserId: user.id,
          toUserId,
          subject,
          content,
        },
        include: {
          fromUser: { select: { id: true, name: true, email: true } },
          toUser: { select: { id: true, name: true, email: true } },
        },
      });

      // Send to recipient's room
      this.io.to(`user-${toUserId}`).emit('new-message', message);

      // Send confirmation to sender
      socket.emit('message-sent', message);

      // Send notification to recipient
      this.sendNotification(toUserId, {
        type: 'message',
        title: 'New Message',
        message: `You have a new message from ${user.name}`,
        data: { messageId: message.id }
      });

    } catch (error) {
      console.error('Socket message error:', error);
      socket.emit('message-error', { error: 'Failed to send message' });
    }
  }

  private async handleUpdateAttendance(socket: AuthenticatedSocket, data: any) {
    try {
      const { sessionId, studentId, status } = data;
      const user = socket.data.user;
      const clubId = socket.data.clubId;

      // Verify session belongs to user's club
      const session = await prisma.session.findFirst({
        where: {
          id: sessionId,
          clubId: clubId,
          deletedAt: null,
        },
        include: {
          coach: { select: { id: true, name: true } },
        },
      });

      if (!session) {
        socket.emit('attendance-error', { error: 'Session not found or access denied' });
        return;
      }

      const attendance = await prisma.attendance.upsert({
        where: {
          sessionId_studentId: {
            sessionId,
            studentId,
          },
        },
        update: {
          status,
          recordedBy: user.id,
          recordedAt: new Date(),
        },
        create: {
          sessionId,
          studentId,
          status,
          recordedBy: user.id,
        },
        include: {
          student: { select: { id: true, name: true } },
          recorder: { select: { id: true, name: true } },
        },
      });

      // Broadcast attendance update to club room
      if (clubId) {
        this.io.to(`club-${clubId}`).emit('attendance-updated', {
          sessionId,
          attendance,
        });
      }

      // Notify coach if attendance was recorded by someone else
      if (session.coach.id !== user.id) {
        this.sendNotification(session.coach.id, {
          type: 'attendance',
          title: 'Attendance Updated',
          message: `Attendance recorded for ${attendance.student.name} in session`,
          data: { sessionId, studentId, status }
        });
      }

      socket.emit('attendance-updated', attendance);
    } catch (error) {
      console.error('Socket attendance error:', error);
      socket.emit('attendance-error', { error: 'Failed to update attendance' });
    }
  }

  private async handleUpdateBookingStatus(socket: AuthenticatedSocket, data: any) {
    try {
      const { bookingId, status } = data;
      const user = socket.data.user;
      const clubId = socket.data.clubId;

      // Find booking and verify access
      const booking = await prisma.booking.findFirst({
        where: {
          id: bookingId,
          OR: [
            { freelancerId: user.id },
            { clientId: user.id },
          ],
          deletedAt: null,
        },
        include: {
          freelancer: { select: { id: true, name: true, clubId: true } },
          client: { select: { id: true, name: true, clubId: true } },
        },
      });

      if (!booking) {
        socket.emit('booking-error', { error: 'Booking not found or access denied' });
        return;
      }

      // Verify tenant isolation
      if (booking.freelancer.clubId !== clubId && booking.client.clubId !== clubId) {
        socket.emit('booking-error', { error: 'Access denied' });
        return;
      }

      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status },
        include: {
          freelancer: { select: { id: true, name: true } },
          client: { select: { id: true, name: true } },
        },
      });

      // Notify both parties
      this.io.to(`user-${booking.freelancerId}`).emit('booking-updated', updatedBooking);
      this.io.to(`user-${booking.clientId}`).emit('booking-updated', updatedBooking);

      // Send notifications
      const otherParty = booking.freelancerId === user.id ? booking.client : booking.freelancer;
      this.sendNotification(otherParty.id, {
        type: 'booking',
        title: 'Booking Status Updated',
        message: `Your booking status has been updated to ${status}`,
        data: { bookingId }
      });

      socket.emit('booking-status-updated', updatedBooking);
    } catch (error) {
      console.error('Socket booking error:', error);
      socket.emit('booking-error', { error: 'Failed to update booking status' });
    }
  }

  private async handleUpdateSessionStatus(socket: AuthenticatedSocket, data: any) {
    try {
      const { sessionId, status } = data;
      const user = socket.data.user;
      const clubId = socket.data.clubId;

      // Verify session belongs to user's club and user is the coach
      const session = await prisma.session.findFirst({
        where: {
          id: sessionId,
          coachId: user.id,
          clubId: clubId,
          deletedAt: null,
        },
      });

      if (!session) {
        socket.emit('session-error', { error: 'Session not found or access denied' });
        return;
      }

      const updatedSession = await prisma.session.update({
        where: { id: sessionId },
        data: { status },
        include: {
          coach: { select: { id: true, name: true } },
          club: { select: { id: true, name: true } },
        },
      });

      // Broadcast session status update to club room
      if (clubId) {
        this.io.to(`club-${clubId}`).emit('session-status-updated', {
          sessionId,
          session: updatedSession,
        });
      }

      socket.emit('session-status-updated', updatedSession);
    } catch (error) {
      console.error('Socket session error:', error);
      socket.emit('session-error', { error: 'Failed to update session status' });
    }
  }

  private async handleGetDashboardStats(socket: AuthenticatedSocket) {
    try {
      const user = socket.data.user;
      const clubId = socket.data.clubId;

      if (!clubId) {
        socket.emit('stats-error', { error: 'Club access required' });
        return;
      }

      const [
        totalStudents,
        totalSessions,
        totalCoaches,
        upcomingSessions,
        recentAttendance,
        unreadMessages,
        activeBookings,
        completedSessions,
      ] = await Promise.all([
        prisma.student.count({
          where: { clubId: clubId, deletedAt: null },
        }),
        prisma.session.count({
          where: { clubId: clubId, deletedAt: null },
        }),
        prisma.coach.count({
          where: { clubId: clubId, deletedAt: null },
        }),
        prisma.session.count({
          where: {
            clubId: clubId,
            sessionDate: { gte: new Date() },
            deletedAt: null,
          },
        }),
        prisma.attendance.count({
          where: {
            student: { clubId: clubId },
            recordedAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        }),
        prisma.message.count({
          where: {
            toUserId: user.id,
            isRead: false,
            deletedAt: null,
          },
        }),
        prisma.booking.count({
          where: {
            OR: [
              { freelancer: { clubId: clubId } },
              { client: { clubId: clubId } },
            ],
            status: { in: ['PENDING', 'CONFIRMED'] },
            deletedAt: null,
          },
        }),
        prisma.session.count({
          where: {
            clubId: clubId,
            status: 'COMPLETED',
            deletedAt: null,
          },
        }),
      ]);

      const stats = {
        totalStudents,
        totalSessions,
        totalCoaches,
        upcomingSessions,
        recentAttendance,
        unreadMessages,
        activeBookings,
        completedSessions,
        attendanceRate: totalSessions > 0 ? Math.round((recentAttendance / totalSessions) * 100) : 0,
      };

      socket.emit('dashboard-stats', stats);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      socket.emit('stats-error', { error: 'Failed to fetch dashboard stats' });
    }
  }

  private async handleMarkNotificationRead(socket: AuthenticatedSocket, data: any) {
    try {
      const { notificationId } = data;
      const user = socket.data.user;

      // In a real implementation, you'd have a notifications table
      // For now, we'll just emit a confirmation
      socket.emit('notification-marked-read', { notificationId });
    } catch (error) {
      console.error('Mark notification read error:', error);
      socket.emit('notification-error', { error: 'Failed to mark notification as read' });
    }
  }

  // Utility method to send notifications
  private sendNotification(userId: number, notification: any) {
    this.io.to(`user-${userId}`).emit('notification', notification);
  }

  // Public method to broadcast to club
  public broadcastToClub(clubId: number, event: string, data: any) {
    this.io.to(`club-${clubId}`).emit(event, data);
  }

  // Public method to send to specific user
  public sendToUser(userId: number, event: string, data: any) {
    this.io.to(`user-${userId}`).emit(event, data);
  }
}