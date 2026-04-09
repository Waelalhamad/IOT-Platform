import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { listDevices, createDevice, deleteDevice, regenApiKey } from '../controllers/deviceController';

const router = Router();

router.use(authMiddleware);

router.get('/', listDevices);
router.post('/', createDevice);
router.delete('/:id', deleteDevice);
router.post('/:id/regen-key', regenApiKey);

export default router;
