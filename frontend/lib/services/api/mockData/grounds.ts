// Mock data for grounds and maintenance
import type { GroundCondition, WorkOrder } from '../types';
import { mockFacilities } from './facilities';

const fieldFacilities = mockFacilities.filter(f => f.type === 'field' || f.type === 'stadium');

export const mockGroundConditions: GroundCondition[] = Array.from({ length: 20 }, (_, i) => ({
  id: `condition-${i + 1}`,
  facilityId: `facility-${(i % 2) + 1}`,
  facilityName: fieldFacilities[i % fieldFacilities.length]?.name || 'Main Soccer Field',
  inspectedBy: `Groundskeeper ${['Smith', 'Johnson', 'Williams'][i % 3]}`,
  inspectionDate: new Date(Date.now() - (i * 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  condition: (['excellent', 'good', 'fair', 'poor'] as const)[i % 4],
  grassHeight: 2 + Math.random() * 2,
  moistureLevel: 40 + Math.random() * 30,
  issues: i % 3 === 0 ? ['Patchy areas near goal', 'Drainage issue in corner'] : i % 4 === 0 ? ['Weed growth detected'] : undefined,
  recommendations: i % 3 === 0 ? ['Reseed affected areas', 'Check drainage system'] : undefined,
  nextInspection: new Date(Date.now() + (7 - (i % 7)) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  createdAt: new Date(Date.now() - (i * 2) * 24 * 60 * 60 * 1000).toISOString(),
}));

export const mockWorkOrders: WorkOrder[] = Array.from({ length: 25 }, (_, i) => ({
  id: `workorder-${i + 1}`,
  orderNumber: `WO-${String(2024)}${String(i + 1).padStart(4, '0')}`,
  title: [
    'Lawn Mowing - Main Field',
    'Irrigation System Check',
    'Line Marking',
    'Goal Post Repair',
    'Drainage Clearing',
    'Fertilizer Application',
    'Weed Treatment',
    'Turf Repair',
    'Sprinkler Head Replacement',
    'Field Aeration',
  ][i % 10],
  description: 'Work order for scheduled maintenance or repair task.',
  type: (['preventive', 'corrective', 'emergency'] as const)[i % 3],
  priority: (['low', 'medium', 'high', 'urgent'] as const)[i % 4],
  facilityId: `facility-${(i % 7) + 1}`,
  facilityName: mockFacilities[i % mockFacilities.length].name,
  assignedTo: i % 4 === 0 ? undefined : `user-${(i % 5) + 1}`,
  assigneeName: i % 4 === 0 ? undefined : ['Tom Wilson', 'Jack Brown', 'Steve Davis', 'Mark Taylor', 'Chris Martin'][i % 5],
  estimatedHours: 1 + Math.floor(Math.random() * 8),
  actualHours: i % 3 === 2 ? 1 + Math.floor(Math.random() * 8) : undefined,
  estimatedCost: 50 + Math.floor(Math.random() * 450),
  actualCost: i % 3 === 2 ? 50 + Math.floor(Math.random() * 450) : undefined,
  parts: i % 2 === 0 ? [
    { name: 'Sprinkler Head', quantity: 2, unitCost: 25 },
    { name: 'PVC Pipe', quantity: 1, unitCost: 15 },
  ] : undefined,
  status: (['open', 'in-progress', 'on-hold', 'completed', 'cancelled'] as const)[i % 5],
  startDate: i % 5 >= 1 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  completedDate: i % 5 === 3 ? new Date().toISOString() : undefined,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const getConditionById = (id: string): GroundCondition | undefined => {
  return mockGroundConditions.find(c => c.id === id);
};

export const getConditionsByFacility = (facilityId: string): GroundCondition[] => {
  return mockGroundConditions.filter(c => c.facilityId === facilityId);
};

export const getLatestCondition = (facilityId: string): GroundCondition | undefined => {
  const conditions = getConditionsByFacility(facilityId);
  return conditions.sort((a, b) => 
    new Date(b.inspectionDate).getTime() - new Date(a.inspectionDate).getTime()
  )[0];
};

export const getWorkOrderById = (id: string): WorkOrder | undefined => {
  return mockWorkOrders.find(w => w.id === id);
};

export const getOpenWorkOrders = (): WorkOrder[] => {
  return mockWorkOrders.filter(w => w.status === 'open' || w.status === 'in-progress');
};

export const getWorkOrdersByPriority = (priority: WorkOrder['priority']): WorkOrder[] => {
  return mockWorkOrders.filter(w => w.priority === priority);
};
