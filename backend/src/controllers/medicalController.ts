import express, { Request, Response } from 'express';
import { requireAuth } from '../middleware/jwtAuth';
import { requireScope } from '../middleware/rbac';

const router = express.Router();

// TODO: Replace mock data with real database queries when medical models are added

/**
 * @swagger
 * /api/medical/dashboard:
 *   get:
 *     summary: Get medical staff dashboard statistics
 *     tags: [Medical]
 */
router.get('/dashboard', requireAuth, requireScope('CLUB'), async (req: Request, res: Response) => {
  try {
    const stats = {
      activeInjuries: 5,
      checkupsToday: 3,
      medicationAlerts: 2,
      emergencyKitStatus: 'Fully Stocked'
    };

    res.json({ stats });
  } catch (error) {
    console.error('Medical dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/medical/health-records:
 *   get:
 *     summary: Get health records
 *     tags: [Medical]
 */
router.get('/health-records', requireAuth, requireScope('CLUB'), async (req: Request, res: Response) => {
  try {
    const mockRecords = [
      { id: 1, patientName: 'John Doe', recordType: 'Physical Exam', date: '2025-12-01', provider: 'Dr. Smith', status: 'Complete' },
      { id: 2, patientName: 'Jane Smith', recordType: 'Injury Assessment', date: '2025-12-08', provider: 'Dr. Johnson', status: 'Under Review' }
    ];

    res.json({ data: mockRecords });
  } catch (error) {
    console.error('Medical records error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/medical/injuries:
 *   get:
 *     summary: Get injury reports
 *     tags: [Medical]
 */
router.get('/injuries', requireAuth, requireScope('CLUB'), async (req: Request, res: Response) => {
  try {
    const mockInjuries = [
      { id: 1, athleteName: 'John Doe', injuryType: 'Ankle Sprain', date: '2025-12-05', severity: 'Moderate', status: 'Recovering', estimatedRecovery: '2 weeks' },
      { id: 2, athleteName: 'Mike Wilson', injuryType: 'Hamstring Strain', date: '2025-12-07', severity: 'Mild', status: 'Active Treatment', estimatedRecovery: '1 week' }
    ];

    res.json({ data: mockInjuries });
  } catch (error) {
    console.error('Medical injuries error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/medical/first-aid:
 *   get:
 *     summary: Get first aid incidents
 *     tags: [Medical]
 */
router.get('/first-aid', requireAuth, requireScope('CLUB'), async (req: Request, res: Response) => {
  try {
    const mockFirstAid = [
      { id: 1, patientName: 'Sara Lee', incident: 'Minor Cut', treatedBy: 'Nurse Adams', date: '2025-12-09', time: '10:30', location: 'Training Field' },
      { id: 2, patientName: 'Tom Brown', incident: 'Headache', treatedBy: 'Nurse Adams', date: '2025-12-09', time: '14:15', location: 'Gymnasium' }
    ];

    res.json({ data: mockFirstAid });
  } catch (error) {
    console.error('Medical first aid error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
