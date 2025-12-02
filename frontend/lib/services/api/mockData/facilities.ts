// Mock data for facilities and venues
import type { Facility, MaintenanceRequest } from '../types';

export const mockFacilities: Facility[] = [
  {
    id: 'facility-1',
    name: 'Main Soccer Field',
    type: 'field',
    capacity: 500,
    location: 'Building A - Outdoors',
    amenities: ['Floodlights', 'Seating', 'Scoreboard', 'Changing Rooms'],
    hourlyRate: 150,
    status: 'available',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'facility-2',
    name: 'Indoor Basketball Court A',
    type: 'court',
    capacity: 200,
    location: 'Building B - Level 1',
    amenities: ['Air Conditioning', 'Electronic Scoreboard', 'Spectator Seating'],
    hourlyRate: 100,
    status: 'available',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'facility-3',
    name: 'Olympic Swimming Pool',
    type: 'pool',
    capacity: 150,
    location: 'Aquatic Center',
    amenities: ['Heated Pool', 'Diving Boards', 'Timing System', 'Spectator Gallery'],
    hourlyRate: 200,
    status: 'available',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'facility-4',
    name: 'Fitness Center',
    type: 'gym',
    capacity: 50,
    location: 'Building C - Level 2',
    amenities: ['Cardio Equipment', 'Free Weights', 'Personal Training Area'],
    hourlyRate: 30,
    status: 'available',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'facility-5',
    name: 'Conference Room',
    type: 'room',
    capacity: 30,
    location: 'Admin Building - Level 1',
    amenities: ['Projector', 'Video Conferencing', 'Whiteboard', 'Wi-Fi'],
    hourlyRate: 50,
    status: 'available',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'facility-6',
    name: 'Tennis Courts (4)',
    type: 'court',
    capacity: 40,
    location: 'Building A - East Wing',
    amenities: ['Floodlights', 'Ball Machine', 'Seating'],
    hourlyRate: 80,
    status: 'maintenance',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'facility-7',
    name: 'Main Stadium',
    type: 'stadium',
    capacity: 5000,
    location: 'Stadium Complex',
    amenities: ['VIP Boxes', 'Press Room', 'Locker Rooms', 'Medical Facility', 'Parking'],
    hourlyRate: 500,
    status: 'available',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockMaintenanceRequests: MaintenanceRequest[] = Array.from({ length: 15 }, (_, i) => ({
  id: `maintenance-${i + 1}`,
  facilityId: `facility-${(i % 7) + 1}`,
  facilityName: mockFacilities[(i % 7)].name,
  title: [
    'Floodlight Repair',
    'HVAC Maintenance',
    'Pool Filter Replacement',
    'Equipment Tune-up',
    'Floor Resurfacing',
    'Plumbing Issue',
    'Electrical Inspection',
    'Door Lock Replacement',
    'Window Cleaning',
    'Turf Maintenance',
  ][i % 10],
  description: 'Regular maintenance request requiring attention.',
  priority: (['low', 'medium', 'high', 'urgent'] as const)[i % 4],
  status: (['pending', 'in-progress', 'completed', 'cancelled'] as const)[i % 4],
  assignedTo: i % 3 === 0 ? undefined : `user-${(i % 5) + 1}`,
  reportedBy: `user-${(i % 10) + 1}`,
  estimatedCost: 100 + Math.floor(Math.random() * 900),
  actualCost: i % 4 === 2 ? 100 + Math.floor(Math.random() * 900) : undefined,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  completedAt: i % 4 === 2 ? new Date().toISOString() : undefined,
}));

export const getFacilityById = (id: string): Facility | undefined => {
  return mockFacilities.find(f => f.id === id);
};

export const getFacilitiesByType = (type: Facility['type']): Facility[] => {
  return mockFacilities.filter(f => f.type === type);
};

export const getPendingMaintenance = (): MaintenanceRequest[] => {
  return mockMaintenanceRequests.filter(m => m.status === 'pending' || m.status === 'in-progress');
};
