import logger from '../utils/logger.js';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Prisma known request errors (e.g., unique constraint violations)
  if (err.code === 'P2002') {
    statusCode = 409;
    const field = err.meta?.target?.[0] || 'field';
    message = `A record with this ${field} already exists.`;
  }

  // Handle Prisma record not found
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'The requested record was not found.';
  }

  // Handle JSON parse errors (malformed request body)
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body.';
  }

  // Handle payload too large
  if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body is too large.';
  }

  logger.error({ err, statusCode, url: req.originalUrl }, message);

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
