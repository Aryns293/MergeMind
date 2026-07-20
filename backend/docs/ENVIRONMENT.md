# Environment Variables Guide

The following environment variables are required for the MergeMind backend to run in production. Keep real values in your hosting provider's secret manager or local `.env` file; do not commit them.

## Database
- `DATABASE_URL`: Connection string for PostgreSQL (e.g. Neon DB). Format: `postgresql://user:pass@host/dbname?sslmode=require`
- `DIRECT_DATABASE_URL`: Direct PostgreSQL connection string for migrations when your provider uses pooling.

## Security & Auth
- `JWT_SECRET`: A long, random cryptographic string for signing JWT tokens.
- `JWT_EXPIRES_IN`: Duration (e.g. `1d`, `7d`).
- `CORS_ORIGIN`: Comma-separated list of allowed frontend URLs (e.g. `https://myfrontend.com`).
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window (default `900000` / 15 mins).
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default `100`).

## External APIs
- `GITHUB_ACCESS_TOKEN`: Personal access token used for server-side GitHub repository access when needed.
- `GEMINI_API_KEY`: API key from Google AI Studio for Gemini 2.5 Flash.

## Server
- `PORT`: The port the server listens on (Render automatically injects this).
- `NODE_ENV`: Must be exactly `production` when deployed.
- `WEB_CONCURRENCY`: (Optional) Automatically injected by some hosts. Used for scaling workers.

## Observability
- `SENTRY_DSN`: (Optional) If provided, automatically enables Sentry APM and Error Tracking.
