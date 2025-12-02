/**
 * Unit Tests for Socket Service
 * 
 * Tests the real-time socket.io service functionality
 */

import { Server as SocketIOServer, Socket } from 'socket.io';
import { SocketService, AuthenticatedSocket } from '../../src/services/socketService';

// Mock the Prisma client
jest.mock('../../src/db', () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(),
    },
    message: {
      create: jest.fn(),
      count: jest.fn(),
    },
    session: {
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    student: {
      count: jest.fn(),
    },
    coach: {
      count: jest.fn(),
    },
    attendance: {
      upsert: jest.fn(),
      count: jest.fn(),
    },
    booking: {
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import prisma from '../../src/db';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('SocketService', () => {
  let mockIo: Partial<SocketIOServer>;
  let mockSocket: Partial<AuthenticatedSocket>;
  let connectionHandler: Function;
  let socketEventHandlers: Map<string, Function>;

  beforeEach(() => {
    jest.clearAllMocks();
    socketEventHandlers = new Map();

    // Create mock socket
    mockSocket = {
      id: 'socket-123',
      data: {
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'COACH',
          clubId: 1,
        },
        clubId: 1,
      },
      join: jest.fn(),
      emit: jest.fn(),
      on: jest.fn().mockImplementation((event: string, handler: Function) => {
        socketEventHandlers.set(event, handler);
      }),
    };

    // Create mock io server
    mockIo = {
      on: jest.fn().mockImplementation((event: string, handler: Function) => {
        if (event === 'connection') {
          connectionHandler = handler;
        }
      }),
      to: jest.fn().mockReturnThis() as any,
      emit: jest.fn(),
    };

    // Suppress console.log for cleaner test output
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should set up connection handler', () => {
      new SocketService(mockIo as SocketIOServer);

      expect(mockIo.on).toHaveBeenCalledWith('connection', expect.any(Function));
    });
  });

  describe('connection handling', () => {
    it('should join club room when clubId is present', () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      expect(mockSocket.join).toHaveBeenCalledWith('club-1');
    });

    it('should join user-specific room', () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      expect(mockSocket.join).toHaveBeenCalledWith('user-1');
    });

    it('should not join club room when clubId is null', () => {
      mockSocket.data = {
        user: { id: 1, name: 'Test', email: 'test@example.com', role: 'USER', clubId: null },
        clubId: null,
      };

      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      expect(mockSocket.join).not.toHaveBeenCalledWith(expect.stringContaining('club-'));
      expect(mockSocket.join).toHaveBeenCalledWith('user-1');
    });

    it('should set up event handlers on connection', () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      expect(mockSocket.on).toHaveBeenCalledWith('send-message', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('update-attendance', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('update-booking-status', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('update-session-status', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('get-dashboard-stats', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('mark-notification-read', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    });

    it('should handle disconnect event', () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      // Get the disconnect handler
      const disconnectHandler = socketEventHandlers.get('disconnect');
      expect(disconnectHandler).toBeDefined();

      // Call it to ensure no errors
      disconnectHandler!();

      // Verify console.log was called with disconnect message
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('disconnected'));
    });
  });

  describe('send-message handler', () => {
    it('should emit error when recipient not found', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      (mockPrisma.user.findFirst as jest.Mock).mockResolvedValue(null);

      const messageHandler = socketEventHandlers.get('send-message');
      await messageHandler!({ toUserId: 2, subject: 'Test', content: 'Hello' });

      expect(mockSocket.emit).toHaveBeenCalledWith('message-error', {
        error: 'Recipient not found or not in your club',
      });
    });

    it('should emit error when sending message to self', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      (mockPrisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

      const messageHandler = socketEventHandlers.get('send-message');
      await messageHandler!({ toUserId: 1, subject: 'Test', content: 'Hello' });

      expect(mockSocket.emit).toHaveBeenCalledWith('message-error', {
        error: 'Cannot send message to yourself',
      });
    });

    it('should successfully send message and emit events', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      const mockRecipient = { id: 2, name: 'Recipient' };
      const mockMessage = {
        id: 1,
        subject: 'Test',
        content: 'Hello',
        fromUser: { id: 1, name: 'Test User', email: 'test@example.com' },
        toUser: { id: 2, name: 'Recipient', email: 'recipient@example.com' },
      };

      (mockPrisma.user.findFirst as jest.Mock).mockResolvedValue(mockRecipient);
      (mockPrisma.message.create as jest.Mock).mockResolvedValue(mockMessage);

      const messageHandler = socketEventHandlers.get('send-message');
      await messageHandler!({ toUserId: 2, subject: 'Test', content: 'Hello' });

      expect(mockPrisma.message.create).toHaveBeenCalled();
      expect(mockSocket.emit).toHaveBeenCalledWith('message-sent', mockMessage);
      expect(mockIo.to).toHaveBeenCalledWith('user-2');
    });

    it('should emit error on database failure', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      (mockPrisma.user.findFirst as jest.Mock).mockRejectedValue(new Error('DB error'));

      const messageHandler = socketEventHandlers.get('send-message');
      await messageHandler!({ toUserId: 2, subject: 'Test', content: 'Hello' });

      expect(mockSocket.emit).toHaveBeenCalledWith('message-error', {
        error: 'Failed to send message',
      });
    });
  });

  describe('update-attendance handler', () => {
    it('should emit error when session not found', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      (mockPrisma.session.findFirst as jest.Mock).mockResolvedValue(null);

      const attendanceHandler = socketEventHandlers.get('update-attendance');
      await attendanceHandler!({ sessionId: 1, studentId: 1, status: 'PRESENT' });

      expect(mockSocket.emit).toHaveBeenCalledWith('attendance-error', {
        error: 'Session not found or access denied',
      });
    });

    it('should successfully update attendance and emit events', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      const mockSession = {
        id: 1,
        coach: { id: 2, name: 'Coach' },
      };
      const mockAttendance = {
        id: 1,
        sessionId: 1,
        studentId: 1,
        status: 'PRESENT',
        student: { id: 1, name: 'Student' },
        recorder: { id: 1, name: 'Test User' },
      };

      (mockPrisma.session.findFirst as jest.Mock).mockResolvedValue(mockSession);
      (mockPrisma.attendance.upsert as jest.Mock).mockResolvedValue(mockAttendance);

      const attendanceHandler = socketEventHandlers.get('update-attendance');
      await attendanceHandler!({ sessionId: 1, studentId: 1, status: 'PRESENT' });

      expect(mockPrisma.attendance.upsert).toHaveBeenCalled();
      expect(mockSocket.emit).toHaveBeenCalledWith('attendance-updated', mockAttendance);
      expect(mockIo.to).toHaveBeenCalledWith('club-1');
    });

    it('should emit error on database failure', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      (mockPrisma.session.findFirst as jest.Mock).mockRejectedValue(new Error('DB error'));

      const attendanceHandler = socketEventHandlers.get('update-attendance');
      await attendanceHandler!({ sessionId: 1, studentId: 1, status: 'PRESENT' });

      expect(mockSocket.emit).toHaveBeenCalledWith('attendance-error', {
        error: 'Failed to update attendance',
      });
    });
  });

  describe('update-booking-status handler', () => {
    it('should emit error when booking not found', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      (mockPrisma.booking.findFirst as jest.Mock).mockResolvedValue(null);

      const bookingHandler = socketEventHandlers.get('update-booking-status');
      await bookingHandler!({ bookingId: 1, status: 'CONFIRMED' });

      expect(mockSocket.emit).toHaveBeenCalledWith('booking-error', {
        error: 'Booking not found or access denied',
      });
    });

    it('should emit error on database failure', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      (mockPrisma.booking.findFirst as jest.Mock).mockRejectedValue(new Error('DB error'));

      const bookingHandler = socketEventHandlers.get('update-booking-status');
      await bookingHandler!({ bookingId: 1, status: 'CONFIRMED' });

      expect(mockSocket.emit).toHaveBeenCalledWith('booking-error', {
        error: 'Failed to update booking status',
      });
    });
  });

  describe('update-session-status handler', () => {
    it('should emit error when session not found', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      (mockPrisma.session.findFirst as jest.Mock).mockResolvedValue(null);

      const sessionHandler = socketEventHandlers.get('update-session-status');
      await sessionHandler!({ sessionId: 1, status: 'COMPLETED' });

      expect(mockSocket.emit).toHaveBeenCalledWith('session-error', {
        error: 'Session not found or access denied',
      });
    });

    it('should successfully update session status and emit events', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      const mockSession = { id: 1, coachId: 1 };
      const mockUpdatedSession = {
        id: 1,
        status: 'COMPLETED',
        coach: { id: 1, name: 'Test User' },
        club: { id: 1, name: 'Test Club' },
      };

      (mockPrisma.session.findFirst as jest.Mock).mockResolvedValue(mockSession);
      (mockPrisma.session.update as jest.Mock).mockResolvedValue(mockUpdatedSession);

      const sessionHandler = socketEventHandlers.get('update-session-status');
      await sessionHandler!({ sessionId: 1, status: 'COMPLETED' });

      expect(mockPrisma.session.update).toHaveBeenCalled();
      expect(mockSocket.emit).toHaveBeenCalledWith('session-status-updated', mockUpdatedSession);
      expect(mockIo.to).toHaveBeenCalledWith('club-1');
    });

    it('should emit error on database failure', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      (mockPrisma.session.findFirst as jest.Mock).mockRejectedValue(new Error('DB error'));

      const sessionHandler = socketEventHandlers.get('update-session-status');
      await sessionHandler!({ sessionId: 1, status: 'COMPLETED' });

      expect(mockSocket.emit).toHaveBeenCalledWith('session-error', {
        error: 'Failed to update session status',
      });
    });
  });

  describe('get-dashboard-stats handler', () => {
    it('should emit error when clubId is not present', async () => {
      mockSocket.data = {
        user: { id: 1, name: 'Test', email: 'test@example.com', role: 'USER', clubId: null },
        clubId: null,
      };

      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      const statsHandler = socketEventHandlers.get('get-dashboard-stats');
      await statsHandler!();

      expect(mockSocket.emit).toHaveBeenCalledWith('stats-error', {
        error: 'Club access required',
      });
    });

    it('should emit dashboard stats successfully', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      (mockPrisma.student.count as jest.Mock).mockResolvedValue(10);
      (mockPrisma.session.count as jest.Mock).mockResolvedValue(5);
      (mockPrisma.coach.count as jest.Mock).mockResolvedValue(3);
      (mockPrisma.attendance.count as jest.Mock).mockResolvedValue(8);
      (mockPrisma.message.count as jest.Mock).mockResolvedValue(2);
      (mockPrisma.booking.count as jest.Mock).mockResolvedValue(4);

      const statsHandler = socketEventHandlers.get('get-dashboard-stats');
      await statsHandler!();

      expect(mockSocket.emit).toHaveBeenCalledWith(
        'dashboard-stats',
        expect.objectContaining({
          totalStudents: 10,
        })
      );
    });

    it('should emit error on database failure', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      (mockPrisma.student.count as jest.Mock).mockRejectedValue(new Error('DB error'));

      const statsHandler = socketEventHandlers.get('get-dashboard-stats');
      await statsHandler!();

      expect(mockSocket.emit).toHaveBeenCalledWith('stats-error', {
        error: 'Failed to fetch dashboard stats',
      });
    });
  });

  describe('mark-notification-read handler', () => {
    it('should emit confirmation for notification marked as read', async () => {
      new SocketService(mockIo as SocketIOServer);
      connectionHandler(mockSocket);

      const notificationHandler = socketEventHandlers.get('mark-notification-read');
      await notificationHandler!({ notificationId: 123 });

      expect(mockSocket.emit).toHaveBeenCalledWith('notification-marked-read', {
        notificationId: 123,
      });
    });
  });

  describe('broadcastToClub', () => {
    it('should emit event to club room', () => {
      const service = new SocketService(mockIo as SocketIOServer);

      service.broadcastToClub(1, 'test-event', { data: 'test' });

      expect(mockIo.to).toHaveBeenCalledWith('club-1');
      expect(mockIo.emit).toHaveBeenCalledWith('test-event', { data: 'test' });
    });
  });

  describe('sendToUser', () => {
    it('should emit event to user room', () => {
      const service = new SocketService(mockIo as SocketIOServer);

      service.sendToUser(5, 'notification', { message: 'hello' });

      expect(mockIo.to).toHaveBeenCalledWith('user-5');
      expect(mockIo.emit).toHaveBeenCalledWith('notification', { message: 'hello' });
    });
  });
});
