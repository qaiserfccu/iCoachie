import express, { Request, Response } from 'express';
import { requireAuth } from '../middleware/jwtAuth';
import { requireScope } from '../middleware/rbac';

const router = express.Router();

// TODO: Replace mock data with real database queries when maintenance models are added

/**
 * @swagger
 * /api/maintenance/dashboard:
 *   get:
 *     summary: Get maintenance tech dashboard statistics
 *     tags: [Maintenance]
 */
router.get('/dashboard', requireAuth, requireScope('FACILITY'), async (req: Request, res: Response) => {
  try {
    const stats = {
      activeWorkOrders: 8,
      completedToday: 5,
      preventiveScheduled: 12,
      urgentIssues: 2
    };

    res.json({ stats });
  } catch (error) {
    console.error('Maintenance dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/maintenance/work-orders:
 *   get:
 *     summary: Get work orders
 *     tags: [Maintenance]
 */
router.get('/work-orders', requireAuth, requireScope('FACILITY'), async (req: Request, res: Response) => {
  try {
    const mockWorkOrders = [
      { id: 1, title: 'HVAC System Check', location: 'Building A', priority: 'High', assignedTo: 'Tech Smith', status: 'In Progress', dueDate: '2025-12-10' },
      { id: 2, title: 'Plumbing Repair', location: 'Locker Room', priority: 'Urgent', assignedTo: 'Tech Johnson', status: 'Open', dueDate: '2025-12-09' },
      { id: 3, title: 'Lighting Replacement', location: 'Gymnasium', priority: 'Medium', assignedTo: 'Tech Adams', status: 'Scheduled', dueDate: '2025-12-12' }
    ];

    res.json({ data: mockWorkOrders });
  } catch (error) {
    console.error('Maintenance work orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/maintenance/preventive:
 *   get:
 *     summary: Get preventive maintenance schedule
 *     tags: [Maintenance]
 */
router.get('/preventive', requireAuth, requireScope('FACILITY'), async (req: Request, res: Response) => {
  try {
    const mockPreventive = [
      { id: 1, equipmentName: 'Boiler System', scheduledDate: '2025-12-15', frequency: 'Monthly', lastService: '2025-11-15', status: 'Scheduled' },
      { id: 2, equipmentName: 'Fire Alarm System', scheduledDate: '2025-12-20', frequency: 'Quarterly', lastService: '2025-09-20', status: 'Scheduled' }
    ];

    res.json({ data: mockPreventive });
  } catch (error) {
    console.error('Maintenance preventive error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/maintenance/inventory:
 *   get:
 *     summary: Get maintenance inventory
 *     tags: [Maintenance]
 */
router.get('/inventory', requireAuth, requireScope('FACILITY'), async (req: Request, res: Response) => {
  try {
    const mockInventory = [
      { id: 1, itemName: 'HVAC Filters', quantity: 45, unit: 'units', reorderLevel: 20, status: 'In Stock' },
      { id: 2, itemName: 'Plumbing Pipes (2in)', quantity: 8, unit: 'meters', reorderLevel: 10, status: 'Low Stock' },
      { id: 3, itemName: 'LED Bulbs', quantity: 120, unit: 'units', reorderLevel: 50, status: 'In Stock' }
    ];

    res.json({ data: mockInventory });
  } catch (error) {
    console.error('Maintenance inventory error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
