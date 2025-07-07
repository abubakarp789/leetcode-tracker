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

// Add route to get a single problem by ID
router.get('/:id', async (req, res) => {
  try {
    const problems = await getProblemsJson();
    const id = req.params.id;
    // Support both string and number IDs, and leading zeros
    const problem = problems.find(p => p.id === id || p.id === Number(id) || p.id === id.replace(/^0+/, ''));
    if (problem) {
      res.json(problem);
    } else {
      res.status(404).json({ error: 'Problem not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch problem.' });
  }
});

export default router; 