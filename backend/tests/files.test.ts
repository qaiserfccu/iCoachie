import request from 'supertest';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma, createTestUser, createTestClub } from './setup';
import fileRoutes from '../src/routes/fileRoutes';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

// Setup multer for testing
const upload = multer({ dest: 'uploads/test/' });
app.use('/api/files', fileRoutes);

// Helper function to generate JWT token
const generateToken = (userId: number, clubId: number) => {
  return jwt.sign({ sub: userId, clubId }, process.env.JWT_SECRET || 'test-jwt-secret');
};

describe('File Upload API', () => {
  let testUser: any;
  let testClub: any;
  let token: string;

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

    // Create test data
    testClub = await createTestClub();
    testUser = await createTestUser({ clubId: testClub.id });
    token = generateToken(testUser.id, testClub.id);

    // Ensure upload directory exists
    const uploadDir = path.join(__dirname, '../../uploads/test');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  });

  afterEach(async () => {
    // Clean up uploaded files
    const uploadDir = path.join(__dirname, '../../uploads/test');
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      files.forEach(file => {
        const filePath = path.join(uploadDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
    }
  });

  describe('POST /api/files/upload', () => {
    it('should upload a file successfully', async () => {
      const testFilePath = path.join(__dirname, '../fixtures/test-image.jpg');

      // Create a test file if it doesn't exist
      if (!fs.existsSync(testFilePath)) {
        const testDir = path.dirname(testFilePath);
        if (!fs.existsSync(testDir)) {
          fs.mkdirSync(testDir, { recursive: true });
        }
        // Create a minimal test file
        fs.writeFileSync(testFilePath, 'fake image content');
      }

      const response = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${token}`)
        .field('fileType', 'AVATAR')
        .field('isPublic', 'true')
        .attach('file', testFilePath)
        .expect(201);

      expect(response.body).toHaveProperty('file');
      expect(response.body.file).toHaveProperty('id');
      expect(response.body.file).toHaveProperty('filename');
      expect(response.body.file).toHaveProperty('fileType', 'AVATAR');
      expect(response.body.file).toHaveProperty('isPublic', true);
      expect(response.body.file).toHaveProperty('uploadedBy', testUser.id);
      expect(response.body.file).toHaveProperty('clubId', testClub.id);

      // Verify file was saved in database
      const savedFile = await prisma.file.findUnique({
        where: { id: response.body.file.id },
      });
      expect(savedFile).toBeTruthy();
      expect(savedFile?.fileType).toBe('AVATAR');
    });

    it('should reject upload without authentication', async () => {
      const response = await request(app)
        .post('/api/files/upload')
        .field('fileType', 'DOCUMENT')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should validate file type', async () => {
      const response = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${token}`)
        .field('fileType', 'INVALID_TYPE')
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should handle file size limits', async () => {
      // Create a large test file (11MB to exceed 10MB limit)
      const largeFilePath = path.join(__dirname, '../fixtures/large-file.txt');
      const largeDir = path.dirname(largeFilePath);
      if (!fs.existsSync(largeDir)) {
        fs.mkdirSync(largeDir, { recursive: true });
      }
      // Create a file larger than the limit (11MB)
      const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
      fs.writeFileSync(largeFilePath, largeContent);

      const response = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${token}`)
        .field('fileType', 'DOCUMENT')
        .attach('file', largeFilePath)
        .expect(400);

      expect(response.body).toHaveProperty('message');

      // Clean up
      fs.unlinkSync(largeFilePath);
    });
  });

  describe('GET /api/files/token/:token', () => {
    it('should serve file by token', async () => {
      // First upload a file
      const testFilePath = path.join(__dirname, '../fixtures/test-doc.pdf');
      const testDir = path.dirname(testFilePath);
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
      fs.writeFileSync(testFilePath, 'fake pdf content');

      const uploadResponse = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${token}`)
        .field('fileType', 'DOCUMENT')
        .field('isPublic', 'true')
        .attach('file', testFilePath)
        .expect(201);

      const fileId = uploadResponse.body.file.id;

      // Get file token
      const tokenResponse = await request(app)
        .get(`/api/files/${fileId}/token`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const fileToken = tokenResponse.body.token;

      // Serve file using token
      const serveResponse = await request(app)
        .get(`/api/files/token/${fileToken}`)
        .expect(200);

      expect(serveResponse.headers['content-type']).toBe('application/pdf');
      expect(serveResponse.body).toBeInstanceOf(Buffer);

      // Clean up
      fs.unlinkSync(testFilePath);
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/files/token/invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/files/user', () => {
    it('should list user files', async () => {
      // Upload a couple of files first
      const testFilePath = path.join(__dirname, '../fixtures/test-file.txt');
      const testDir = path.dirname(testFilePath);
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
      fs.writeFileSync(testFilePath, 'test content');

      await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${token}`)
        .field('fileType', 'DOCUMENT')
        .attach('file', testFilePath)
        .expect(201);

      await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${token}`)
        .field('fileType', 'AVATAR')
        .attach('file', testFilePath)
        .expect(201);

      // List user files
      const response = await request(app)
        .get('/api/files/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('files');
      expect(Array.isArray(response.body.files)).toBe(true);
      expect(response.body.files.length).toBe(2);

      // Clean up
      fs.unlinkSync(testFilePath);
    });
  });
});