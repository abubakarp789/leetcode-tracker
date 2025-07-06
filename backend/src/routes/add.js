import express from 'express';
import multer from 'multer';
import basicAuth from 'basic-auth';
import { addProblemToRepo } from '../github.js';

const router = express.Router();
const upload = multer();

function checkAuth(req, res, next) {
  const user = basicAuth(req);
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!user || user.pass !== adminPassword) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required.');
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
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add problem.' });
  }
});

export default router; 