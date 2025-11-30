import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
import legacyRoutes from './controllers/legacyController';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
// Configure CORS for local dev / frontend apps
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'iCoachie Backend (TypeScript) running' });
});
app.use('/api/legacy', legacyRoutes);

app.listen(port, () => {
  console.log(`iCoachie Backend (TypeScript) listening on port ${port}`);
});
