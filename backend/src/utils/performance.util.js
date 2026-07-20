import logger from './logger.js';
import { performance } from 'perf_hooks';

/**
 * Wraps an asynchronous function to measure and log its execution time.
 * @param {string} label - The label for the metric (e.g., 'AI_API', 'GITHUB_API')
 * @param {Function} asyncFn - The asynchronous function to measure
 * @returns {Promise<any>} - Returns the result of the async function
 */
export const measureLatency = async (label, asyncFn) => {
  const start = performance.now();
  try {
    const result = await asyncFn();
    const end = performance.now();
    logger.info({ metric: label, durationMs: Math.round(end - start) }, `${label} completed successfully`);
    return result;
  } catch (error) {
    const end = performance.now();
    logger.error({ metric: label, durationMs: Math.round(end - start), error: error.message }, `${label} failed`);
    throw error;
  }
};
