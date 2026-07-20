import express from 'express';
import { getQueueStats } from './queue.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getQueueStats);

export default router;
