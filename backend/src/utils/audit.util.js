import logger from './logger.js';

/**
 * Dedicated logger for Audit events.
 * Emits logs with a distinct 'type: AUDIT' field for easy querying in log aggregation systems.
 */
export const auditLogger = {
  log: (action, userId, details = {}) => {
    logger.info({
      type: 'AUDIT',
      action,
      userId,
      ...details,
      timestamp: new Date().toISOString()
    }, `AUDIT: ${action} by User ${userId}`);
  },
  
  warn: (action, userId, details = {}) => {
    logger.warn({
      type: 'AUDIT',
      action,
      userId,
      ...details,
      timestamp: new Date().toISOString()
    }, `AUDIT WARNING: ${action} by User ${userId}`);
  }
};
