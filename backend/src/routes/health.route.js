import { Router } from 'express';
import { env } from '../config/env.js';
import { validateDatabaseConnection } from '../config/prisma.js';
import queueService from '../modules/queue/queue.service.js';
import logger from '../utils/logger.js';
import axios from 'axios';

const router = Router();

// ─── Health Checks ───────────────────────────────────────────────────────────

// 1. Database Health
router.get('/database', async (req, res) => {
  const isDbConnected = await validateDatabaseConnection();
  if (isDbConnected) {
    return res.status(200).json({ status: 'up', service: 'database' });
  }
  return res.status(503).json({ status: 'down', service: 'database' });
});

// 2. Queue Health
router.get('/queue', async (req, res) => {
  try {
    // Check if the boss instance is ready and we can access a queue
    if (queueService.boss && queueService.boss.isStarted) {
       await queueService.boss.getQueue('code-review');
       return res.status(200).json({ status: 'up', service: 'queue' });
    }
    return res.status(503).json({ status: 'down', service: 'queue', error: 'Queue service not started' });
  } catch (error) {
    logger.error('Queue health check failed', error);
    return res.status(503).json({ status: 'down', service: 'queue', error: error.message });
  }
});

// 3. AI Module Health
router.get('/ai', (req, res) => {
  // Validate if GEMINI API Key is present in the environment
  const isConfigured = !!env.GEMINI_API_KEY;
  if (isConfigured) {
    return res.status(200).json({ status: 'up', service: 'ai' });
  }
  return res.status(503).json({ status: 'down', service: 'ai', error: 'Missing API Key' });
});

// 4. GitHub Module Health
router.get('/github', async (req, res) => {
  try {
    // Ping GitHub public API to verify outbound network connectivity
    const response = await axios.get('https://api.github.com/zen', {
      timeout: 5000,
    });
    if (response.status === 200) {
      return res.status(200).json({ status: 'up', service: 'github', message: response.data });
    }
    return res.status(503).json({ status: 'down', service: 'github' });
  } catch (error) {
    logger.error('GitHub health check failed', error.message);
    return res.status(503).json({ status: 'down', service: 'github', error: error.message });
  }
});

// 5. Deep Health Metrics (For Datadog / Prometheus / Cron monitors)
router.get('/metrics', async (req, res) => {
  try {
    const memory = process.memoryUsage();
    
    // Estimate queue backlog
    let pendingJobs = 0;
    if (queueService.boss && queueService.boss.isStarted) {
      // PgBoss doesn't have a simple getCount(), but we can do a quick check via state
      const queueDetails = await queueService.boss.getQueue('code-review');
      pendingJobs = queueDetails ? queueDetails.length : 0; // fallback if unsupported
    }
    
    return res.status(200).json({
      uptime: process.uptime(),
      memory: {
        rss_MB: Math.round(memory.rss / 1024 / 1024),
        heapTotal_MB: Math.round(memory.heapTotal / 1024 / 1024),
        heapUsed_MB: Math.round(memory.heapUsed / 1024 / 1024),
      },
      queue: {
        status: queueService.boss && queueService.boss.isStarted ? 'connected' : 'disconnected',
        activeWorkers: 5 // Static for now, as configured in worker
      },
      pid: process.pid
    });
  } catch (error) {
    logger.error('Failed to collect metrics', error);
    return res.status(500).json({ status: 'error', error: error.message });
  }
});

// 5. Comprehensive Health (All Systems)
router.get('/', async (req, res) => {
  try {
    const isDbConnected = await validateDatabaseConnection();
    let isQueueConnected = false;
    
    try {
      if (queueService.boss && queueService.boss.isStarted) {
        await queueService.boss.getQueue('code-review');
        isQueueConnected = true;
      }
    } catch (e) {
      isQueueConnected = false;
    }

    const isSystemHealthy = isDbConnected && isQueueConnected;

    res.status(isSystemHealthy ? 200 : 503).json({
      status: isSystemHealthy ? 'success' : 'fail',
      message: isSystemHealthy ? 'System is healthy' : 'System is degraded',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      checks: {
        database: isDbConnected ? 'connected' : 'disconnected',
        queue: isQueueConnected ? 'connected' : 'disconnected',
        ai: env.GEMINI_API_KEY ? 'configured' : 'missing_config',
      }
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(503).json({
      status: 'fail',
      message: 'System is unhealthy',
      error: error.message
    });
  }
});

export default router;