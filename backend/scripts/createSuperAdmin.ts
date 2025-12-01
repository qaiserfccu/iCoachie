import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    console.log('Creating superadmin user...');

    // Check if superadmin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'superadmin@icouchie.local' }
    });

    if (existingUser) {
      console.log('Superadmin user already exists!');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('12345@', 10);

    // Create superadmin user
    const user = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'superadmin@icouchie.local',
        passwordHash: hashedPassword,
        role: 'CLUB_ADMIN', // Using CLUB_ADMIN as the role
        status: 'ACTIVE',
        profile: {
          create: {
            displayName: 'Super Admin',
          }
        }
      }
    });

    // Create a special club for the superadmin
    const club = await prisma.club.create({
      data: {
        name: 'iCoachie System Administration',
        location: 'System',
        description: 'System administration club for superadmin',
        adminId: user.id
      }
    });

    // Update user with clubId
    await prisma.user.update({
      where: { id: user.id },
      data: { clubId: club.id }
    });

    // Create role record
    const roleRecord = await prisma.role.upsert({
      where: { name: 'CLUB_ADMIN' },
      update: {},
      create: { name: 'CLUB_ADMIN' }
    });

    // Create user role assignment
    await prisma.userRoleAssignment.create({
      data: {
        userId: user.id,
        roleId: roleRecord.id
      }
    });

    console.log('Superadmin user created successfully!');
    console.log('Email: superadmin@icouchie.local');
    console.log('Password: 12345@');
    console.log('Role: CLUB_ADMIN (Super Admin)');

  } catch (error) {
    console.error('Error creating superadmin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createSuperAdmin();