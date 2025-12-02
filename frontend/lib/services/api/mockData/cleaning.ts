// Mock data for cleaning and supplies
import type { CleaningSchedule, SupplyInventory } from '../types';
import { mockFacilities } from './facilities';

export const mockCleaningSchedules: CleaningSchedule[] = Array.from({ length: 30 }, (_, i) => {
  const scheduledDate = new Date(Date.now() + (i - 15) * 24 * 60 * 60 * 1000);
  const isPast = scheduledDate < new Date();

  return {
    id: `cleaning-${i + 1}`,
    facilityId: `facility-${(i % 7) + 1}`,
    facilityName: mockFacilities[i % mockFacilities.length].name,
    assignedTo: `user-${(i % 5) + 1}`,
    assigneeName: ['Maria Garcia', 'Carlos Rodriguez', 'Ana Martinez', 'Jose Lopez', 'Rosa Hernandez'][i % 5],
    scheduledDate: scheduledDate.toISOString().split('T')[0],
    scheduledTime: ['06:00', '08:00', '10:00', '14:00', '18:00'][i % 5],
    frequency: (['daily', 'weekly', 'biweekly', 'monthly'] as const)[i % 4],
    tasks: [
      'Sweep and mop floors',
      'Clean restrooms',
      'Empty trash bins',
      'Wipe down surfaces',
      'Vacuum carpets',
    ].slice(0, 3 + (i % 3)),
    status: isPast ? (i % 5 === 0 ? 'missed' : 'completed') : (i % 3 === 0 ? 'in-progress' : 'pending'),
    notes: i % 4 === 0 ? 'Deep cleaning required' : undefined,
    completedAt: isPast && i % 5 !== 0 ? scheduledDate.toISOString() : undefined,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

export const mockSupplyInventory: SupplyInventory[] = [
  { id: 'supply-1', name: 'Floor Cleaner', category: 'cleaning', quantity: 24, unit: 'bottles', minStock: 10, location: 'Storage A', status: 'in-stock', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'supply-2', name: 'Hand Sanitizer', category: 'sanitization', quantity: 50, unit: 'bottles', minStock: 20, location: 'Storage A', status: 'in-stock', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'supply-3', name: 'Toilet Paper', category: 'consumables', quantity: 100, unit: 'rolls', minStock: 50, location: 'Storage B', status: 'in-stock', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'supply-4', name: 'Paper Towels', category: 'consumables', quantity: 30, unit: 'packs', minStock: 25, location: 'Storage B', status: 'low-stock', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'supply-5', name: 'Mops', category: 'equipment', quantity: 8, unit: 'units', minStock: 5, location: 'Janitor Closet', status: 'in-stock', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'supply-6', name: 'Brooms', category: 'equipment', quantity: 6, unit: 'units', minStock: 4, location: 'Janitor Closet', status: 'in-stock', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'supply-7', name: 'Glass Cleaner', category: 'cleaning', quantity: 5, unit: 'bottles', minStock: 8, location: 'Storage A', status: 'low-stock', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'supply-8', name: 'Disinfectant Spray', category: 'sanitization', quantity: 0, unit: 'cans', minStock: 10, location: 'Storage A', status: 'out-of-stock', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'supply-9', name: 'Trash Bags (Large)', category: 'consumables', quantity: 200, unit: 'bags', minStock: 100, location: 'Storage B', status: 'in-stock', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'supply-10', name: 'Vacuum Bags', category: 'equipment', quantity: 15, unit: 'bags', minStock: 10, location: 'Janitor Closet', status: 'in-stock', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const getSchedulesByFacility = (facilityId: string): CleaningSchedule[] => {
  return mockCleaningSchedules.filter(s => s.facilityId === facilityId);
};

export const getTodaySchedules = (): CleaningSchedule[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockCleaningSchedules.filter(s => s.scheduledDate === today);
};

export const getPendingSchedules = (): CleaningSchedule[] => {
  return mockCleaningSchedules.filter(s => s.status === 'pending');
};

export const getLowStockSupplies = (): SupplyInventory[] => {
  return mockSupplyInventory.filter(s => s.status === 'low-stock' || s.status === 'out-of-stock');
};
