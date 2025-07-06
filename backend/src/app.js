import './loadenv.js'; // This loads .env before anything else

import express from 'express';
import cors from 'cors';
import problemsRouter from './routes/problems.js';
import addRouter from './routes/add.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/problems', problemsRouter);
app.use('/api/add', addRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 