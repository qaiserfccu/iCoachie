import prisma from '../db';

// Cache for role and status lookups to avoid repeated DB queries
const roleCache = new Map<string, number>();
const userStatusCache = new Map<string, number>();
const sessionStatusCache = new Map<string, number>();
const attendanceStatusCache = new Map<string, number>();
const paymentStatusCache = new Map<string, number>();
const bookingStatusCache = new Map<string, number>();

/**
 * Get role ID by code
 * @param code Role code (e.g., 'SUPER_ADMIN', 'CLUB_ADMIN', 'COACH')
 * @returns Role ID or null if not found
 */
export async function getRoleIdByCode(code: string): Promise<number | null> {
  if (roleCache.has(code)) {
    return roleCache.get(code)!;
  }

  const role = await prisma.role.findUnique({
    where: { code },
    select: { id: true }
  });

  if (role) {
    roleCache.set(code, role.id);
    return role.id;
  }

  return null;
}

/**
 * Get all active roles
 * @returns Array of roles with id, code, and name
 */
export async function getAllActiveRoles() {
  return await prisma.role.findMany({
    where: { isActive: true },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      scope: true
    },
    orderBy: { sortOrder: 'asc' }
  });
}

/**
 * Get user status ID by code
 * @param code Status code (e.g., 'ACTIVE', 'PENDING', 'SUSPENDED', 'INACTIVE')
 * @returns Status ID or null if not found
 */
export async function getUserStatusIdByCode(code: string): Promise<number | null> {
  if (userStatusCache.has(code)) {
    return userStatusCache.get(code)!;
  }

  const status = await prisma.userStatus.findUnique({
    where: { code },
    select: { id: true }
  });

  if (status) {
    userStatusCache.set(code, status.id);
    return status.id;
  }

  return null;
}

/**
 * Get session status ID by code
 * @param code Status code (e.g., 'SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED')
 * @returns Status ID or null if not found
 */
export async function getSessionStatusIdByCode(code: string): Promise<number | null> {
  if (sessionStatusCache.has(code)) {
    return sessionStatusCache.get(code)!;
  }

  const status = await prisma.sessionStatus.findUnique({
    where: { code },
    select: { id: true }
  });

  if (status) {
    sessionStatusCache.set(code, status.id);
    return status.id;
  }

  return null;
}

/**
 * Get attendance status ID by code
 * @param code Status code (e.g., 'PRESENT', 'LATE', 'ABSENT')
 * @returns Status ID or null if not found
 */
export async function getAttendanceStatusIdByCode(code: string): Promise<number | null> {
  if (attendanceStatusCache.has(code)) {
    return attendanceStatusCache.get(code)!;
  }

  const status = await prisma.attendanceStatus.findUnique({
    where: { code },
    select: { id: true }
  });

  if (status) {
    attendanceStatusCache.set(code, status.id);
    return status.id;
  }

  return null;
}

/**
 * Get payment status ID by code
 * @param code Status code (e.g., 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')
 * @returns Status ID or null if not found
 */
export async function getPaymentStatusIdByCode(code: string): Promise<number | null> {
  if (paymentStatusCache.has(code)) {
    return paymentStatusCache.get(code)!;
  }

  const status = await prisma.paymentStatus.findUnique({
    where: { code },
    select: { id: true }
  });

  if (status) {
    paymentStatusCache.set(code, status.id);
    return status.id;
  }

  return null;
}

/**
 * Get booking status ID by code
 * @param code Status code (e.g., 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')
 * @returns Status ID or null if not found
 */
export async function getBookingStatusIdByCode(code: string): Promise<number | null> {
  if (bookingStatusCache.has(code)) {
    return bookingStatusCache.get(code)!;
  }

  const status = await prisma.bookingStatus.findUnique({
    where: { code },
    select: { id: true }
  });

  if (status) {
    bookingStatusCache.set(code, status.id);
    return status.id;
  }

  return null;
}

/**
 * Get all user statuses
 */
export async function getAllUserStatuses() {
  return await prisma.userStatus.findMany({
    where: { isActive: true },
    select: { id: true, code: true, name: true },
    orderBy: { sortOrder: 'asc' }
  });
}

/**
 * Get all session statuses
 */
export async function getAllSessionStatuses() {
  return await prisma.sessionStatus.findMany({
    where: { isActive: true },
    select: { id: true, code: true, name: true },
    orderBy: { sortOrder: 'asc' }
  });
}

/**
 * Get all attendance statuses
 */
export async function getAllAttendanceStatuses() {
  return await prisma.attendanceStatus.findMany({
    where: { isActive: true },
    select: { id: true, code: true, name: true },
    orderBy: { sortOrder: 'asc' }
  });
}

/**
 * Get all payment statuses
 */
export async function getAllPaymentStatuses() {
  return await prisma.paymentStatus.findMany({
    where: { isActive: true },
    select: { id: true, code: true, name: true },
    orderBy: { sortOrder: 'asc' }
  });
}

/**
 * Get all booking statuses
 */
export async function getAllBookingStatuses() {
  return await prisma.bookingStatus.findMany({
    where: { isActive: true },
    select: { id: true, code: true, name: true },
    orderBy: { sortOrder: 'asc' }
  });
}

/**
 * Clear all caches (useful for testing or after data updates)
 */
export function clearLookupCaches() {
  roleCache.clear();
  userStatusCache.clear();
  sessionStatusCache.clear();
  attendanceStatusCache.clear();
  paymentStatusCache.clear();
  bookingStatusCache.clear();
}
