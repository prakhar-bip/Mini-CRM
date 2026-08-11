import { Router } from 'express';
import {
  register,
  login,
  getMe,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public auth endpoints
router.post('/register', register);
router.post('/login', login);

// Authenticated current user endpoint
router.get('/me', authenticate, getMe);

export default router;
