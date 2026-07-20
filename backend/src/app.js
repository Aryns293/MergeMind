import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './utils/logger.js';
import { env } from './config/env.js';
import { helmetConfig, corsConfig, trustProxy } from './config/security.js';
import { requestIdMiddleware } from './middlewares/requestId.middleware.js';
import healthRouter from './routes/health.route.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { globalLimiter } from './middlewares/rateLimiter.middleware.js';
import authRoutes from './components/auth/auth.routes.js';
import projectsRoutes from './components/projects/projects.routes.js';
import githubRoutes from './components/github/github.routes.js';
import reviewsRoutes from './components/reviews/reviews.routes.js';
import queueRoutes from './modules/queue/queue.routes.js';
import docsRoutes from './modules/docs/docs.routes.js';

import compression from 'compression';

const app = express();

// ─── Trusted Proxy ───────────────────────────────────────────────────────────
// Required for correct client IP resolution behind reverse proxies
// (Render, Nginx, AWS ALB). Without this, rate limiting and logging
// would see the proxy's IP instead of the real client IP.
app.set('trust proxy', trustProxy);

// ─── Response Compression ────────────────────────────────────────────────────
app.use(compression());

// ─── Security Middlewares ────────────────────────────────────────────────────

// Helmet — sets secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
// Configuration adapts per environment via security.js
app.use(helmet(helmetConfig));

// CORS — controls which origins can make API requests.
// Production: whitelist from CORS_ORIGIN env var (comma-separated).
// Development: allows CLIENT_URL for convenience.
app.use(cors(corsConfig));

// Global rate limiter — environment-aware limits from security.js
app.use(globalLimiter);

// ─── Request Identification ──────────────────────────────────────────────────
// Must come before body parsing and logging so every log entry has a request ID.
app.use(requestIdMiddleware);

// ─── Body Parsing ────────────────────────────────────────────────────────────

// Limit JSON body size to 1MB to prevent denial-of-service via large payloads
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Request Logging ─────────────────────────────────────────────────────────

app.use(
  morgan(':remote-addr - :remote-user [:date[clf]] "[Req: :req[x-request-id]] :method :url HTTP/:http-version" :status :res[content-length] - :response-time ms', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use('/api/v1/health', healthRouter);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api-docs', docsRoutes);

// ─── Error Handler ───────────────────────────────────────────────────────────
// Catch-all custom error handler
app.use(errorHandler);

export default app;

