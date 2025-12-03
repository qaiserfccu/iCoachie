import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import { prisma, createTestUser, createTestClub } from './setup';
import authRoutes from '../src/controllers/authController';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication API', () => {
  let testClub: any;

  beforeEach(async () => {
    // Clean up database in correct order to avoid foreign key constraints
    await prisma.$executeRaw`TRUNCATE TABLE "files" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "reviews" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "bookings" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "messages" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "payments" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "evaluations" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "attendance" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "session_enrollments" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "sessions" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "students" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "coaches" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "user_roles" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "password_resets" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "profiles" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "clubs" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE`;

    // Create a test club for registration tests
    testClub = await createTestClub();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        role: 'PARENT',
        clubId: testClub.id, // Use the created test club
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(200); // API returns 200, not 201

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should reject registration with existing email', async () => {
      // Create a user first
      await createTestUser({ email: 'existing@example.com', clubId: testClub.id });

      const userData = {
        name: 'Jane Doe',
        email: 'existing@example.com',
        password: 'password123',
        role: 'COACH',
        clubId: testClub.id,
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Email already exists');
    });

    it('should validate required fields', async () => {
      const incompleteData = {
        email: 'test@example.com',
        // missing name, password, role, clubId
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with correct credentials', async () => {
      // Create a test user with known password hash
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const testUser = await createTestUser({
        email: 'login@test.com',
        passwordHash: hashedPassword,
      });

      const loginData = {
        email: 'login@test.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
    });

    it('should reject login with wrong password', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      
      await createTestUser({ 
        email: 'wrongpass@test.com',
        passwordHash: hashedPassword,
      });

      const loginData = {
        email: 'wrongpass@test.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should reject login with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@test.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});