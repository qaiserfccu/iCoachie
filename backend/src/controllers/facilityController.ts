import express from 'express';
import prisma from '../db';
import { requireAuth, AuthRequest } from '../middleware/jwtAuth';
import { requireRole, requireScope } from '../middleware';

const router = express.Router();

// Prisma select shapes for optimized payloads
const facilitySelect = {
  id: true,
  name: true,
  address: true,
  clubId: true,
  createdAt: true,
  updatedAt: true
};

const venueSelect = {
  id: true,
  name: true,
  venueType: true,
  facilityId: true,
  createdAt: true,
  updatedAt: true
};

const groundSelect = {
  id: true,
  name: true,
  groundType: true,
  surfaceType: true,
  facilityId: true,
  createdAt: true,
  updatedAt: true
};

const mapVenueResponse = (venue: any) => ({
  ...venue,
  type: venue.type ?? venue.venueType
});

const mapGroundResponse = (ground: any) => ({
  ...ground,
  surface: ground.surface ?? ground.surfaceType
});

// Facilities
router.post('/', requireAuth, requireRole(['SUPER_ADMIN', 'SYSTEM_SUPPORT']), async (req: AuthRequest, res) => {
  try {
    const { name, address } = req.body;
    const clubId = req.user!.clubId;
    if (!name || !address) return res.status(400).json({ message: 'Name and address required' });
    if (!clubId) return res.status(400).json({ message: 'Club context required' });
    const facility = await prisma.facility.create({
      data: { name, address, clubId },
      select: facilitySelect
    });
    res.status(201).json(facility);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clubId = req.user!.clubId;
    if (!clubId) return res.status(400).json({ message: 'Club context required' });
    const facilities = await prisma.facility.findMany({
      where: { clubId },
      select: facilitySelect,
      orderBy: { name: 'asc' }
    });
    res.json(facilities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    const facility = await prisma.facility.findUnique({
      where: { id },
      select: {
        ...facilitySelect,
        _count: {
          select: { venues: true, grounds: true }
        }
      }
    });
    if (!facility || facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    res.json(facility);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.put('/:id', requireAuth, requireScope('FACILITY'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    const { name, address } = req.body;
    if (!name && !address) return res.status(400).json({ message: 'At least one field required' });
    const existing = await prisma.facility.findUnique({ where: { id }, select: { clubId: true } });
    if (!existing || existing.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    const updated = await prisma.facility.update({
      where: { id },
      data: { name, address },
      select: facilitySelect
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN']), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    const existing = await prisma.facility.findUnique({ where: { id }, select: { clubId: true } });
    if (!existing || existing.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    await prisma.facility.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Venues (under facility)
router.post('/:facilityId/venues', requireAuth, requireScope('VENUE'), async (req: AuthRequest, res) => {
  try {
    const facilityId = parseInt(req.params.facilityId);
    const clubId = req.user!.clubId;
    const { name } = req.body;
    const venueType = req.body.venueType ?? req.body.type;
    if (!name || !venueType) return res.status(400).json({ message: 'Venue name and type required' });
    const facility = await prisma.facility.findUnique({ where: { id: facilityId }, select: { clubId: true } });
    if (!facility || facility.clubId !== clubId) return res.status(404).json({ message: 'Facility not found' });
    const venue = await prisma.venue.create({
      data: { name, venueType, facilityId },
      select: venueSelect
    });
    res.status(201).json(mapVenueResponse(venue));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.get('/:facilityId/venues', requireAuth, async (req: AuthRequest, res) => {
  try {
    const facilityId = parseInt(req.params.facilityId);
    const clubId = req.user!.clubId;
    const facility = await prisma.facility.findUnique({ where: { id: facilityId }, select: { clubId: true } });
    if (!facility || facility.clubId !== clubId) return res.status(404).json({ message: 'Facility not found' });
    const venues = await prisma.venue.findMany({
      where: { facilityId },
      select: venueSelect,
      orderBy: { name: 'asc' }
    });
    res.json(venues.map(mapVenueResponse));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Grounds (under facility)
router.post('/:facilityId/grounds', requireAuth, requireScope('GROUND'), async (req: AuthRequest, res) => {
  try {
    const facilityId = parseInt(req.params.facilityId);
    const clubId = req.user!.clubId;
    const { name } = req.body;
    const surfaceType = req.body.surfaceType ?? req.body.surface;
    const groundType = req.body.groundType ?? req.body.type;
    if (!name || !groundType) return res.status(400).json({ message: 'Ground name and type required' });
    const facility = await prisma.facility.findUnique({ where: { id: facilityId }, select: { clubId: true } });
    if (!facility || facility.clubId !== clubId) return res.status(404).json({ message: 'Facility not found' });
    const ground = await prisma.ground.create({
      data: { name, groundType, surfaceType, facilityId },
      select: groundSelect
    });
    res.status(201).json(mapGroundResponse(ground));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.get('/:facilityId/grounds', requireAuth, async (req: AuthRequest, res) => {
  try {
    const facilityId = parseInt(req.params.facilityId);
    const clubId = req.user!.clubId;
    const facility = await prisma.facility.findUnique({ where: { id: facilityId }, select: { clubId: true } });
    if (!facility || facility.clubId !== clubId) return res.status(404).json({ message: 'Facility not found' });
    const grounds = await prisma.ground.findMany({
      where: { facilityId },
      select: groundSelect,
      orderBy: { name: 'asc' }
    });
    res.json(grounds.map(mapGroundResponse));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Venue detail endpoints
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
    res.json({ ...mapVenueResponse(venue), facility: venue.facility });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.put('/venues/:id', requireAuth, requireScope('VENUE'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    const { name } = req.body;
    const venueType = req.body.venueType ?? req.body.type;
    if (!name && !venueType) return res.status(400).json({ message: 'At least one field required' });
    
    const existing = await prisma.venue.findUnique({
      where: { id },
      select: { facility: { select: { clubId: true } } }
    });
    if (!existing || existing.facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    
    const updated = await prisma.venue.update({
      where: { id },
      data: { name, venueType },
      select: venueSelect
    });
    res.json(mapVenueResponse(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.delete('/venues/:id', requireAuth, requireRole(['SUPER_ADMIN', 'FACILITY_MANAGER']), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    
    const existing = await prisma.venue.findUnique({
      where: { id },
      select: { facility: { select: { clubId: true } } }
    });
    if (!existing || existing.facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    
    await prisma.venue.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Ground detail endpoints
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
    res.json({ ...mapGroundResponse(ground), facility: ground.facility });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.put('/grounds/:id', requireAuth, requireScope('GROUND'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    const { name } = req.body;
    const surfaceType = req.body.surfaceType ?? req.body.surface;
    if (!name && !surfaceType) return res.status(400).json({ message: 'At least one field required' });
    
    const existing = await prisma.ground.findUnique({
      where: { id },
      select: { facility: { select: { clubId: true } } }
    });
    if (!existing || existing.facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    
    const updated = await prisma.ground.update({
      where: { id },
      data: { name, surfaceType },
      select: groundSelect
    });
    res.json(mapGroundResponse(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.delete('/grounds/:id', requireAuth, requireRole(['SUPER_ADMIN', 'FACILITY_MANAGER']), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const clubId = req.user!.clubId;
    
    const existing = await prisma.ground.findUnique({
      where: { id },
      select: { facility: { select: { clubId: true } } }
    });
    if (!existing || existing.facility.clubId !== clubId) return res.status(404).json({ message: 'Not found' });
    
    await prisma.ground.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

export default router;
