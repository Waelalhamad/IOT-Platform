import { Router } from 'express';
import { mqttAuth, mqttAcl } from '../controllers/mqttAuthController';

const router = Router();

// These routes are called by EMQX broker internally — no JWT, protected by x-emqx-secret header
router.post('/auth', mqttAuth);
router.post('/acl', mqttAcl);

export default router;
