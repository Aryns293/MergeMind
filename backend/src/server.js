import app from './app.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';
import http from 'http';
import socketService from './modules/socket/socket.service.js';
import queueService from './modules/queue/queue.service.js';
import { disconnectDatabase } from './config/prisma.js';

let server;

const startServer = async () => {
  try {
    server = http.createServer(app);

    // Initialize Socket.IO
    socketService.init(server);

    // Initialize PgBoss Job Queue
    await queueService.start();

    server.listen(env.PORT, () => {
      logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

  } catch (error) {
    logger.error(error, 'Error starting server:');
    process.exit(1);
  }
};

// ─── Graceful Shutdown Handler ───────────────────────────────────────────────
const gracefulShutdown = async (signal) => {
  // Use console.log for shutdown sequence to ensure synchronous output on Windows
  // Pino's worker threads (pino-pretty) are often killed instantly on Ctrl+C in Windows
  console.log(`\n[Graceful Shutdown] Received ${signal}. Starting teardown...`);
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  // 1. Stop accepting new HTTP requests
  if (server) {
    console.log('[Graceful Shutdown] Closing HTTP server...');
    logger.info('Closing HTTP server...');
    server.close(() => {
      console.log('[Graceful Shutdown] HTTP server closed');
      logger.info('HTTP server closed');
    });
  }

  try {
    // 2. Stop accepting new Socket.IO connections and disconnect clients
    await socketService.close();

    // 3. Stop pg-boss background jobs (wait for active jobs to finish)
    if (queueService.boss) {
      console.log('[Graceful Shutdown] Stopping queue service...');
      logger.info('Stopping queue service...');
      await queueService.stop();
    }

    // 4. Disconnect from database
    console.log('[Graceful Shutdown] Disconnecting from database...');
    await disconnectDatabase();

    console.log('[Graceful Shutdown] Completed successfully. Exiting.');
    logger.info('Graceful shutdown completed successfully');

    // Allow stdout/logger time to flush before the process abruptly exits
    setTimeout(() => {
      if (signal === 'SIGUSR2') {
        // Nodemon expects us to kill ourselves with SIGUSR2 after cleanup to trigger the restart
        process.kill(process.pid, 'SIGUSR2');
      } else {
        process.exit(0);
      }
    }, 500); // Increased to 500ms for safety
  } catch (error) {
    console.error('[Graceful Shutdown] Error:', error);
    logger.error(error, 'Error during graceful shutdown:');
    setTimeout(() => process.exit(1), 500);
  }
};

// Listen for termination signals from Docker/Kubernetes/OS
process.once('SIGINT', () => gracefulShutdown('SIGINT'));
process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));
// SIGUSR2 is sent by nodemon when a restart is triggered
process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

// ─── Global Error Handlers ───────────────────────────────────────────────────
process.on('uncaughtException', (error) => {
  logger.fatal('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

startServer();
