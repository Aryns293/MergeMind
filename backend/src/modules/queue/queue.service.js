import { PgBoss } from 'pg-boss';
import { env } from '../../config/env.js';
import logger from '../../utils/logger.js';
import { processReviewJob } from './review.worker.js';

class QueueService {
  constructor() {
    const dbUrl = env.DIRECT_DATABASE_URL || env.DATABASE_URL;
    const isProd = env.NODE_ENV === 'production';
    
    const config = {
      connectionString: dbUrl,
    };

    // Many cloud providers (Neon, Render, Supabase) require SSL
    if (isProd && !dbUrl.includes('localhost')) {
      config.ssl = { rejectUnauthorized: false };
    }

    this.boss = new PgBoss(config);
    
    this.boss.on('error', (error) => {
      console.error('pg-boss error details:', error);
    });
  }

  async start() {
    try {
      await this.boss.start();
      logger.info('PgBoss queue service started successfully');

      // Explicitly create the queue to prevent 'Queue does not exist' errors
      // if the worker starts polling before the very first job is sent.
      await this.boss.createQueue('code-review');

      // Register workers with concurrency optimizations
      await this.boss.work('code-review', {
        teamSize: 5,        // Number of workers
        teamConcurrency: 5, // Concurrent jobs per worker
        batchSize: 5,       // Fetch 5 jobs at once
      }, async (jobs) => {
        // Process jobs entirely in parallel instead of a sequential for loop
        await Promise.all(jobs.map(async (job) => {
          logger.info(`Processing code-review job: ${job.id}`);
          try {
            await processReviewJob(job.data);
          } catch (error) {
            logger.error(`Error in concurrent review job ${job.id}: ${error.message}`);
            // Don't throw here, otherwise Promise.all fails fast and cancels other parallel jobs
          }
        }));
      });

    } catch (error) {
      logger.error(error, 'Failed to start PgBoss queue service:');
      throw error;
    }
  }

  async addReviewJob(payload) {
    // Retry up to 3 times, with exponential backoff
    const jobId = await this.boss.send('code-review', payload, {
      retryLimit: 3,
      retryBackoff: true,
      expireInSeconds: 300 // 5 minutes max per job
    });
    
    logger.info(`Enqueued code-review job: ${jobId}`);
    return jobId;
  }
  
  async stop() {
    await this.boss.stop();
  }
}

export default new QueueService();
