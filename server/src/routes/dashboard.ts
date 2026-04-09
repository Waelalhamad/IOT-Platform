import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getDashboard, putDashboard } from '../controllers/dashboardController';

const router = Router();

router.use(authMiddleware);

router.get('/', getDashboard);
router.put('/', putDashboard);

export default router;
