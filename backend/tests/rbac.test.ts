import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma as testPrisma, resetDatabase } from './setup';
import rbacTestRoutes from '../src/controllers/rbacTestController';
import facilityRoutes from '../src/controllers/facilityController';
import { buildPermissionMap } from '../prisma/data/permissions';
import { RoleScope } from '../src/middleware/rbac';
import appPrisma from '../src/db';

const app = express();
app.use(express.json());
app.use('/api/rbac/test', rbacTestRoutes);
app.use('/api/facilities', facilityRoutes);

const ROLE_SCOPES: Record<string, RoleScope> = {
  SUPER_ADMIN: 'GLOBAL',
  CLUB_ADMIN: 'CLUB',
  VENUE_MANAGER: 'VENUE',
  PARENT: 'USER',
};

const generateToken = (userId: number, clubId?: number | null) => {
  return jwt.sign({ sub: userId, clubId }, process.env.JWT_SECRET || 'test-jwt-secret');
};

let activeStatusId: number;
let testClubId: number;

async function ensureRole(code: keyof typeof ROLE_SCOPES) {
  const scope = ROLE_SCOPES[code];
  await testPrisma.role.upsert({
    where: { code },
    update: {
      name: code,
      description: `${code} role`,
      scope,
      permissions: buildPermissionMap(code),
      isActive: true,
    },
    create: {
      code,
      name: code,
      description: `${code} role`,
      scope,
      permissions: buildPermissionMap(code),
      sortOrder: 0,
    },
  });
}

async function seedLookupData() {
  const status = await testPrisma.userStatus.upsert({
    where: { code: 'ACTIVE' },
    update: { name: 'Active', sortOrder: 1 },
    create: { code: 'ACTIVE', name: 'Active', sortOrder: 1 },
  });
  activeStatusId = status.id;

  await Promise.all(Object.keys(ROLE_SCOPES).map((code) => ensureRole(code as keyof typeof ROLE_SCOPES)));
}

async function createUserWithRole(roleCode: keyof typeof ROLE_SCOPES, clubId: number | null) {
  const role = await testPrisma.role.findUnique({ where: { code: roleCode } });
  if (!role) throw new Error(`Missing role ${roleCode}`);
  if (!activeStatusId) throw new Error('Active status not seeded');

  const uniqueKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return testPrisma.user.create({
    data: {
      name: `${roleCode} User`,
      email: `${roleCode.toLowerCase()}-${uniqueKey}@test.com`,
      passwordHash: 'hashed-password',
      primaryRoleId: role.id,
      statusId: activeStatusId,
      clubId,
    },
  });
}

async function createClubFixture() {
  const adminUser = await createUserWithRole('CLUB_ADMIN', null);
  const club = await testPrisma.club.create({
    data: {
      name: `RBAC Test Club ${Date.now()}`,
      adminId: adminUser.id,
      description: 'RBAC test club',
      location: 'Test City',
    },
  });

  await testPrisma.user.update({ where: { id: adminUser.id }, data: { clubId: club.id } });
  testClubId = club.id;
}

describe('RBAC smoke tests', () => {
  beforeEach(async () => {
    await resetDatabase();
    await seedLookupData();
    await createClubFixture();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('RBAC test harness endpoints', () => {
    it('allows only SUPER_ADMIN to access /api/rbac/test/role', async () => {
      const superAdmin = await createUserWithRole('SUPER_ADMIN', testClubId);
      const clubAdmin = await createUserWithRole('CLUB_ADMIN', testClubId);

      await request(app)
        .get('/api/rbac/test/role')
        .set('Authorization', `Bearer ${generateToken(superAdmin.id, testClubId)}`)
        .expect(200);

      await request(app)
        .get('/api/rbac/test/role')
        .set('Authorization', `Bearer ${generateToken(clubAdmin.id, testClubId)}`)
        .expect(403);
    });

    it('enforces scope checks at /api/rbac/test/scope', async () => {
      const clubAdmin = await createUserWithRole('CLUB_ADMIN', testClubId);
      const parentUser = await createUserWithRole('PARENT', testClubId);

      await request(app)
        .get('/api/rbac/test/scope')
        .set('Authorization', `Bearer ${generateToken(clubAdmin.id, testClubId)}`)
        .expect(200);

      await request(app)
        .get('/api/rbac/test/scope')
        .set('Authorization', `Bearer ${generateToken(parentUser.id, testClubId)}`)
        .expect(403);
    });

    it('requires explicit permissions at /api/rbac/test/permission', async () => {
      const venueManager = await createUserWithRole('VENUE_MANAGER', testClubId);
      const parentUser = await createUserWithRole('PARENT', testClubId);

      await request(app)
        .get('/api/rbac/test/permission')
        .set('Authorization', `Bearer ${generateToken(venueManager.id, testClubId)}`)
        .expect(200);

      await request(app)
        .get('/api/rbac/test/permission')
        .set('Authorization', `Bearer ${generateToken(parentUser.id, testClubId)}`)
        .expect(403);
    });
  });

  describe('Facility RBAC routes', () => {
    it('allows SUPER_ADMIN to delete a facility', async () => {
      const superAdmin = await createUserWithRole('SUPER_ADMIN', testClubId);
      const token = generateToken(superAdmin.id, testClubId);

      const findUniqueSpy = jest
        .spyOn(appPrisma.facility, 'findUnique')
        .mockResolvedValue({ clubId: testClubId, deletedAt: null } as any);
      const updateSpy = jest.spyOn(appPrisma.facility, 'update').mockResolvedValue({} as any);

      await request(app)
        .delete('/api/facilities/100')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(findUniqueSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalled();
    });

    it('blocks non-super-admins from deleting a facility', async () => {
      const parentUser = await createUserWithRole('PARENT', testClubId);
      const token = generateToken(parentUser.id, testClubId);
      const findUniqueSpy = jest.spyOn(appPrisma.facility, 'findUnique');

      await request(app)
        .delete('/api/facilities/100')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(findUniqueSpy).not.toHaveBeenCalled();
    });

    it('requires VENUE scope to create a venue', async () => {
      const venueManager = await createUserWithRole('VENUE_MANAGER', testClubId);
      const token = generateToken(venueManager.id, testClubId);

      jest
        .spyOn(appPrisma.facility, 'findUnique')
        .mockResolvedValue({ clubId: testClubId } as any);
      const venueSpy = jest.spyOn(appPrisma.venue, 'create').mockResolvedValue({
        id: 501,
        name: 'Court A',
        type: 'INDOOR',
        facilityId: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      await request(app)
        .post('/api/facilities/123/venues')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Court A', type: 'INDOOR' })
        .expect(201);

      expect(venueSpy).toHaveBeenCalled();
    });

    it('prevents user-scoped roles from creating venues', async () => {
      const parentUser = await createUserWithRole('PARENT', testClubId);
      const token = generateToken(parentUser.id, testClubId);
      const findUniqueSpy = jest.spyOn(appPrisma.facility, 'findUnique');

      await request(app)
        .post('/api/facilities/123/venues')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Court A', type: 'INDOOR' })
        .expect(403);

      expect(findUniqueSpy).not.toHaveBeenCalled();
    });
  });
});
