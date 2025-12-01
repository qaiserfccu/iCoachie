import express from 'express';
import {
  getAllUserStatuses,
  getAllSessionStatuses,
  getAllAttendanceStatuses,
  getAllPaymentStatuses,
  getAllBookingStatuses
} from '../utils/lookups';

const router = express.Router();

// Get all user statuses
router.get('/user', async (_, res) => {
  try {
    const statuses = await getAllUserStatuses();
    res.json(statuses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get all session statuses
router.get('/session', async (_, res) => {
  try {
    const statuses = await getAllSessionStatuses();
    res.json(statuses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get all attendance statuses
router.get('/attendance', async (_, res) => {
  try {
    const statuses = await getAllAttendanceStatuses();
    res.json(statuses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get all payment statuses
router.get('/payment', async (_, res) => {
  try {
    const statuses = await getAllPaymentStatuses();
    res.json(statuses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Get all booking statuses
router.get('/booking', async (_, res) => {
  try {
    const statuses = await getAllBookingStatuses();
    res.json(statuses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

export default router;
