import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import prisma from './db';
import { SocketService } from './services/socketService';
import { swaggerUi, specs } from './swagger';
import authRoutes from './controllers/authController';
import userRoutes from './controllers/userController';
import clubRoutes from './controllers/clubController';
import studentRoutes from './controllers/studentController';
import sessionRoutes from './controllers/sessionController';
import attendanceRoutes from './controllers/attendanceController';
import evaluationRoutes from './controllers/evaluationController';
import paymentRoutes from './controllers/paymentController';
import messageRoutes from './controllers/messageController';
import bookingRoutes from './controllers/bookingController';
import reviewRoutes from './controllers/reviewController';
import coachRoutes from './controllers/coachController';
import statusRoutes from './controllers/statusController';
import rbacTestRoutes from './controllers/rbacTestController';
import facilityRoutes from './controllers/facilityController';
import adminRoutes from './controllers/adminController';
import settingsRoutes from './controllers/settingsController';
import emailTemplateRoutes from './controllers/emailTemplateController';
import systemSupportRoutes from './controllers/systemSupportController';
import equipmentRoutes from './controllers/equipmentController';
import securityRoutes from './controllers/securityController';
import cleaningRoutes from './controllers/cleaningController';
import medicalRoutes from './controllers/medicalController';
import contentManagerRoutes from './controllers/contentManagerController';
import frontDeskRoutes from './controllers/frontDeskController';
import accountantRoutes from './controllers/accountantController';
import maintenanceRoutes from './controllers/maintenanceController';
import groundskeeperRoutes from './controllers/groundskeeperController';
import bookingsCoordinatorRoutes from './controllers/bookingsCoordinatorController';
import fileRoutes from './routes/fileRoutes';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: function (origin, callback) {
      // allow requests with no origin (like curl, server-to-server)
      if (!origin) return callback(null, true)
      const allowedOrigins = process.env.ALLOWEDORIGINS || [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:4000'
      ]
      if (allowedOrigins.indexOf(origin as string) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Configure CORS for Express
const allowedOrigins = process.env.ALLOWEDORIGINS || [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:4000'
]
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, server-to-server)
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin as string) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
  exposedHeaders: ['Authorization']
}))
app.use(express.json());

// Stripe webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/rbac/test', rbacTestRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admin/email-templates', emailTemplateRoutes);
app.use('/api/system-support', systemSupportRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/cleaning', cleaningRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/content-manager', contentManagerRoutes);
app.use('/api/front-desk', frontDeskRoutes);
app.use('/api/accountant', accountantRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/groundskeeper', groundskeeperRoutes);
app.use('/api/bookings-coordinator', bookingsCoordinatorRoutes);
app.use('/api/files', fileRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'iCoachie Backend (TypeScript) running' });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Socket.IO Authentication Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = typeof decoded.sub !== 'undefined' ? Number(decoded.sub) : undefined;
    if (!userId || Number.isNaN(userId)) {
      return next(new Error('Authentication failed'))
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { club: true }
    });

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.data.user = user;
    socket.data.clubId = user.clubId;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

// Initialize Socket Service
const socketService = new SocketService(io);

// Export socket service for use in other modules
export { socketService };

server.listen(port, () => {
  console.log(`iCoachie Backend (TypeScript) listening on port ${port}`);
});
server.on('error', (err) => {
  if (err.message === 'EADDRINUSE') {
    console.log(`iCoachie Backend (TypeScript) already listening on port ${port}`);
    process.exit(1);
  }
});
