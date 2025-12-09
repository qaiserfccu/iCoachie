import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole, requireScope, requirePermission } from '../middleware';
import { IsolationContext, getIsolationContext } from '../types/isolation';

const router = express.Router();

// Helper function to check if user has access to a facility based on isolation
async function checkFacilityAccess(facilityId: number, isolation: IsolationContext): Promise<boolean> {
  switch (isolation.level) {
    case 'GLOBAL':
      return true; // Global users can access all facilities
    case 'CLUB':
      if (!isolation.clubId) return false;
      // Check if facility is associated with user's club
      const clubFacility = await prisma.clubFacility.findFirst({
        where: { facilityId, clubId: isolation.clubId }
      });
      return !!clubFacility;
    case 'FACILITY':
      return isolation.facilityId === facilityId;
    default:
      return false;
  }
}

// =============================================================================
// Card 19 - Complete DTO Shapes for Facility/Venue/Ground
// =============================================================================

// Prisma select shapes for optimized payloads - includes all schema fields
const facilitySelect = {
  id: true,
  name: true,
  location: true,
  address: true,
  description: true,
  amenities: true,
  managerId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  manager: {
    select: { id: true, name: true, email: true }
  }
};

const venueSelect = {
  id: true,
  name: true,
  venueType: true,
  capacity: true,
  hourlyRate: true,
  isAvailable: true,
  amenities: true,
  facilityId: true,
  managerId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  manager: {
    select: { id: true, name: true, email: true }
  }
};

const groundSelect = {
  id: true,
  name: true,
  groundType: true,
  surfaceType: true,
  dimensions: true,
  capacity: true,
  isAvailable: true,
  facilityId: true,
  managerId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  manager: {
    select: { id: true, name: true, email: true }
  }
};

// =============================================================================
// Card 23 - Pagination Helper
// =============================================================================

interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
}

interface PageInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  pageInfo: PageInfo;
  filtersApplied: Record<string, any>;
}

function parsePaginationParams(query: any): PaginationParams {
  const page = Math.max(1, parseInt(query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize) || 20));
  const search = query.search?.trim() || undefined;
  return { page, pageSize, search };
}

function buildPageInfo(total: number, page: number, pageSize: number): PageInfo {
  const totalPages = Math.ceil(total / pageSize);
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
}

// =============================================================================
// Response Mappers - Normalize API response shapes
// =============================================================================

const mapFacilityResponse = (facility: any) => ({
  id: facility.id,
  name: facility.name,
  location: facility.location,
  address: facility.address,
  description: facility.description,
  amenities: facility.amenities || [],
  managerId: facility.managerId,
  manager: facility.manager || null,
  venueCount: facility._count?.venues,
  groundCount: facility._count?.grounds,
  createdAt: facility.createdAt,
  updatedAt: facility.updatedAt,
  deletedAt: facility.deletedAt
});

const mapVenueResponse = (venue: any) => ({
  id: venue.id,
  name: venue.name,
  type: venue.venueType,
  venueType: venue.venueType,
  capacity: venue.capacity,
  hourlyRate: venue.hourlyRate ? parseFloat(venue.hourlyRate.toString()) : null,
  isAvailable: venue.isAvailable,
  amenities: venue.amenities || [],
  facilityId: venue.facilityId,
  managerId: venue.managerId,
  manager: venue.manager || null,
  facility: venue.facility || null,
  createdAt: venue.createdAt,
  updatedAt: venue.updatedAt,
  deletedAt: venue.deletedAt
});

const mapGroundResponse = (ground: any) => ({
  id: ground.id,
  name: ground.name,
  type: ground.groundType,
  groundType: ground.groundType,
  surface: ground.surfaceType,
  surfaceType: ground.surfaceType,
  dimensions: ground.dimensions,
  capacity: ground.capacity,
  isAvailable: ground.isAvailable,
  facilityId: ground.facilityId,
  managerId: ground.managerId,
  manager: ground.manager || null,
  facility: ground.facility || null,
  createdAt: ground.createdAt,
  updatedAt: ground.updatedAt,
  deletedAt: ground.deletedAt
});

// =============================================================================
// FACILITY ENDPOINTS
// =============================================================================

// Create facility - Card 19: Accept all schema fields
router.post('/', requireAuth, requireRole(['SUPER_ADMIN', 'SYSTEM_SUPPORT']), async (req: AuthRequest, res) => {
  try {
    const { name, address, location, description, amenities, managerId } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    
    const facility = await prisma.facility.create({
      data: { 
        name, 
        address: address || null,
        location: location || null,
        description: description || null,
        amenities: amenities || [],
        managerId: managerId || null
      },
      select: facilitySelect
    });
    res.status(201).json(mapFacilityResponse(facility));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// List facilities - Card 22: Filter deleted by default, Card 23: Pagination
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const { page, pageSize, search } = parsePaginationParams(req.query);
    const includeDeleted = req.query.includeDeleted === 'true';
    
    let where: any = { 
      ...(includeDeleted ? {} : { deletedAt: null }),
      ...(search ? { 
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } }
        ]
      } : {})
    };
    
    // Apply isolation-based filtering
    if (isolation.level === 'CLUB' && isolation.clubId) {
      // For club users, only show facilities associated with their club
      where.clubs = { some: { clubId: isolation.clubId } };
    } else if (isolation.level === 'FACILITY' && isolation.facilityId) {
      // For facility users, only show their facility
      where.id = isolation.facilityId;
    } else if (isolation.level === 'GLOBAL') {
      // Global users can see all facilities
    } else {
      // For other levels, they might not have access or need different logic
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const [facilities, total] = await Promise.all([
      prisma.facility.findMany({
        where,
        select: { ...facilitySelect, _count: { select: { venues: true, grounds: true } } },
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.facility.count({ where })
    ]);
    
    const response: PaginatedResponse<any> = {
      data: facilities.map(mapFacilityResponse),
      pageInfo: buildPageInfo(total, page, pageSize),
      filtersApplied: { search, includeDeleted }
    };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get facility by ID
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    // Check if user has access to this facility
    const hasAccess = await checkFacilityAccess(id, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    const facility = await prisma.facility.findUnique({
      where: { id },
      select: {
        ...facilitySelect,
        _count: { select: { venues: true, grounds: true } }
      }
    });
    if (!facility) return res.status(404).json({ message: 'Not found' });
    res.json(mapFacilityResponse(facility));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update facility - Card 19: Accept all schema fields
router.put('/:id', requireAuth, requireScope('FACILITY'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    const { name, address, location, description, amenities } = req.body;
    
    if (!name && !address && !location && !description && !amenities) {
      return res.status(400).json({ message: 'At least one field required' });
    }
    
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    // Check if user has access to this facility
    const hasAccess = await checkFacilityAccess(id, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    const existing = await prisma.facility.findUnique({ where: { id }, select: { deletedAt: true } });
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Cannot update deleted facility' });
    
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (address !== undefined) data.address = address;
    if (location !== undefined) data.location = location;
    if (description !== undefined) data.description = description;
    if (amenities !== undefined) data.amenities = amenities;
    
    const updated = await prisma.facility.update({
      where: { id },
      data,
      select: { ...facilitySelect, _count: { select: { venues: true, grounds: true } } }
    });
    res.json(mapFacilityResponse(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Soft delete facility - Card 22
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    // Check if user has access to this facility
    const hasAccess = await checkFacilityAccess(id, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    const existing = await prisma.facility.findUnique({ where: { id }, select: { deletedAt: true } });
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Already deleted' });
    
    await prisma.facility.update({ 
      where: { id }, 
      data: { deletedAt: new Date() } 
    });
    res.json({ ok: true, message: 'Facility soft deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Restore facility - Card 22
router.post('/:id/restore', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    // Check if user has access to this facility
    const hasAccess = await checkFacilityAccess(id, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    const existing = await prisma.facility.findUnique({ where: { id }, select: { deletedAt: true } });
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (!existing.deletedAt) return res.status(400).json({ message: 'Facility is not deleted' });
    
    const restored = await prisma.facility.update({ 
      where: { id }, 
      data: { deletedAt: null },
      select: { ...facilitySelect, _count: { select: { venues: true, grounds: true } } }
    });
    res.json(mapFacilityResponse(restored));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// =============================================================================
// Card 20 - Manager & Staff Assignment for Facilities
// =============================================================================

// Assign manager to facility
router.put('/:id/manager', requireAuth, requirePermission('facility.staff.manage'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const { managerId } = req.body;
    
    if (managerId === undefined) return res.status(400).json({ message: 'managerId required' });
    
    // Check if user has access to this facility
    const hasAccess = await checkFacilityAccess(id, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    const existing = await prisma.facility.findUnique({ where: { id }, select: { deletedAt: true } });
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Cannot update deleted facility' });
    
    // Verify manager exists if provided
    if (managerId) {
      const manager = await prisma.user.findUnique({ where: { id: managerId }, select: { id: true } });
      if (!manager) {
        return res.status(400).json({ message: 'Invalid manager ID' });
      }
    }
    
    const updated = await prisma.facility.update({
      where: { id },
      data: { managerId: managerId || null },
      select: { ...facilitySelect, _count: { select: { venues: true, grounds: true } } }
    });
    res.json(mapFacilityResponse(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// List facility staff
router.get('/:id/staff', requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    // Check if user has access to this facility
    const hasAccess = await checkFacilityAccess(id, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    const facility = await prisma.facility.findUnique({ 
      where: { id }, 
      select: { 
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            primaryRole: { select: { code: true, name: true } }
          }
        }
      } 
    });
    if (!facility) return res.status(404).json({ message: 'Not found' });
    
    res.json({ data: facility.staff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Add staff to facility
router.post('/:id/staff', requireAuth, requirePermission('facility.staff.manage'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const { userId } = req.body;
    
    if (!userId) return res.status(400).json({ message: 'userId required' });
    
    // Check if user has access to this facility
    const hasAccess = await checkFacilityAccess(id, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Facility not found' });
    
    const facility = await prisma.facility.findUnique({ where: { id }, select: { deletedAt: true } });
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    if (facility.deletedAt) return res.status(400).json({ message: 'Cannot update deleted facility' });
    
    // Check if the user can be assigned based on isolation level
    if (isolation.level === 'CLUB') {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { clubId: true } });
      if (!user || user.clubId !== isolation.clubId) return res.status(400).json({ message: 'Invalid user ID' });
    } else {
      // For GLOBAL/FACILITY users, just check user exists
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
      if (!user) return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    await prisma.user.update({
      where: { id: userId },
      data: { facilityId: id }
    });
    
    res.json({ ok: true, message: 'Staff member assigned' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Remove staff from facility
router.delete('/:id/staff/:userId', requireAuth, requirePermission('facility.staff.manage'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    // Check if user has access to this facility
    const hasAccess = await checkFacilityAccess(id, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Facility not found' });
    
    const facility = await prisma.facility.findUnique({ where: { id }, select: { id: true } });
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { facilityId: true } });
    if (!user || user.facilityId !== id) return res.status(400).json({ message: 'User not assigned to this facility' });
    
    await prisma.user.update({
      where: { id: userId },
      data: { facilityId: null }
    });
    
    res.json({ ok: true, message: 'Staff member removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// =============================================================================
// VENUE ENDPOINTS
// =============================================================================

// Create venue - Card 19: Accept all schema fields
router.post('/:facilityId/venues', requireAuth, requireScope('VENUE'), async (req: AuthRequest, res) => {
  try {
    const facilityId = parseInt(req.params.facilityId);
    const isolation = req.isolation;
    const { name, capacity, hourlyRate, isAvailable, amenities, managerId } = req.body;
    const venueType = req.body.venueType ?? req.body.type;
    
    if (!name || !venueType) return res.status(400).json({ message: 'Venue name and type required' });
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    // Check if user has access to this facility
    const hasFacilityAccess = await checkFacilityAccess(facilityId, isolation);
    if (!hasFacilityAccess) return res.status(403).json({ message: 'Access denied to facility' });
    
    const facility = await prisma.facility.findUnique({ where: { id: facilityId }, select: { deletedAt: true } });
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    if (facility.deletedAt) return res.status(400).json({ message: 'Cannot add venue to deleted facility' });
    
    const venue = await prisma.venue.create({
      data: { 
        name, 
        venueType, 
        facilityId,
        capacity: capacity || null,
        hourlyRate: hourlyRate || null,
        isAvailable: isAvailable !== false,
        amenities: amenities || [],
        managerId: managerId || null
      },
      select: venueSelect
    });
    res.status(201).json(mapVenueResponse(venue));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// List venues - Card 22 & 23: Soft delete filter + pagination
router.get('/:facilityId/venues', requireAuth, async (req: AuthRequest, res) => {
  try {
    const facilityId = parseInt(req.params.facilityId);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    // Check if user has access to this facility
    const hasAccess = await checkFacilityAccess(facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Facility not found' });
    
    const { page, pageSize, search } = parsePaginationParams(req.query);
    const includeDeleted = req.query.includeDeleted === 'true';
    const availableOnly = req.query.available === 'true';
    
    const where: any = { 
      facilityId,
      ...(includeDeleted ? {} : { deletedAt: null }),
      ...(availableOnly ? { isAvailable: true } : {}),
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {})
    };
    
    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        where,
        select: venueSelect,
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.venue.count({ where })
    ]);
    
    const response: PaginatedResponse<any> = {
      data: venues.map(mapVenueResponse),
      pageInfo: buildPageInfo(total, page, pageSize),
      filtersApplied: { search, includeDeleted, availableOnly }
    };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// =============================================================================
// GROUND ENDPOINTS
// =============================================================================

// Create ground - Card 19: Accept all schema fields
router.post('/:facilityId/grounds', requireAuth, requireScope('GROUND'), async (req: AuthRequest, res) => {
  try {
    const facilityId = parseInt(req.params.facilityId);
    const isolation = req.isolation;
    const { name, dimensions, capacity, isAvailable, managerId } = req.body;
    const surfaceType = req.body.surfaceType ?? req.body.surface;
    const groundType = req.body.groundType ?? req.body.type;
    
    if (!name || !groundType) return res.status(400).json({ message: 'Ground name and type required' });
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    // Check if user has access to this facility
    const hasFacilityAccess = await checkFacilityAccess(facilityId, isolation);
    if (!hasFacilityAccess) return res.status(403).json({ message: 'Access denied to facility' });
    
    const facility = await prisma.facility.findUnique({ where: { id: facilityId }, select: { deletedAt: true } });
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    if (facility.deletedAt) return res.status(400).json({ message: 'Cannot add ground to deleted facility' });
    
    const ground = await prisma.ground.create({
      data: { 
        name, 
        groundType, 
        surfaceType: surfaceType || null,
        dimensions: dimensions || null,
        capacity: capacity || null,
        isAvailable: isAvailable !== false,
        managerId: managerId || null,
        facilityId 
      },
      select: groundSelect
    });
    res.status(201).json(mapGroundResponse(ground));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// List grounds - Card 22 & 23: Soft delete filter + pagination
router.get('/:facilityId/grounds', requireAuth, async (req: AuthRequest, res) => {
  try {
    const facilityId = parseInt(req.params.facilityId);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    // Check if user has access to this facility
    const hasAccess = await checkFacilityAccess(facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Facility not found' });
    
    const { page, pageSize, search } = parsePaginationParams(req.query);
    const includeDeleted = req.query.includeDeleted === 'true';
    const availableOnly = req.query.available === 'true';
    
    const where: any = { 
      facilityId,
      ...(includeDeleted ? {} : { deletedAt: null }),
      ...(availableOnly ? { isAvailable: true } : {}),
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {})
    };
    
    const [grounds, total] = await Promise.all([
      prisma.ground.findMany({
        where,
        select: groundSelect,
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.ground.count({ where })
    ]);
    
    const response: PaginatedResponse<any> = {
      data: grounds.map(mapGroundResponse),
      pageInfo: buildPageInfo(total, page, pageSize),
      filtersApplied: { search, includeDeleted, availableOnly }
    };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// =============================================================================
// VENUE DETAIL ENDPOINTS
// =============================================================================

router.get('/venues/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const venue = await prisma.venue.findUnique({
      where: { id },
      select: {
        ...venueSelect,
        facility: {
          select: { id: true, name: true }
        }
      }
    });
    
    if (!venue) return res.status(404).json({ message: 'Not found' });
    
    // Check if user has access to this venue's facility
    const hasAccess = await checkFacilityAccess(venue.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    res.json(mapVenueResponse(venue));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update venue - Card 19: Accept all schema fields
router.put('/venues/:id', requireAuth, requireScope('VENUE'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const { name, capacity, hourlyRate, isAvailable, amenities } = req.body;
    const venueType = req.body.venueType ?? req.body.type;
    
    if (name === undefined && venueType === undefined && capacity === undefined && 
        hourlyRate === undefined && isAvailable === undefined && amenities === undefined) {
      return res.status(400).json({ message: 'At least one field required' });
    }
    
    const existing = await prisma.venue.findUnique({
      where: { id },
      select: { facilityId: true, deletedAt: true }
    });
    
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Cannot update deleted venue' });
    
    // Check if user has access to this venue's facility
    const hasAccess = await checkFacilityAccess(existing.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (venueType !== undefined) data.venueType = venueType;
    if (capacity !== undefined) data.capacity = capacity;
    if (hourlyRate !== undefined) data.hourlyRate = hourlyRate;
    if (isAvailable !== undefined) data.isAvailable = isAvailable;
    if (amenities !== undefined) data.amenities = amenities;
    
    const updated = await prisma.venue.update({
      where: { id },
      data,
      select: venueSelect
    });
    res.json(mapVenueResponse(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Soft delete venue - Card 22
router.delete('/venues/:id', requireAuth, requireRole(['SUPER_ADMIN', 'FACILITY_MANAGER']), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const existing = await prisma.venue.findUnique({
      where: { id },
      select: { facilityId: true, deletedAt: true }
    });
    
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Already deleted' });
    
    // Check if user has access to this venue's facility
    const hasAccess = await checkFacilityAccess(existing.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    await prisma.venue.update({ 
      where: { id }, 
      data: { deletedAt: new Date() } 
    });
    res.json({ ok: true, message: 'Venue soft deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Restore venue - Card 22
router.post('/venues/:id/restore', requireAuth, requireRole(['SUPER_ADMIN', 'FACILITY_MANAGER']), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const existing = await prisma.venue.findUnique({
      where: { id },
      select: { facilityId: true, deletedAt: true }
    });
    
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (!existing.deletedAt) return res.status(400).json({ message: 'Venue is not deleted' });
    
    // Check if user has access to this venue's facility
    const hasAccess = await checkFacilityAccess(existing.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    const restored = await prisma.venue.update({ 
      where: { id }, 
      data: { deletedAt: null },
      select: venueSelect
    });
    res.json(mapVenueResponse(restored));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Card 20 - Venue Manager Assignment
router.put('/venues/:id/manager', requireAuth, requirePermission('venue.manage'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const { managerId } = req.body;
    
    if (managerId === undefined) return res.status(400).json({ message: 'managerId required' });
    
    const existing = await prisma.venue.findUnique({
      where: { id },
      select: { facilityId: true, deletedAt: true }
    });
    
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Cannot update deleted venue' });
    
    // Check if user has access to this venue's facility
    const hasAccess = await checkFacilityAccess(existing.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    if (managerId) {
      // Validate manager has access to the facility (isolation-based)
      const managerIsolation = getIsolationContext({ id: managerId, primaryRole: null });
      const managerHasAccess = await checkFacilityAccess(existing.facilityId, managerIsolation);
      if (!managerHasAccess) {
        return res.status(400).json({ message: 'Invalid manager ID' });
      }
    }
    
    const updated = await prisma.venue.update({
      where: { id },
      data: { managerId: managerId || null },
      select: venueSelect
    });
    res.json(mapVenueResponse(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// =============================================================================
// GROUND DETAIL ENDPOINTS
// =============================================================================

router.get('/grounds/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const ground = await prisma.ground.findUnique({
      where: { id },
      select: {
        ...groundSelect,
        facility: {
          select: { id: true, name: true }
        }
      }
    });
    
    if (!ground) return res.status(404).json({ message: 'Not found' });
    
    // Check if user has access to this ground's facility
    const hasAccess = await checkFacilityAccess(ground.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    res.json(mapGroundResponse(ground));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update ground - Card 19: Accept all schema fields
router.put('/grounds/:id', requireAuth, requireScope('GROUND'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const { name, dimensions, capacity, isAvailable } = req.body;
    const surfaceType = req.body.surfaceType ?? req.body.surface;
    const groundType = req.body.groundType ?? req.body.type;
    
    if (name === undefined && surfaceType === undefined && groundType === undefined && 
        dimensions === undefined && capacity === undefined && isAvailable === undefined) {
      return res.status(400).json({ message: 'At least one field required' });
    }
    
    const existing = await prisma.ground.findUnique({
      where: { id },
      select: { facilityId: true, deletedAt: true }
    });
    
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Cannot update deleted ground' });
    
    // Check if user has access to this ground's facility
    const hasAccess = await checkFacilityAccess(existing.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (groundType !== undefined) data.groundType = groundType;
    if (surfaceType !== undefined) data.surfaceType = surfaceType;
    if (dimensions !== undefined) data.dimensions = dimensions;
    if (capacity !== undefined) data.capacity = capacity;
    if (isAvailable !== undefined) data.isAvailable = isAvailable;
    
    const updated = await prisma.ground.update({
      where: { id },
      data,
      select: groundSelect
    });
    res.json(mapGroundResponse(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Soft delete ground - Card 22
router.delete('/grounds/:id', requireAuth, requireRole(['SUPER_ADMIN', 'FACILITY_MANAGER']), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const existing = await prisma.ground.findUnique({
      where: { id },
      select: { facilityId: true, deletedAt: true }
    });
    
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Already deleted' });
    
    // Check if user has access to this ground's facility
    const hasAccess = await checkFacilityAccess(existing.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    await prisma.ground.update({ 
      where: { id }, 
      data: { deletedAt: new Date() } 
    });
    res.json({ ok: true, message: 'Ground soft deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Restore ground - Card 22
router.post('/grounds/:id/restore', requireAuth, requireRole(['SUPER_ADMIN', 'FACILITY_MANAGER']), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const existing = await prisma.ground.findUnique({
      where: { id },
      select: { facilityId: true, deletedAt: true }
    });
    
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (!existing.deletedAt) return res.status(400).json({ message: 'Ground is not deleted' });
    
    // Check if user has access to this ground's facility
    const hasAccess = await checkFacilityAccess(existing.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    const restored = await prisma.ground.update({ 
      where: { id }, 
      data: { deletedAt: null },
      select: groundSelect
    });
    res.json(mapGroundResponse(restored));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Card 20 - Ground Manager Assignment
router.put('/grounds/:id/manager', requireAuth, requirePermission('ground.manage'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const { managerId } = req.body;
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    if (managerId === undefined) return res.status(400).json({ message: 'managerId required' });
    
    const existing = await prisma.ground.findUnique({
      where: { id },
      select: { facilityId: true, deletedAt: true }
    });
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Cannot update deleted ground' });
    
    // Check if user has access to this ground's facility
    const hasAccess = await checkFacilityAccess(existing.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Not found' });
    
    if (managerId) {
      // Validate manager has access to this facility
      const managerIsolation = await getIsolationContext(managerId);
      const managerHasAccess = await checkFacilityAccess(existing.facilityId, managerIsolation);
      if (!managerHasAccess) return res.status(400).json({ message: 'Invalid manager ID' });
    }
    
    const updated = await prisma.ground.update({
      where: { id },
      data: { managerId: managerId || null },
      select: groundSelect
    });
    res.json(mapGroundResponse(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// =============================================================================
// Card 21 - Venue Schedule & Availability APIs
// =============================================================================

const scheduleSelect = {
  id: true,
  dayOfWeek: true,
  specificDate: true,
  startTime: true,
  endTime: true,
  isRecurring: true,
  isBlackout: true,
  notes: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
};

// =============================================================================
// Shared Validation Utilities
// =============================================================================

// Validate time format HH:mm
function isValidTimeFormat(time: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

// Convert HH:mm time string to minutes since midnight for comparison
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Validate date string and return Date object or null
function parseDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

// Check for schedule conflicts using minutes comparison
async function checkVenueScheduleConflict(
  venueId: number, 
  dayOfWeek: number | null, 
  specificDate: Date | null,
  startTime: string, 
  endTime: string,
  excludeId?: number
): Promise<boolean> {
  const existingSchedules = await prisma.venueSchedule.findMany({
    where: {
      venueId,
      deletedAt: null,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
      OR: [
        // Check recurring schedules for same day
        ...(dayOfWeek !== null ? [{ dayOfWeek, isRecurring: true }] : []),
        // Check specific date schedules
        ...(specificDate ? [{ specificDate }] : [])
      ]
    }
  });

  const newStart = timeToMinutes(startTime);
  const newEnd = timeToMinutes(endTime);

  for (const existing of existingSchedules) {
    const existStart = timeToMinutes(existing.startTime);
    const existEnd = timeToMinutes(existing.endTime);
    // Overlap check using minutes
    if (newStart < existEnd && newEnd > existStart) {
      return true; // Conflict found
    }
  }
  return false;
}

// Create venue schedule slot
router.post('/venues/:id/schedule', requireAuth, requirePermission('venue.schedule.manage'), async (req: AuthRequest, res) => {
  try {
    const venueId = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const { dayOfWeek, specificDate, startTime, endTime, isRecurring, isBlackout, notes } = req.body;
    
    // Validate venue exists and user has access
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: { facilityId: true, deletedAt: true }
    });
    
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    if (venue.deletedAt) return res.status(400).json({ message: 'Cannot add schedule to deleted venue' });
    
    // Check if user has access to this venue's facility
    const hasAccess = await checkFacilityAccess(venue.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Venue not found' });
    
    // Validate required fields
    if (!startTime || !endTime) return res.status(400).json({ message: 'startTime and endTime required' });
    if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
      return res.status(400).json({ message: 'Time must be in HH:mm format' });
    }
    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      return res.status(400).json({ message: 'endTime must be after startTime' });
    }
    
    // Validate that exactly one of dayOfWeek or specificDate is provided (not both)
    const hasDayOfWeek = dayOfWeek !== undefined && dayOfWeek !== null;
    const parsedDate = parseDate(specificDate);
    const hasSpecificDate = specificDate !== undefined && parsedDate !== null;
    
    if (!hasDayOfWeek && !hasSpecificDate) {
      return res.status(400).json({ message: 'Either dayOfWeek or specificDate is required' });
    }
    if (hasDayOfWeek && hasSpecificDate) {
      return res.status(400).json({ message: 'Cannot specify both dayOfWeek and specificDate' });
    }
    if (specificDate && !parsedDate) {
      return res.status(400).json({ message: 'Invalid date format for specificDate' });
    }
    
    // Check for conflicts
    const hasConflict = await checkVenueScheduleConflict(
      venueId,
      hasDayOfWeek ? dayOfWeek : null,
      parsedDate,
      startTime,
      endTime
    );
    if (hasConflict) return res.status(409).json({ message: 'Schedule conflict detected' });
    
    const schedule = await prisma.venueSchedule.create({
      data: {
        venueId,
        dayOfWeek: hasDayOfWeek ? dayOfWeek : null,
        specificDate: parsedDate,
        startTime,
        endTime,
        isRecurring: isRecurring === true, // Explicit boolean - defaults to false
        isBlackout: isBlackout === true,
        notes: notes || null,
        createdBy: req.user!.id
      },
      select: scheduleSelect
    });
    res.status(201).json(schedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// List venue schedule slots
router.get('/venues/:id/schedule', requireAuth, async (req: AuthRequest, res) => {
  try {
    const venueId = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: { facilityId: true }
    });
    
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    
    // Check if user has access to this venue's facility
    const hasAccess = await checkFacilityAccess(venue.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Venue not found' });
    
    const includeDeleted = req.query.includeDeleted === 'true';
    const blackoutsOnly = req.query.blackouts === 'true';
    const dayOfWeek = req.query.dayOfWeek !== undefined ? parseInt(req.query.dayOfWeek as string) : undefined;
    
    const schedules = await prisma.venueSchedule.findMany({
      where: {
        venueId,
        ...(includeDeleted ? {} : { deletedAt: null }),
        ...(blackoutsOnly ? { isBlackout: true } : {}),
        ...(dayOfWeek !== undefined ? { dayOfWeek } : {})
      },
      select: scheduleSelect,
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
    });
    
    res.json({ data: schedules });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update venue schedule slot
router.put('/venues/:venueId/schedule/:scheduleId', requireAuth, requirePermission('venue.schedule.manage'), async (req: AuthRequest, res) => {
  try {
    const venueId = parseInt(req.params.venueId);
    const scheduleId = parseInt(req.params.scheduleId);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const { dayOfWeek, specificDate, startTime, endTime, isRecurring, isBlackout, notes } = req.body;
    
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: { facilityId: true }
    });
    
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    
    // Check if user has access to this venue's facility
    const hasAccess = await checkFacilityAccess(venue.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Venue not found' });
    
    const existing = await prisma.venueSchedule.findUnique({
      where: { id: scheduleId },
      select: { venueId: true, deletedAt: true }
    });
    if (!existing || existing.venueId !== venueId) return res.status(404).json({ message: 'Schedule not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Cannot update deleted schedule' });
    
    // Validate time format if provided
    if (startTime && !isValidTimeFormat(startTime)) return res.status(400).json({ message: 'startTime must be HH:mm format' });
    if (endTime && !isValidTimeFormat(endTime)) return res.status(400).json({ message: 'endTime must be HH:mm format' });
    
    const data: any = {};
    if (dayOfWeek !== undefined) data.dayOfWeek = dayOfWeek;
    if (specificDate !== undefined) data.specificDate = specificDate ? new Date(specificDate) : null;
    if (startTime !== undefined) data.startTime = startTime;
    if (endTime !== undefined) data.endTime = endTime;
    if (isRecurring !== undefined) data.isRecurring = isRecurring;
    if (isBlackout !== undefined) data.isBlackout = isBlackout;
    if (notes !== undefined) data.notes = notes;
    
    const updated = await prisma.venueSchedule.update({
      where: { id: scheduleId },
      data,
      select: scheduleSelect
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Soft delete venue schedule slot
router.delete('/venues/:venueId/schedule/:scheduleId', requireAuth, requirePermission('venue.schedule.manage'), async (req: AuthRequest, res) => {
  try {
    const venueId = parseInt(req.params.venueId);
    const scheduleId = parseInt(req.params.scheduleId);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: { facilityId: true }
    });
    
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    
    // Check if user has access to this venue's facility
    const hasAccess = await checkFacilityAccess(venue.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Venue not found' });
    
    const existing = await prisma.venueSchedule.findUnique({
      where: { id: scheduleId },
      select: { venueId: true, deletedAt: true }
    });
    if (!existing || existing.venueId !== venueId) return res.status(404).json({ message: 'Schedule not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Already deleted' });
    
    await prisma.venueSchedule.update({
      where: { id: scheduleId },
      data: { deletedAt: new Date() }
    });
    res.json({ ok: true, message: 'Schedule soft deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// =============================================================================
// Card 21 - Ground Schedule & Availability APIs
// =============================================================================

// Check for ground schedule conflicts using minutes comparison
async function checkGroundScheduleConflict(
  groundId: number, 
  dayOfWeek: number | null, 
  specificDate: Date | null,
  startTime: string, 
  endTime: string,
  excludeId?: number
): Promise<boolean> {
  const existingSchedules = await prisma.groundSchedule.findMany({
    where: {
      groundId,
      deletedAt: null,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
      OR: [
        ...(dayOfWeek !== null ? [{ dayOfWeek, isRecurring: true }] : []),
        ...(specificDate ? [{ specificDate }] : [])
      ]
    }
  });

  const newStart = timeToMinutes(startTime);
  const newEnd = timeToMinutes(endTime);

  for (const existing of existingSchedules) {
    const existStart = timeToMinutes(existing.startTime);
    const existEnd = timeToMinutes(existing.endTime);
    if (newStart < existEnd && newEnd > existStart) {
      return true;
    }
  }
  return false;
}

// Create ground schedule slot
router.post('/grounds/:id/schedule', requireAuth, requirePermission('ground.schedule.manage'), async (req: AuthRequest, res) => {
  try {
    const groundId = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const { dayOfWeek, specificDate, startTime, endTime, isRecurring, isBlackout, notes } = req.body;
    
    const ground = await prisma.ground.findUnique({
      where: { id: groundId },
      select: { facilityId: true, deletedAt: true }
    });
    if (!ground) return res.status(404).json({ message: 'Ground not found' });
    if (ground.deletedAt) return res.status(400).json({ message: 'Cannot add schedule to deleted ground' });
    
    // Check if user has access to this ground's facility
    const hasAccess = await checkFacilityAccess(ground.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Ground not found' });
    
    if (!startTime || !endTime) return res.status(400).json({ message: 'startTime and endTime required' });
    if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
      return res.status(400).json({ message: 'Time must be in HH:mm format' });
    }
    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      return res.status(400).json({ message: 'endTime must be after startTime' });
    }
    
    // Validate that exactly one of dayOfWeek or specificDate is provided (not both)
    const hasDayOfWeek = dayOfWeek !== undefined && dayOfWeek !== null;
    const parsedDate = parseDate(specificDate);
    const hasSpecificDate = specificDate !== undefined && parsedDate !== null;
    
    if (!hasDayOfWeek && !hasSpecificDate) {
      return res.status(400).json({ message: 'Either dayOfWeek or specificDate is required' });
    }
    if (hasDayOfWeek && hasSpecificDate) {
      return res.status(400).json({ message: 'Cannot specify both dayOfWeek and specificDate' });
    }
    if (specificDate && !parsedDate) {
      return res.status(400).json({ message: 'Invalid date format for specificDate' });
    }
    
    const hasConflict = await checkGroundScheduleConflict(
      groundId,
      hasDayOfWeek ? dayOfWeek : null,
      parsedDate,
      startTime,
      endTime
    );
    if (hasConflict) return res.status(409).json({ message: 'Schedule conflict detected' });
    
    const schedule = await prisma.groundSchedule.create({
      data: {
        groundId,
        dayOfWeek: hasDayOfWeek ? dayOfWeek : null,
        specificDate: parsedDate,
        startTime,
        endTime,
        isRecurring: isRecurring === true, // Explicit boolean - defaults to false
        isBlackout: isBlackout === true,
        notes: notes || null,
        createdBy: req.user!.id
      },
      select: scheduleSelect
    });
    res.status(201).json(schedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// List ground schedule slots
router.get('/grounds/:id/schedule', requireAuth, async (req: AuthRequest, res) => {
  try {
    const groundId = parseInt(req.params.id);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const ground = await prisma.ground.findUnique({
      where: { id: groundId },
      select: { facilityId: true }
    });
    if (!ground) return res.status(404).json({ message: 'Ground not found' });
    
    // Check if user has access to this ground's facility
    const hasAccess = await checkFacilityAccess(ground.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Ground not found' });
    
    const includeDeleted = req.query.includeDeleted === 'true';
    const blackoutsOnly = req.query.blackouts === 'true';
    const dayOfWeek = req.query.dayOfWeek !== undefined ? parseInt(req.query.dayOfWeek as string) : undefined;
    
    const schedules = await prisma.groundSchedule.findMany({
      where: {
        groundId,
        ...(includeDeleted ? {} : { deletedAt: null }),
        ...(blackoutsOnly ? { isBlackout: true } : {}),
        ...(dayOfWeek !== undefined ? { dayOfWeek } : {})
      },
      select: scheduleSelect,
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
    });
    
    res.json({ data: schedules });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Update ground schedule slot
router.put('/grounds/:groundId/schedule/:scheduleId', requireAuth, requirePermission('ground.schedule.manage'), async (req: AuthRequest, res) => {
  try {
    const groundId = parseInt(req.params.groundId);
    const scheduleId = parseInt(req.params.scheduleId);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const { dayOfWeek, specificDate, startTime, endTime, isRecurring, isBlackout, notes } = req.body;
    
    const ground = await prisma.ground.findUnique({
      where: { id: groundId },
      select: { facilityId: true }
    });
    if (!ground) return res.status(404).json({ message: 'Ground not found' });
    
    // Check if user has access to this ground's facility
    const hasAccess = await checkFacilityAccess(ground.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Ground not found' });
    
    const existing = await prisma.groundSchedule.findUnique({
      where: { id: scheduleId },
      select: { groundId: true, deletedAt: true }
    });
    if (!existing || existing.groundId !== groundId) return res.status(404).json({ message: 'Schedule not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Cannot update deleted schedule' });
    
    if (startTime && !isValidTimeFormat(startTime)) return res.status(400).json({ message: 'startTime must be HH:mm format' });
    if (endTime && !isValidTimeFormat(endTime)) return res.status(400).json({ message: 'endTime must be HH:mm format' });
    
    const data: any = {};
    if (dayOfWeek !== undefined) data.dayOfWeek = dayOfWeek;
    if (specificDate !== undefined) data.specificDate = specificDate ? new Date(specificDate) : null;
    if (startTime !== undefined) data.startTime = startTime;
    if (endTime !== undefined) data.endTime = endTime;
    if (isRecurring !== undefined) data.isRecurring = isRecurring;
    if (isBlackout !== undefined) data.isBlackout = isBlackout;
    if (notes !== undefined) data.notes = notes;
    
    const updated = await prisma.groundSchedule.update({
      where: { id: scheduleId },
      data,
      select: scheduleSelect
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Soft delete ground schedule slot
router.delete('/grounds/:groundId/schedule/:scheduleId', requireAuth, requirePermission('ground.schedule.manage'), async (req: AuthRequest, res) => {
  try {
    const groundId = parseInt(req.params.groundId);
    const scheduleId = parseInt(req.params.scheduleId);
    const isolation = req.isolation;
    if (!isolation) return res.status(400).json({ message: 'Isolation context required' });
    
    const ground = await prisma.ground.findUnique({
      where: { id: groundId },
      select: { facilityId: true }
    });
    if (!ground) return res.status(404).json({ message: 'Ground not found' });
    
    // Check if user has access to this ground's facility
    const hasAccess = await checkFacilityAccess(ground.facilityId, isolation);
    if (!hasAccess) return res.status(404).json({ message: 'Ground not found' });
    
    const existing = await prisma.groundSchedule.findUnique({
      where: { id: scheduleId },
      select: { groundId: true, deletedAt: true }
    });
    if (!existing || existing.groundId !== groundId) return res.status(404).json({ message: 'Schedule not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Already deleted' });
    
    await prisma.groundSchedule.update({
      where: { id: scheduleId },
      data: { deletedAt: new Date() }
    });
    res.json({ ok: true, message: 'Schedule soft deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

export default router;
