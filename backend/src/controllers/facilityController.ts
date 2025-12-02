import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole, requireScope, requirePermission } from '../middleware';

const router = express.Router();

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
  clubId: true,
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
  page?: number;
  pageSize?: number;
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
  clubId: facility.clubId,
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
    const clubId = req.user!.clubId;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    if (!clubId) return res.status(400).json({ message: 'Club context required' });
    
    const facility = await prisma.facility.create({
      data: { 
        name, 
        address: address || null,
        location: location || null,
        description: description || null,
        amenities: amenities || [],
        managerId: managerId || null,
        clubId 
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
    const clubId = req.user!.clubId;
    if (!clubId) return res.status(400).json({ message: 'Club context required' });
    
    const { page, pageSize, search } = parsePaginationParams(req.query);
    const includeDeleted = req.query.includeDeleted === 'true';
    
    const where: any = { 
      clubId,
      ...(includeDeleted ? {} : { deletedAt: null }),
      ...(search ? { 
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } }
        ]
      } : {})
    };
    
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
    const clubId = req.user!.clubId;
    const facility = await prisma.facility.findUnique({
      where: { id },
      select: {
        ...facilitySelect,
        _count: { select: { venues: true, grounds: true } }
      }
    });
    if (!facility || facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
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
    const clubId = req.user!.clubId;
    const { name, address, location, description, amenities } = req.body;
    
    if (!name && !address && !location && !description && !amenities) {
      return res.status(400).json({ message: 'At least one field required' });
    }
    
    const existing = await prisma.facility.findUnique({ where: { id }, select: { clubId: true, deletedAt: true } });
    if (!existing || existing.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
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
    const clubId = req.user!.clubId;
    const existing = await prisma.facility.findUnique({ where: { id }, select: { clubId: true, deletedAt: true } });
    if (!existing || existing.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
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
    const clubId = req.user!.clubId;
    const existing = await prisma.facility.findUnique({ where: { id }, select: { clubId: true, deletedAt: true } });
    if (!existing || existing.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
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
    const clubId = req.user!.clubId;
    const { managerId } = req.body;
    
    if (managerId === undefined) return res.status(400).json({ message: 'managerId required' });
    
    const existing = await prisma.facility.findUnique({ where: { id }, select: { clubId: true, deletedAt: true } });
    if (!existing || existing.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Cannot update deleted facility' });
    
    // Verify manager exists and belongs to club if provided
    if (managerId) {
      const manager = await prisma.user.findUnique({ where: { id: managerId }, select: { clubId: true } });
      if (!manager || manager.clubId !== clubId) {
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
    const clubId = req.user!.clubId;
    
    const facility = await prisma.facility.findUnique({ 
      where: { id }, 
      select: { 
        clubId: true,
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
    if (!facility || facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    
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
    const clubId = req.user!.clubId;
    const { userId } = req.body;
    
    if (!userId) return res.status(400).json({ message: 'userId required' });
    
    const facility = await prisma.facility.findUnique({ where: { id }, select: { clubId: true, deletedAt: true } });
    if (!facility || facility.clubId !== clubId) return res.status(404).json({ message: 'Facility not found' });
    if (facility.deletedAt) return res.status(400).json({ message: 'Cannot update deleted facility' });
    
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { clubId: true } });
    if (!user || user.clubId !== clubId) return res.status(400).json({ message: 'Invalid user ID' });
    
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
    const clubId = req.user!.clubId;
    
    const facility = await prisma.facility.findUnique({ where: { id }, select: { clubId: true } });
    if (!facility || facility.clubId !== clubId) return res.status(404).json({ message: 'Facility not found' });
    
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
    const clubId = req.user!.clubId;
    const { name, capacity, hourlyRate, isAvailable, amenities, managerId } = req.body;
    const venueType = req.body.venueType ?? req.body.type;
    
    if (!name || !venueType) return res.status(400).json({ message: 'Venue name and type required' });
    
    const facility = await prisma.facility.findUnique({ where: { id: facilityId }, select: { clubId: true, deletedAt: true } });
    if (!facility || facility.clubId !== clubId) return res.status(404).json({ message: 'Facility not found' });
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
    const clubId = req.user!.clubId;
    
    const facility = await prisma.facility.findUnique({ where: { id: facilityId }, select: { clubId: true } });
    if (!facility || facility.clubId !== clubId) return res.status(404).json({ message: 'Facility not found' });
    
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
    const clubId = req.user!.clubId;
    const { name, dimensions, capacity, isAvailable, managerId } = req.body;
    const surfaceType = req.body.surfaceType ?? req.body.surface;
    const groundType = req.body.groundType ?? req.body.type;
    
    if (!name || !groundType) return res.status(400).json({ message: 'Ground name and type required' });
    
    const facility = await prisma.facility.findUnique({ where: { id: facilityId }, select: { clubId: true, deletedAt: true } });
    if (!facility || facility.clubId !== clubId) return res.status(404).json({ message: 'Facility not found' });
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
    const clubId = req.user!.clubId;
    
    const facility = await prisma.facility.findUnique({ where: { id: facilityId }, select: { clubId: true } });
    if (!facility || facility.clubId !== clubId) return res.status(404).json({ message: 'Facility not found' });
    
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
    const clubId = req.user!.clubId;
    const venue = await prisma.venue.findUnique({
      where: { id },
      select: {
        ...venueSelect,
        facility: {
          select: { id: true, name: true, clubId: true }
        }
      }
    });
    if (!venue || venue.facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
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
    const clubId = req.user!.clubId;
    const { name, capacity, hourlyRate, isAvailable, amenities } = req.body;
    const venueType = req.body.venueType ?? req.body.type;
    
    if (name === undefined && venueType === undefined && capacity === undefined && 
        hourlyRate === undefined && isAvailable === undefined && amenities === undefined) {
      return res.status(400).json({ message: 'At least one field required' });
    }
    
    const existing = await prisma.venue.findUnique({
      where: { id },
      select: { facility: { select: { clubId: true } }, deletedAt: true }
    });
    if (!existing || existing.facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Cannot update deleted venue' });
    
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
    const clubId = req.user!.clubId;
    
    const existing = await prisma.venue.findUnique({
      where: { id },
      select: { facility: { select: { clubId: true } }, deletedAt: true }
    });
    if (!existing || existing.facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Already deleted' });
    
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
    const clubId = req.user!.clubId;
    
    const existing = await prisma.venue.findUnique({
      where: { id },
      select: { facility: { select: { clubId: true } }, deletedAt: true }
    });
    if (!existing || existing.facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    if (!existing.deletedAt) return res.status(400).json({ message: 'Venue is not deleted' });
    
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
    const clubId = req.user!.clubId;
    const { managerId } = req.body;
    
    if (managerId === undefined) return res.status(400).json({ message: 'managerId required' });
    
    const existing = await prisma.venue.findUnique({
      where: { id },
      select: { facility: { select: { clubId: true } }, deletedAt: true }
    });
    if (!existing || existing.facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Cannot update deleted venue' });
    
    if (managerId) {
      const manager = await prisma.user.findUnique({ where: { id: managerId }, select: { clubId: true } });
      if (!manager || manager.clubId !== clubId) {
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
    const clubId = req.user!.clubId;
    const ground = await prisma.ground.findUnique({
      where: { id },
      select: {
        ...groundSelect,
        facility: {
          select: { id: true, name: true, clubId: true }
        }
      }
    });
    if (!ground || ground.facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
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
    const clubId = req.user!.clubId;
    const { name, dimensions, capacity, isAvailable } = req.body;
    const surfaceType = req.body.surfaceType ?? req.body.surface;
    const groundType = req.body.groundType ?? req.body.type;
    
    if (name === undefined && surfaceType === undefined && groundType === undefined && 
        dimensions === undefined && capacity === undefined && isAvailable === undefined) {
      return res.status(400).json({ message: 'At least one field required' });
    }
    
    const existing = await prisma.ground.findUnique({
      where: { id },
      select: { facility: { select: { clubId: true } }, deletedAt: true }
    });
    if (!existing || existing.facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Cannot update deleted ground' });
    
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
    const clubId = req.user!.clubId;
    
    const existing = await prisma.ground.findUnique({
      where: { id },
      select: { facility: { select: { clubId: true } }, deletedAt: true }
    });
    if (!existing || existing.facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Already deleted' });
    
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
    const clubId = req.user!.clubId;
    
    const existing = await prisma.ground.findUnique({
      where: { id },
      select: { facility: { select: { clubId: true } }, deletedAt: true }
    });
    if (!existing || existing.facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    if (!existing.deletedAt) return res.status(400).json({ message: 'Ground is not deleted' });
    
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
    const clubId = req.user!.clubId;
    const { managerId } = req.body;
    
    if (managerId === undefined) return res.status(400).json({ message: 'managerId required' });
    
    const existing = await prisma.ground.findUnique({
      where: { id },
      select: { facility: { select: { clubId: true } }, deletedAt: true }
    });
    if (!existing || existing.facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    if (existing.deletedAt) return res.status(400).json({ message: 'Cannot update deleted ground' });
    
    if (managerId) {
      const manager = await prisma.user.findUnique({ where: { id: managerId }, select: { clubId: true } });
      if (!manager || manager.clubId !== clubId) {
        return res.status(400).json({ message: 'Invalid manager ID' });
      }
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

// Validate time format HH:mm
function isValidTimeFormat(time: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

// Check for schedule conflicts
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

  for (const existing of existingSchedules) {
    // Simple overlap check: if new slot overlaps with existing
    if (startTime < existing.endTime && endTime > existing.startTime) {
      return true; // Conflict found
    }
  }
  return false;
}

// Create venue schedule slot
router.post('/venues/:id/schedule', requireAuth, requirePermission('venue.schedule.manage'), async (req: AuthRequest, res) => {
  try {
    const venueId = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    const { dayOfWeek, specificDate, startTime, endTime, isRecurring, isBlackout, notes } = req.body;
    
    // Validate venue exists and belongs to user's club
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: { facility: { select: { clubId: true } }, deletedAt: true }
    });
    if (!venue || venue.facility.clubId !== clubId) return res.status(404).json({ message: 'Venue not found' });
    if (venue.deletedAt) return res.status(400).json({ message: 'Cannot add schedule to deleted venue' });
    
    // Validate required fields
    if (!startTime || !endTime) return res.status(400).json({ message: 'startTime and endTime required' });
    if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
      return res.status(400).json({ message: 'Time must be in HH:mm format' });
    }
    if (startTime >= endTime) return res.status(400).json({ message: 'endTime must be after startTime' });
    
    // Either dayOfWeek (for recurring) or specificDate (for one-off) must be provided
    if (dayOfWeek === undefined && !specificDate) {
      return res.status(400).json({ message: 'dayOfWeek or specificDate required' });
    }
    
    // Check for conflicts
    const hasConflict = await checkVenueScheduleConflict(
      venueId,
      dayOfWeek ?? null,
      specificDate ? new Date(specificDate) : null,
      startTime,
      endTime
    );
    if (hasConflict) return res.status(409).json({ message: 'Schedule conflict detected' });
    
    const schedule = await prisma.venueSchedule.create({
      data: {
        venueId,
        dayOfWeek: dayOfWeek ?? null,
        specificDate: specificDate ? new Date(specificDate) : null,
        startTime,
        endTime,
        isRecurring: isRecurring !== false,
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
    const clubId = req.user!.clubId;
    
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: { facility: { select: { clubId: true } } }
    });
    if (!venue || venue.facility.clubId !== clubId) return res.status(404).json({ message: 'Venue not found' });
    
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
    const clubId = req.user!.clubId;
    const { dayOfWeek, specificDate, startTime, endTime, isRecurring, isBlackout, notes } = req.body;
    
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: { facility: { select: { clubId: true } } }
    });
    if (!venue || venue.facility.clubId !== clubId) return res.status(404).json({ message: 'Venue not found' });
    
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
    const clubId = req.user!.clubId;
    
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: { facility: { select: { clubId: true } } }
    });
    if (!venue || venue.facility.clubId !== clubId) return res.status(404).json({ message: 'Venue not found' });
    
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

// Check for ground schedule conflicts
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

  for (const existing of existingSchedules) {
    if (startTime < existing.endTime && endTime > existing.startTime) {
      return true;
    }
  }
  return false;
}

// Create ground schedule slot
router.post('/grounds/:id/schedule', requireAuth, requirePermission('ground.schedule.manage'), async (req: AuthRequest, res) => {
  try {
    const groundId = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    const { dayOfWeek, specificDate, startTime, endTime, isRecurring, isBlackout, notes } = req.body;
    
    const ground = await prisma.ground.findUnique({
      where: { id: groundId },
      select: { facility: { select: { clubId: true } }, deletedAt: true }
    });
    if (!ground || ground.facility.clubId !== clubId) return res.status(404).json({ message: 'Ground not found' });
    if (ground.deletedAt) return res.status(400).json({ message: 'Cannot add schedule to deleted ground' });
    
    if (!startTime || !endTime) return res.status(400).json({ message: 'startTime and endTime required' });
    if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
      return res.status(400).json({ message: 'Time must be in HH:mm format' });
    }
    if (startTime >= endTime) return res.status(400).json({ message: 'endTime must be after startTime' });
    
    if (dayOfWeek === undefined && !specificDate) {
      return res.status(400).json({ message: 'dayOfWeek or specificDate required' });
    }
    
    const hasConflict = await checkGroundScheduleConflict(
      groundId,
      dayOfWeek ?? null,
      specificDate ? new Date(specificDate) : null,
      startTime,
      endTime
    );
    if (hasConflict) return res.status(409).json({ message: 'Schedule conflict detected' });
    
    const schedule = await prisma.groundSchedule.create({
      data: {
        groundId,
        dayOfWeek: dayOfWeek ?? null,
        specificDate: specificDate ? new Date(specificDate) : null,
        startTime,
        endTime,
        isRecurring: isRecurring !== false,
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
    const clubId = req.user!.clubId;
    
    const ground = await prisma.ground.findUnique({
      where: { id: groundId },
      select: { facility: { select: { clubId: true } } }
    });
    if (!ground || ground.facility.clubId !== clubId) return res.status(404).json({ message: 'Ground not found' });
    
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
    const clubId = req.user!.clubId;
    const { dayOfWeek, specificDate, startTime, endTime, isRecurring, isBlackout, notes } = req.body;
    
    const ground = await prisma.ground.findUnique({
      where: { id: groundId },
      select: { facility: { select: { clubId: true } } }
    });
    if (!ground || ground.facility.clubId !== clubId) return res.status(404).json({ message: 'Ground not found' });
    
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
    const clubId = req.user!.clubId;
    
    const ground = await prisma.ground.findUnique({
      where: { id: groundId },
      select: { facility: { select: { clubId: true } } }
    });
    if (!ground || ground.facility.clubId !== clubId) return res.status(404).json({ message: 'Ground not found' });
    
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
