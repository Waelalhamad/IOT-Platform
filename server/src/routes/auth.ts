import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, refresh, logout } from '../controllers/authController';

const router = Router();

// Strict limiter for login/register — 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
});

// Looser limiter for token refresh — clients call this frequently
const refreshLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many refresh requests.' },
});

router.post('/register', authLimiter, register);
router.post('/login',    authLimiter, login);
router.post('/refresh',  refreshLimiter, refresh);
router.post('/logout',   logout);

export default router;
