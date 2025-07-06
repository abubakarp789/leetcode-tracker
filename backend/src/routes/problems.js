import express from 'express';
import { getProblemsJson } from '../github.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const problems = await getProblemsJson();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch problems.' });
  }
});

export default router; 