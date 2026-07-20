import { env } from './env.js';

const isProduction = env.NODE_ENV === 'production';

/**
 * Production Security Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized security settings that adapt based on NODE_ENV.
 * Every decision here follows the "secure by default" principle:
 * production is locked down, development is relaxed for convenience.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Helmet Configuration ──────────────────────────────────────────────────────
// Helmet sets secure HTTP response headers to prevent common web vulnerabilities.
export const helmetConfig = {
  // Content-Security-Policy: Restricts which resources the browser can load.
  // Prevents XSS, clickjacking, and data injection attacks.
  contentSecurityPolicy: isProduction
    ? {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for Swagger UI
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],        // Block <object>, <embed>, <applet>
        frameSrc: ["'none'"],          // Block iframes
        upgradeInsecureRequests: [],   // Upgrade HTTP → HTTPS automatically
      },
    }
    : false, // Disabled in development to avoid blocking local tooling

  // Cross-Origin-Embedder-Policy: Prevents cross-origin resources from loading
  // without explicit permission. Disabled for Swagger UI compatibility.
  crossOriginEmbedderPolicy: false,

  // Cross-Origin-Resource-Policy: Controls who can read this resource cross-origin.
  crossOriginResourcePolicy: { policy: 'same-site' },

  // Referrer-Policy: Controls how much referrer info is sent with requests.
  // 'strict-origin-when-cross-origin' sends the origin on cross-origin requests
  // but the full URL on same-origin requests.
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

  // HSTS: Forces browsers to only connect over HTTPS for 1 year.
  // includeSubDomains ensures all subdomains are also HTTPS-only.
  // preload allows submission to browser preload lists.
  hsts: isProduction
    ? { maxAge: 31536000, includeSubDomains: true, preload: true }
    : false,

  // X-Content-Type-Options: Prevents browsers from MIME-sniffing the content type.
  // Forces the browser to respect the declared Content-Type.
  noSniff: true,

  // X-DNS-Prefetch-Control: Disables DNS prefetching to prevent information leakage.
  dnsPrefetchControl: { allow: false },

  // X-Frame-Options: Prevents the page from being embedded in iframes (clickjacking).
  frameguard: { action: 'deny' },

  // X-Permitted-Cross-Domain-Policies: Prevents Adobe Flash/Acrobat from loading data.
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },

  // Removes the X-Powered-By header to hide that we use Express.
  hidePoweredBy: true,
};

// ── CORS Configuration ────────────────────────────────────────────────────────
// Cross-Origin Resource Sharing: Controls which domains can make API requests.
// In production, only the explicitly configured frontend origin is allowed.
// In development, we allow the default localhost origin.
export const corsConfig = {
  origin: isProduction
    ? (origin, callback) => {
      const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
    : env.CLIENT_URL,
  credentials: true,                                         // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],       // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],         // Allowed request headers
  exposedHeaders: ['X-Request-Id', 'RateLimit-Remaining'],   // Headers the client can read
  maxAge: isProduction ? 86400 : 0,                          // Preflight cache: 24h in prod
};

// ── Rate Limiting Configuration ───────────────────────────────────────────────
// Configures rate limits per tier. Production limits are stricter to prevent abuse.
// All limiters use standard headers (RateLimit-*) and skip legacy X-RateLimit-* headers.
export const rateLimitConfig = {
  global: {
    windowMs: 15 * 60 * 1000,                   // 15 minute window
    max: isProduction ? 500 : 1000,              // 500/15min in prod, relaxed in dev
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Too many requests, please try again later.',
    },
  },
  auth: {
    windowMs: 15 * 60 * 1000,                   // 15 minute window
    max: isProduction ? 10 : 100,                // 10/15min in prod (brute-force protection)
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Too many authentication attempts, please try again later.',
    },
  },
  review: {
    windowMs: 60 * 60 * 1000,                   // 1 hour window
    max: isProduction ? 20 : 200,                // 20/hour in prod (API cost protection)
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Review limit reached. Please try again later.',
    },
  },
};

// ── Trusted Proxy Configuration ───────────────────────────────────────────────
// In production, the app runs behind a reverse proxy (Render, Nginx, AWS ALB).
// Express needs to know this to correctly read the client's real IP from
// X-Forwarded-For headers (used by rate limiting and logging).
// Setting this to 1 means "trust the first proxy" — appropriate for single-proxy
// platforms like Render, Railway, or Heroku.
export const trustProxy = isProduction ? 1 : false;

// ── Cookie Security Configuration ─────────────────────────────────────────────
// If cookies are used in the future (e.g., for refresh tokens or sessions),
// these settings ensure they are transmitted securely.
export const cookieConfig = {
  httpOnly: true,            // JavaScript cannot access the cookie (prevents XSS theft)
  secure: isProduction,      // Only send over HTTPS in production
  sameSite: 'strict',        // Cookie is only sent with same-site requests (CSRF protection)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
