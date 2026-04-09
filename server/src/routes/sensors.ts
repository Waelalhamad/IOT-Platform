import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getSensorHistory } from '../controllers/sensorController';

const router = Router();

router.use(authMiddleware);

router.get('/history', getSensorHistory);

export default router;
