import { Router } from 'express';
import { PresentationController } from '../controllers/presentationController';
import { validatePresentation, validateSlide } from '@/server/middleware/validation';
import { errorHandler } from '@/server/middleware/errorHandler';
import { rateLimiter } from '@/server/middleware/rateLimiter';

const router = Router();
const controller = new PresentationController();

// Apply rate limiting to all presentation routes
router.use(rateLimiter);

// Routes
router.get('/', controller.getPresentation);
router.post('/', validatePresentation, controller.savePresentation);
router.put('/slides/:index', validateSlide, controller.updateSlide);

// Error handling
router.use(errorHandler);

export default router; 