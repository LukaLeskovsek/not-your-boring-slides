import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import presentationRoutes from './src/server/routes/presentation.js';
import { logger, requestLogger } from './src/server/middleware/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3401;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Error logging
app.use((err, req, res, next) => {
  logger.error({
    err,
    req: {
      method: req.method,
      url: req.url,
      body: req.body,
      query: req.query,
    },
  });
  next(err);
});

// API Routes
app.use('/api/presentation', presentationRoutes);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
}); 