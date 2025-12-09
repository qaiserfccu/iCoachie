import { User, Role } from '@prisma/client';

export enum IsolationLevel {
  GLOBAL = 'GLOBAL',
  CLUB = 'CLUB',
  FACILITY = 'FACILITY',
  VENUE = 'VENUE',
  GROUND = 'GROUND',
  FREELANCE = 'FREELANCE',
  PERSONAL = 'PERSONAL',
}

export interface IsolationContext {
  level: IsolationLevel;
  clubId?: number;
  facilityId?: number;
  venueId?: number;
  groundId?: number;
  coachId?: number; // For freelancers
  userId?: number; // For personal
}

export const ROLE_ISOLATION_MAPPING: Record<string, IsolationLevel> = {
  // Global
  SUPER_ADMIN: IsolationLevel.GLOBAL,
  SYSTEM_SUPPORT: IsolationLevel.GLOBAL,

  // Club
  CLUB_ADMIN: IsolationLevel.CLUB,
  CLUB_MANAGER: IsolationLevel.CLUB,
  HEAD_COACH: IsolationLevel.CLUB,
  COACH: IsolationLevel.CLUB,
  ACCOUNTANT: IsolationLevel.CLUB,
  FRONT_DESK: IsolationLevel.CLUB,
  CONTENT_MANAGER: IsolationLevel.CLUB,
  MEDICAL_STAFF: IsolationLevel.CLUB,

  // Facility
  FACILITY_MANAGER: IsolationLevel.FACILITY,
  BOOKINGS_COORDINATOR: IsolationLevel.FACILITY,
  MAINTENANCE_TECH: IsolationLevel.FACILITY,
  EQUIPMENT_MANAGER: IsolationLevel.FACILITY,
  SECURITY_STAFF: IsolationLevel.FACILITY,
  CLEANING_STAFF: IsolationLevel.FACILITY,

  // Venue
  VENUE_MANAGER: IsolationLevel.VENUE,

  // Ground
  GROUND_MANAGER: IsolationLevel.GROUND,
  GROUNDSKEEPER: IsolationLevel.GROUND,

  // Freelance
  FREELANCER: IsolationLevel.FREELANCE,

  // Personal
  PARENT: IsolationLevel.PERSONAL,
  STUDENT: IsolationLevel.PERSONAL,
};

/**
 * Determines the isolation context for a given user based on their primary role.
 * @param user The user object with primaryRole populated.
 * @returns The IsolationContext object.
 */
export function getIsolationContext(user: Partial<User> & { primaryRole?: Partial<Role> | null }): IsolationContext {
  const roleCode = user.primaryRole?.code || 'STUDENT'; // Default to lowest privilege
  const level = ROLE_ISOLATION_MAPPING[roleCode] || IsolationLevel.PERSONAL;

  const context: IsolationContext = { level };

  switch (level) {
    case IsolationLevel.GLOBAL:
      // No specific ID needed
      break;
    case IsolationLevel.CLUB:
      if (user.clubId) context.clubId = user.clubId;
      break;
    case IsolationLevel.FACILITY:
      if (user.facilityId) context.facilityId = user.facilityId;
      break;
    case IsolationLevel.VENUE:
      // Venue managers are typically tied to a facility, but manage specific venues.
      // The specific venue ID would typically be passed in the request or determined by another relation.
      // For the base context, we scope them to their facility if available.
      if (user.facilityId) context.facilityId = user.facilityId;
      break;
    case IsolationLevel.GROUND:
      if (user.facilityId) context.facilityId = user.facilityId;
      break;
    case IsolationLevel.FREELANCE:
      context.coachId = user.id;
      break;
    case IsolationLevel.PERSONAL:
      context.userId = user.id;
      break;
  }

  return context;
}

