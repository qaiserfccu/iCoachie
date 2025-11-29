import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.get('/assesment-skills', async (_, res) => {
  try {
    const q = await pool.query('SELECT * FROM "wp_level_assment_skill" LIMIT 100');
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.get('/assesment-titles', async (_, res) => {
  try {
    const q = await pool.query('SELECT * FROM "wp_level_assment_title" LIMIT 100');
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.get('/program-categories', async (_, res) => {
  try {
    const q = await pool.query('SELECT * FROM "wp_level_program_category" LIMIT 100');
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.get('/program-charts', async (_, res) => {
  try {
    const q = await pool.query('SELECT * FROM "wp_level_program_chart" LIMIT 100');
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.get('/program-groups', async (_, res) => {
  try {
    const q = await pool.query('SELECT * FROM "wp_level_program_groups" LIMIT 100');
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.get('/program-injuries', async (_, res) => {
  try {
    const q = await pool.query('SELECT * FROM "wp_level_program_injury" LIMIT 100');
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.get('/program-links', async (_, res) => {
  try {
    const q = await pool.query('SELECT * FROM "wp_level_program_link" LIMIT 100');
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

router.get('/program-units', async (_, res) => {
  try {
    const q = await pool.query('SELECT * FROM "wp_level_program_unit" LIMIT 100');
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

export default router;
