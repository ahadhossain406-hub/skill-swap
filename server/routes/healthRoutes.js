import { Router } from 'express';
import { pool } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// GET /api/health: server ar database thik ache kina check.
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const [[{ users }]] = await pool.query('SELECT COUNT(*) AS users FROM users');
    const [[{ skills }]] = await pool.query('SELECT COUNT(*) AS skills FROM skills');

    res.json({ status: 'ok', database: 'connected', counts: { users, skills } });
  })
);

export default router;