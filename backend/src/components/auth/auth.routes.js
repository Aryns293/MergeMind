import { Router } from 'express';
import { register, login, getProfile } from './auth.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from './auth.validator.js';
import { authLimiter } from '../../middlewares/rateLimiter.middleware.js';

const router = Router();

// Apply auth-specific rate limiter to all auth routes
router.use(authLimiter);

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected route
router.get('/profile', protect, getProfile);

export default router;
