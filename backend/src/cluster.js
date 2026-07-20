import cluster from 'cluster';
import os from 'os';
import logger from './utils/logger.js';
import { env } from './config/env.js';

// Respect Render's WEB_CONCURRENCY or fallback to total CPUs
const numCPUs = process.env.WEB_CONCURRENCY ? parseInt(process.env.WEB_CONCURRENCY, 10) : os.cpus().length;

if (cluster.isPrimary) {
  logger.info(`Primary cluster process ${process.pid} is running`);
  logger.info(`Setting up ${numCPUs} workers...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Self-healing: restart workers if they crash
  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
    logger.info('Starting a new worker...');
    cluster.fork();
  });
} else {
  // Workers will just import and run the main server
  import('./server.js').catch(err => {
    logger.error(err, 'Failed to start worker server:');
    process.exit(1);
  });
  logger.info(`Worker ${process.pid} started`);
}
