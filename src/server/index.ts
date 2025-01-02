import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import presentationRoutes from './routes/presentation';
import { logger, requestLogger } from './middleware/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3401;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Error logging
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
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