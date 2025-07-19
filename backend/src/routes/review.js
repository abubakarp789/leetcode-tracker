
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { updateRepo } = require('../github');

const problemsFilePath = path.join(__dirname, '..', '..', '..', 'problems.json');

// SM-2 algorithm implementation
function sm2(quality, repetitions, easeFactor, interval) {
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  return { repetitions, easeFactor, interval };
}

router.post('/problems/:id/review', async (req, res) => {
  try {
    const { id } = req.params;
    const { quality } = req.body; // quality: 5-easy, 3-medium, 1-hard

    const problemsData = await fs.readFile(problemsFilePath, 'utf8');
    const problems = JSON.parse(problemsData);

    const problemIndex = problems.findIndex(p => p.id === id);
    if (problemIndex === -1) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const problem = problems[problemIndex];

    const { repetitions, easeFactor, interval } = sm2(
      quality,
      problem.repetitions || 0,
      problem.ease_factor || 2.5,
      problem.review_interval || 1
    );

    const now = new Date();
    const nextReviewDate = new Date();
    nextReviewDate.setDate(now.getDate() + interval);

    problems[problemIndex] = {
      ...problem,
      repetitions,
      ease_factor: easeFactor,
      review_interval: interval,
      last_reviewed_date: now.toISOString(),
      next_review_date: nextReviewDate.toISOString(),
    };

    await fs.writeFile(problemsFilePath, JSON.stringify(problems, null, 2));
    await updateRepo('feat: Update problem review status');

    res.json(problems[problemIndex]);
  } catch (error) {
    console.error('Error reviewing problem:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/problems/review-queue', async (req, res) => {
  try {
    const problemsData = await fs.readFile(problemsFilePath, 'utf8');
    const problems = JSON.parse(problemsData);
    const now = new Date();

    const reviewQueue = problems.filter(p => {
      if (!p.next_review_date) return false;
      const nextReviewDate = new Date(p.next_review_date);
      return nextReviewDate <= now;
    });

    res.json(reviewQueue);
  } catch (error) {
    console.error('Error getting review queue:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
