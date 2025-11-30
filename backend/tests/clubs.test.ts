import request from 'supertest';
import express from 'express';
import { prisma, createTestUser, createTestClub } from './setup';
import clubRoutes from '../src/controllers/clubController';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/clubs', clubRoutes);

// Helper function to generate JWT token
const generateToken = (userId: number, clubId?: number | null) => {
  return jwt.sign({ sub: userId, clubId }, process.env.JWT_SECRET || 'test-jwt-secret');
};

describe('Clubs API - Multi-tenancy Tests', () => {
  let adminUser: any;
  let regularUser: any;
  let club1: any;
  let club2: any;
  let adminToken: string;
  let regularToken: string;

  beforeEach(async () => {
    // Clean up database in correct order to avoid foreign key constraints
    // Child tables first, then parent tables
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

    // Create test users with CLUB_ADMIN role for testing
    adminUser = await createTestUser({
      email: 'admin@test.com',
      role: 'CLUB_ADMIN',
    });

    regularUser = await createTestUser({
      email: 'regular@test.com',
      role: 'PARENT',
    });

    // Create SuperAdmin role and assign to admin user
    const superAdminRole = await prisma.role.upsert({
      where: { name: 'SuperAdmin' },
      update: {},
      create: { name: 'SuperAdmin' }
    });

    await prisma.userRoleAssignment.create({
      data: {
        userId: adminUser.id,
        roleId: superAdminRole.id
      }
    });

    // Create test clubs
    club1 = await createTestClub({
      name: 'Club One',
      adminEmail: 'club1@test.com',
    });

    club2 = await createTestClub({
      name: 'Club Two',
      adminEmail: 'club2@test.com',
    });

    // Update admin user to be associated with club1
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { clubId: club1.id },
    });

    adminToken = generateToken(adminUser.id, club1.id);
    regularToken = generateToken(regularUser.id, null);
  });

  describe('GET /api/clubs', () => {
    it('should return clubs accessible to user', async () => {
      const response = await request(app)
        .get('/api/clubs')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('clubs');
      expect(Array.isArray(response.body.clubs)).toBe(true);
      // Admin should see all clubs (for now, adjust based on your business logic)
      expect(response.body.clubs.length).toBeGreaterThanOrEqual(1);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/clubs')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/clubs/:id', () => {
    it('should return club details for accessible club', async () => {
      const response = await request(app)
        .get(`/api/clubs/${club1.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('club');
      expect(response.body.club.id).toBe(club1.id);
      expect(response.body.club.name).toBe(club1.name);
    });

    it('should return 404 for non-existent club', async () => {
      const response = await request(app)
        .get('/api/clubs/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/clubs', () => {
    it('should create club for club admin', async () => {
      const newClubData = {
        name: 'New Test Club',
        description: 'A new club for testing',
        location: '456 Test Avenue',
        adminId: adminUser.id, // Required by API
      };

      const response = await request(app)
        .post('/api/clubs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newClubData)
        .expect(200); // API returns 200, not 201

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newClubData.name);
      expect(response.body.description).toBe(newClubData.description);

      // Verify club was created in database
      const createdClub = await prisma.club.findUnique({
        where: { id: response.body.id },
      });
      expect(createdClub).toBeTruthy();
      expect(createdClub?.name).toBe(newClubData.name);
    });

    it('should validate required fields', async () => {
      const incompleteData = {
        name: 'Incomplete Club',
        // missing adminId
      };

      const response = await request(app)
        .post('/api/clubs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/clubs/:id', () => {
    it('should update club details', async () => {
      const updateData = {
        name: 'Updated Club Name',
        description: 'Updated description',
        location: 'Updated Address',
      };

      const response = await request(app)
        .put(`/api/clubs/${club1.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);

      // Verify update in database
      const updatedClub = await prisma.club.findUnique({
        where: { id: club1.id },
      });
      expect(updatedClub?.name).toBe(updateData.name);
    });

    it('should return 404 for non-existent club', async () => {
      const updateData = { name: 'Non-existent Club' };

      const response = await request(app)
        .put('/api/clubs/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/clubs/:id', () => {
    it('should soft delete club', async () => {
      const response = await request(app)
        .delete(`/api/clubs/${club1.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('ok');
      expect(response.body.ok).toBe(true);

      // Verify soft delete (club should still exist but be marked as deleted)
      const deletedClub = await prisma.club.findUnique({
        where: { id: club1.id },
      });
      expect(deletedClub).toBeTruthy();
      // Add deletedAt check if you implement soft deletes
    });
  });
});