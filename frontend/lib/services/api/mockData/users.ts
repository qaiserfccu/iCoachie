// Mock data for users across all 22 roles
import type { User, UserRole } from '../types';

const generateUsers = (count: number): User[] => {
  const roles: UserRole[] = [
    'admin', 'coach', 'head-coach', 'parent', 'guardian', 'student',
    'accountant', 'front-desk', 'content-manager', 'medical', 'facility',
    'system-support', 'bookings-coordinator', 'maintenance', 'equipment',
    'security', 'cleaning', 'venue', 'ground', 'groundskeeper', 'academy-owner', 'club', 'freelancer'
  ];

  const firstNames = ['John', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa', 'James', 'Anna', 'Robert', 'Maria', 'Chris', 'Jennifer', 'Daniel', 'Laura', 'Matthew', 'Rachel', 'Andrew', 'Emily', 'Thomas', 'Jessica'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'White', 'Harris', 'Clark', 'Lewis', 'Lee'];

  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    email: `user${i + 1}@icoachie.com`,
    firstName: firstNames[i % firstNames.length],
    lastName: lastNames[i % lastNames.length],
    role: roles[i % roles.length],
    phone: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    status: i % 10 === 0 ? 'inactive' : 'active',
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

export const mockUsers = generateUsers(100);

export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter(user => user.role === role);
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};
