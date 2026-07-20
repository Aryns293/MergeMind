import { PrismaClient } from '@prisma/client';
import { env } from './env.js';
import logger from '../utils/logger.js';

const isProduction = env.NODE_ENV === 'production';

const prisma = new PrismaClient({
  log: isProduction
    ? [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ]
    : [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});

// In development, log all queries for debugging
if (!isProduction) {
  prisma.$on('query', (e) => {
    logger.debug({
      query: e.query,
      params: e.params,
      durationMs: e.duration,
    }, 'Prisma Query');
  });
}

prisma.$on('error', (e) => {
  logger.error({ error: e.message }, 'Prisma Error');
});

prisma.$on('warn', (e) => {
  logger.warn({ warning: e.message }, 'Prisma Warning');
});

/**
 * Validates the database connection.
 * Used by health checks and startup verification.
 * @returns {Promise<boolean>}
 */
export async function validateDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error({ error: error.message }, 'Database connection validation failed');
    return false;
  }
}

/**
 * Gracefully disconnects from the database.
 * Called during graceful shutdown.
 */
export async function disconnectDatabase() {
  await prisma.$disconnect();
  logger.info('Database connection closed');
}

export default prisma;

