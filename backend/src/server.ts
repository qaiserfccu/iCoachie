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
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
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
