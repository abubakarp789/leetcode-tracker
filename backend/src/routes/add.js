import express from 'express';
import multer from 'multer';
import { addProblemToRepo } from '../github.js';

const router = express.Router();
const upload = multer();

// Secure authentication using a bearer token
function checkAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!token || token !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized: Access is denied.' });
  }
  next();
}

router.post('/', checkAuth, upload.single('solution'), async (req, res) => {
  try {
    const { id, title, difficulty, tags, status, date, language, notes } = req.body;
    const solutionFile = req.file;

    if (!id || !title || !difficulty || !tags || !status || !date || !language || !solutionFile) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const filename = `${id}-${title.toLowerCase().replace(/\s+/g, '-')}.${language.toLowerCase()}`;

    await addProblemToRepo({
      id,
      title,
      difficulty,
      tags: Array.isArray(tags) ? tags : tags.split(','),
      status,
      date,
      language,
      filename,
      notes: notes || ''
    }, solutionFile);

    res.status(201).json({ success: true, message: 'Problem added successfully.' });
  } catch (err) {
    console.error('Error adding problem:', err);
    res.status(500).json({ error: 'Failed to add problem due to a server error.' });
  }
});

export default router; 