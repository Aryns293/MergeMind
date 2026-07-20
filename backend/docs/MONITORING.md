# Production Monitoring Guide

MergeMind Backend has been built with native observability and monitoring features.

## 1. Deep Health Endpoint

You can set up external uptime monitoring tools (like UptimeRobot, Datadog, or simple cron jobs) to ping the internal metrics endpoint:

```
GET /api/v1/health/metrics
```

**Response Format:**
```json
{
  "uptime": 1205.34,
  "memory": {
    "rss_MB": 125,
    "heapTotal_MB": 64,
    "heapUsed_MB": 48
  },
  "queue": {
    "status": "connected",
    "activeWorkers": 5
  },
  "pid": 26
}
```

This ensures you can monitor for memory leaks or disconnected queues without SSH-ing into the server.

## 2. Correlation Logging

All logs in production are formatted in JSON using **Pino**.
When background jobs are executed via the PgBoss queue, they include a `correlationId` field in the log JSON.

This `correlationId` maps exactly to the `x-request-id` header generated when the user originally hit the API. You can filter your logs in Render by this ID to see the entire lifecycle of a request, from HTTP to background AI processing.
