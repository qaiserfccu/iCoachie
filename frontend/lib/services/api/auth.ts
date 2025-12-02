// Mock JWT Authentication Service - matches backend implementation
import type { User, UserRole } from './types';

// JWT Secret for mock implementation
const MOCK_JWT_SECRET = 'mock-secret-key';

// Mock user credentials for each role
export interface MockUserCredentials {
  email: string;
  password: string;
  user: Omit<User, 'createdAt' | 'updatedAt'>;
}

export const mockUserCredentials: Record<UserRole, MockUserCredentials> = {
  'admin': {
    email: 'admin@icoachie.com',
    password: 'admin123',
    user: {
      id: 'user-admin-1',
      email: 'admin@icoachie.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '+1 555-100-0001',
      status: 'active',
    }
  },
  'coach': {
    email: 'coach@icoachie.com',
    password: 'coach123',
    user: {
      id: 'user-coach-1',
      email: 'coach@icoachie.com',
      firstName: 'John',
      lastName: 'Coach',
      role: 'coach',
      phone: '+1 555-100-0002',
      status: 'active',
    }
  },
  'head-coach': {
    email: 'headcoach@icoachie.com',
    password: 'headcoach123',
    user: {
      id: 'user-headcoach-1',
      email: 'headcoach@icoachie.com',
      firstName: 'Michael',
      lastName: 'Williams',
      role: 'head-coach',
      phone: '+1 555-100-0003',
      status: 'active',
    }
  },
  'parent': {
    email: 'parent@icoachie.com',
    password: 'parent123',
    user: {
      id: 'user-parent-1',
      email: 'parent@icoachie.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'parent',
      phone: '+1 555-100-0004',
      status: 'active',
    }
  },
  'guardian': {
    email: 'guardian@icoachie.com',
    password: 'guardian123',
    user: {
      id: 'user-guardian-1',
      email: 'guardian@icoachie.com',
      firstName: 'Emily',
      lastName: 'Davis',
      role: 'guardian',
      phone: '+1 555-100-0005',
      status: 'active',
    }
  },
  'student': {
    email: 'student@icoachie.com',
    password: 'student123',
    user: {
      id: 'user-student-1',
      email: 'student@icoachie.com',
      firstName: 'Jake',
      lastName: 'Miller',
      role: 'student',
      phone: '+1 555-100-0006',
      status: 'active',
    }
  },
  'accountant': {
    email: 'accountant@icoachie.com',
    password: 'accountant123',
    user: {
      id: 'user-accountant-1',
      email: 'accountant@icoachie.com',
      firstName: 'Linda',
      lastName: 'Chen',
      role: 'accountant',
      phone: '+1 555-100-0007',
      status: 'active',
    }
  },
  'front-desk': {
    email: 'frontdesk@icoachie.com',
    password: 'frontdesk123',
    user: {
      id: 'user-frontdesk-1',
      email: 'frontdesk@icoachie.com',
      firstName: 'Rachel',
      lastName: 'Green',
      role: 'front-desk',
      phone: '+1 555-100-0008',
      status: 'active',
    }
  },
  'content-manager': {
    email: 'contentmanager@icoachie.com',
    password: 'contentmanager123',
    user: {
      id: 'user-contentmanager-1',
      email: 'contentmanager@icoachie.com',
      firstName: 'Monica',
      lastName: 'Taylor',
      role: 'content-manager',
      phone: '+1 555-100-0009',
      status: 'active',
    }
  },
  'medical': {
    email: 'medical@icoachie.com',
    password: 'medical123',
    user: {
      id: 'user-medical-1',
      email: 'medical@icoachie.com',
      firstName: 'Dr. Robert',
      lastName: 'Smith',
      role: 'medical',
      phone: '+1 555-100-0010',
      status: 'active',
    }
  },
  'facility': {
    email: 'facility@icoachie.com',
    password: 'facility123',
    user: {
      id: 'user-facility-1',
      email: 'facility@icoachie.com',
      firstName: 'Tom',
      lastName: 'Anderson',
      role: 'facility',
      phone: '+1 555-100-0011',
      status: 'active',
    }
  },
  'system-support': {
    email: 'support@icoachie.com',
    password: 'support123',
    user: {
      id: 'user-support-1',
      email: 'support@icoachie.com',
      firstName: 'David',
      lastName: 'Wilson',
      role: 'system-support',
      phone: '+1 555-100-0012',
      status: 'active',
    }
  },
  'bookings-coordinator': {
    email: 'bookings@icoachie.com',
    password: 'bookings123',
    user: {
      id: 'user-bookings-1',
      email: 'bookings@icoachie.com',
      firstName: 'Amy',
      lastName: 'Brown',
      role: 'bookings-coordinator',
      phone: '+1 555-100-0013',
      status: 'active',
    }
  },
  'maintenance': {
    email: 'maintenance@icoachie.com',
    password: 'maintenance123',
    user: {
      id: 'user-maintenance-1',
      email: 'maintenance@icoachie.com',
      firstName: 'Mark',
      lastName: 'Thompson',
      role: 'maintenance',
      phone: '+1 555-100-0014',
      status: 'active',
    }
  },
  'equipment': {
    email: 'equipment@icoachie.com',
    password: 'equipment123',
    user: {
      id: 'user-equipment-1',
      email: 'equipment@icoachie.com',
      firstName: 'Steve',
      lastName: 'Garcia',
      role: 'equipment',
      phone: '+1 555-100-0015',
      status: 'active',
    }
  },
  'security': {
    email: 'security@icoachie.com',
    password: 'security123',
    user: {
      id: 'user-security-1',
      email: 'security@icoachie.com',
      firstName: 'James',
      lastName: 'Rodriguez',
      role: 'security',
      phone: '+1 555-100-0016',
      status: 'active',
    }
  },
  'cleaning': {
    email: 'cleaning@icoachie.com',
    password: 'cleaning123',
    user: {
      id: 'user-cleaning-1',
      email: 'cleaning@icoachie.com',
      firstName: 'Maria',
      lastName: 'Lopez',
      role: 'cleaning',
      phone: '+1 555-100-0017',
      status: 'active',
    }
  },
  'venue': {
    email: 'venue@icoachie.com',
    password: 'venue123',
    user: {
      id: 'user-venue-1',
      email: 'venue@icoachie.com',
      firstName: 'Chris',
      lastName: 'Martinez',
      role: 'venue',
      phone: '+1 555-100-0018',
      status: 'active',
    }
  },
  'ground': {
    email: 'ground@icoachie.com',
    password: 'ground123',
    user: {
      id: 'user-ground-1',
      email: 'ground@icoachie.com',
      firstName: 'Kevin',
      lastName: 'Clark',
      role: 'ground',
      phone: '+1 555-100-0019',
      status: 'active',
    }
  },
  'groundskeeper': {
    email: 'groundskeeper@icoachie.com',
    password: 'groundskeeper123',
    user: {
      id: 'user-groundskeeper-1',
      email: 'groundskeeper@icoachie.com',
      firstName: 'Brian',
      lastName: 'Lewis',
      role: 'groundskeeper',
      phone: '+1 555-100-0020',
      status: 'active',
    }
  },
  'academy-owner': {
    email: 'owner@icoachie.com',
    password: 'owner123',
    user: {
      id: 'user-owner-1',
      email: 'owner@icoachie.com',
      firstName: 'Richard',
      lastName: 'Harris',
      role: 'academy-owner',
      phone: '+1 555-100-0021',
      status: 'active',
    }
  },
  'club': {
    email: 'club@icoachie.com',
    password: 'club123',
    user: {
      id: 'user-club-1',
      email: 'club@icoachie.com',
      firstName: 'Jennifer',
      lastName: 'White',
      role: 'club',
      phone: '+1 555-100-0022',
      status: 'active',
    }
  },
  'freelancer': {
    email: 'freelancer@icoachie.com',
    password: 'freelancer123',
    user: {
      id: 'user-freelancer-1',
      email: 'freelancer@icoachie.com',
      firstName: 'Alex',
      lastName: 'Turner',
      role: 'freelancer',
      phone: '+1 555-100-0023',
      status: 'active',
    }
  },
};

// JWT Payload interface matching backend
export interface JWTPayload {
  sub: string; // user id
  clubId: number | null;
  role: UserRole;
  email: string;
  iat: number;
  exp: number;
}

// Auth response interface matching backend
export interface AuthResponse {
  token: string;
  user: User;
}

// Simple base64 encoding for mock JWT (not real cryptography)
function base64Encode(str: string): string {
  if (typeof window !== 'undefined') {
    return btoa(str);
  }
  return Buffer.from(str).toString('base64');
}

function base64Decode(str: string): string {
  if (typeof window !== 'undefined') {
    return atob(str);
  }
  return Buffer.from(str, 'base64').toString('utf-8');
}

// Generate mock JWT token matching backend structure
export function generateMockToken(user: User, clubId: number | null = 1): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    sub: user.id,
    clubId,
    role: user.role,
    email: user.email,
    iat: now,
    exp: now + (7 * 24 * 60 * 60), // 7 days expiry like backend
  };
  
  const header = base64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadBase64 = base64Encode(JSON.stringify(payload));
  const signature = base64Encode(`mock-signature-${MOCK_JWT_SECRET}`);
  
  return `${header}.${payloadBase64}.${signature}`;
}

// Verify and decode mock JWT token
export function verifyMockToken(token: string): JWTPayload | null {
  try {
    const [, payloadBase64] = token.split('.');
    if (!payloadBase64) return null;
    
    const payload = JSON.parse(base64Decode(payloadBase64)) as JWTPayload;
    
    // Check expiry
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

// Mock auth service configuration
export interface AuthServiceConfig {
  useMock?: boolean;
  mockDelay?: number;
  onAuthStateChange?: (user: User | null) => void;
}

// Create mock auth service
export function createAuthService(config: AuthServiceConfig = {}) {
  const { useMock = true, mockDelay = 300, onAuthStateChange } = config;
  
  const delay = () => new Promise(resolve => setTimeout(resolve, mockDelay));
  
  return {
    // Login with email and password
    async login(email: string, password: string): Promise<AuthResponse> {
      if (!useMock) {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Invalid credentials');
        }
        return response.json();
      }
      
      await delay();
      
      // Find user by email
      const credentials = Object.values(mockUserCredentials).find(
        cred => cred.email === email
      );
      
      if (!credentials || credentials.password !== password) {
        throw new Error('Invalid credentials');
      }
      
      const now = new Date().toISOString();
      const user: User = {
        ...credentials.user,
        createdAt: now,
        updatedAt: now,
      };
      
      const token = generateMockToken(user);
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
      }
      
      onAuthStateChange?.(user);
      
      return { token, user };
    },
    
    // Register new user
    async register(data: {
      email: string;
      password: string;
      name: string;
      role: UserRole;
      clubId?: number;
    }): Promise<AuthResponse> {
      if (!useMock) {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Registration failed');
        }
        return response.json();
      }
      
      await delay();
      
      const [firstName, ...lastNameParts] = data.name.split(' ');
      const lastName = lastNameParts.join(' ') || 'User';
      
      const now = new Date().toISOString();
      const user: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        firstName,
        lastName,
        role: data.role,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      };
      
      const token = generateMockToken(user, data.clubId);
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
      }
      
      onAuthStateChange?.(user);
      
      return { token, user };
    },
    
    // Logout
    async logout(): Promise<void> {
      if (!useMock) {
        await fetch('/api/auth/logout', { method: 'POST' });
      }
      
      await delay();
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      
      onAuthStateChange?.(null);
    },
    
    // Get current user from token
    getCurrentUser(): User | null {
      if (typeof window === 'undefined') return null;
      
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');
      
      if (!token || !userStr) return null;
      
      const payload = verifyMockToken(token);
      if (!payload) {
        // Token expired, clear storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        return null;
      }
      
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    },
    
    // Get current token
    getToken(): string | null {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem('auth_token');
    },
    
    // Check if user is authenticated
    isAuthenticated(): boolean {
      const token = this.getToken();
      if (!token) return false;
      return verifyMockToken(token) !== null;
    },
    
    // Check if user has specific role
    hasRole(role: UserRole | UserRole[]): boolean {
      const user = this.getCurrentUser();
      if (!user) return false;
      
      if (Array.isArray(role)) {
        return role.includes(user.role);
      }
      return user.role === role;
    },
    
    // Forgot password
    async forgotPassword(email: string): Promise<{ resetToken: string }> {
      if (!useMock) {
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to send reset email');
        }
        return response.json();
      }
      
      await delay();
      
      // Check if email exists in mock users
      const exists = Object.values(mockUserCredentials).some(
        cred => cred.email === email
      );
      
      if (!exists) {
        throw new Error('User not found');
      }
      
      return { resetToken: `mock-reset-${Date.now()}` };
    },
    
    // Reset password
    async resetPassword(token: string, password: string): Promise<{ message: string }> {
      if (!useMock) {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password }),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to reset password');
        }
        return response.json();
      }
      
      await delay();
      
      if (!token.startsWith('mock-reset-')) {
        throw new Error('Invalid token');
      }
      
      return { message: 'Password reset successfully' };
    },
    
    // Get mock credentials for a role (for testing)
    getMockCredentials(role: UserRole): MockUserCredentials {
      return mockUserCredentials[role];
    },
    
    // Get all available roles
    getAvailableRoles(): UserRole[] {
      return Object.keys(mockUserCredentials) as UserRole[];
    },
    
    // Get role display name
    getRoleDisplayName(role: UserRole): string {
      const displayNames: Record<UserRole, string> = {
        'admin': 'Administrator',
        'coach': 'Coach',
        'head-coach': 'Head Coach',
        'parent': 'Parent',
        'guardian': 'Guardian',
        'student': 'Student/Athlete',
        'accountant': 'Accountant',
        'front-desk': 'Front Desk',
        'content-manager': 'Content Manager',
        'medical': 'Medical Staff',
        'facility': 'Facility Manager',
        'system-support': 'System Support',
        'bookings-coordinator': 'Bookings Coordinator',
        'maintenance': 'Maintenance',
        'equipment': 'Equipment Manager',
        'security': 'Security',
        'cleaning': 'Cleaning Staff',
        'venue': 'Venue Manager',
        'ground': 'Ground Staff',
        'groundskeeper': 'Groundskeeper',
        'academy-owner': 'Academy Owner',
        'club': 'Club Admin',
        'freelancer': 'Freelancer',
      };
      return displayNames[role];
    },
    
    // Get dashboard path for role
    getDashboardPath(role: UserRole): string {
      const paths: Record<UserRole, string> = {
        'admin': '/admin',
        'coach': '/coach',
        'head-coach': '/head-coach',
        'parent': '/parent',
        'guardian': '/parent', // guardians use parent dashboard
        'student': '/student',
        'accountant': '/accountant',
        'front-desk': '/front-desk',
        'content-manager': '/content-manager',
        'medical': '/medical',
        'facility': '/facility',
        'system-support': '/system-support',
        'bookings-coordinator': '/bookings-coordinator',
        'maintenance': '/maintenance',
        'equipment': '/equipment',
        'security': '/security',
        'cleaning': '/cleaning',
        'venue': '/venue',
        'ground': '/ground',
        'groundskeeper': '/groundskeeper',
        'academy-owner': '/admin',
        'club': '/club',
        'freelancer': '/freelancer',
      };
      return paths[role];
    },
  };
}

// Default auth service instance
export const authService = createAuthService();
