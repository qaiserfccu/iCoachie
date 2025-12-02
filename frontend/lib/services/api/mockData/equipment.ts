// Mock data for equipment inventory
import type { Equipment, EquipmentCheckout } from '../types';

const equipmentNames = [
  'Soccer Balls', 'Basketballs', 'Tennis Rackets', 'Swimming Goggles', 'Cones', 'Hurdles',
  'Jump Ropes', 'Medicine Balls', 'Resistance Bands', 'Yoga Mats', 'Stopwatches', 'First Aid Kit',
  'Pinnies/Bibs', 'Goal Posts', 'Net Systems', 'Weights', 'Foam Rollers', 'Water Bottles',
  'Whistle Set', 'Clipboard'
];

const categories = ['Sports Equipment', 'Training Gear', 'Safety Equipment', 'Accessories', 'Electronic Devices'];
const locations = ['Storage Room A', 'Storage Room B', 'Gym Closet', 'Field House', 'Pool Area'];

export const mockEquipment: Equipment[] = Array.from({ length: 30 }, (_, i) => ({
  id: `equipment-${i + 1}`,
  name: equipmentNames[i % equipmentNames.length],
  category: categories[i % categories.length],
  quantity: 10 + Math.floor(Math.random() * 40),
  availableQuantity: 5 + Math.floor(Math.random() * 30),
  condition: (['excellent', 'good', 'fair', 'poor'] as const)[i % 4],
  location: locations[i % locations.length],
  lastMaintenanceDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  nextMaintenanceDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  purchaseDate: new Date(Date.now() - Math.random() * 365 * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  cost: 50 + Math.floor(Math.random() * 500),
  status: (['available', 'in-use', 'maintenance', 'disposed'] as const)[i % 4 === 3 && i > 25 ? 3 : i % 3],
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const mockEquipmentCheckouts: EquipmentCheckout[] = Array.from({ length: 20 }, (_, i) => {
  const checkoutDate = new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000);
  const expectedReturnDate = new Date(checkoutDate);
  expectedReturnDate.setDate(expectedReturnDate.getDate() + 7);
  const isReturned = i % 3 === 0;
  const isOverdue = !isReturned && expectedReturnDate < new Date();

  return {
    id: `checkout-${i + 1}`,
    equipmentId: `equipment-${(i % 15) + 1}`,
    equipmentName: equipmentNames[(i % 15) % equipmentNames.length],
    userId: `user-${(i % 10) + 1}`,
    userName: ['Coach Mike', 'Coach Sarah', 'Coach David', 'Coach Emily', 'Coach James'][i % 5],
    checkoutDate: checkoutDate.toISOString(),
    expectedReturnDate: expectedReturnDate.toISOString(),
    actualReturnDate: isReturned ? new Date(expectedReturnDate.getTime() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    quantity: 1 + Math.floor(Math.random() * 5),
    status: isReturned ? 'returned' : isOverdue ? 'overdue' : 'checked-out',
    notes: i % 4 === 0 ? 'For practice session' : undefined,
    createdAt: checkoutDate.toISOString(),
  };
});

export const getEquipmentById = (id: string): Equipment | undefined => {
  return mockEquipment.find(eq => eq.id === id);
};

export const getEquipmentByCategory = (category: string): Equipment[] => {
  return mockEquipment.filter(eq => eq.category === category);
};

export const getActiveCheckouts = (): EquipmentCheckout[] => {
  return mockEquipmentCheckouts.filter(c => c.status !== 'returned');
};
