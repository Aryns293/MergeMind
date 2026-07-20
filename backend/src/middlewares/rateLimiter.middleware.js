import rateLimit from 'express-rate-limit';
import { rateLimitConfig } from '../config/security.js';

/**
 * Global rate limiter — applies to all routes.
 * Uses environment-aware config from security.js.
 */
export const globalLimiter = rateLimit(rateLimitConfig.global);

/**
 * Auth rate limiter — strict limit on login/register to prevent brute force.
 * Uses environment-aware config from security.js.
 */
export const authLimiter = rateLimit(rateLimitConfig.auth);

/**
 * AI review rate limiter — prevents API cost abuse.
 * Uses environment-aware config from security.js.
 */
export const reviewLimiter = rateLimit(rateLimitConfig.review);

