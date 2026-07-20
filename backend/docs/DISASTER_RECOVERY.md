# Disaster Recovery Guide

## 1. Database Failure or Corruption

The database is managed entirely by Neon. 
- Neon automatically creates point-in-time recovery snapshots.
- In the event of a catastrophic data failure, log into the Neon Console and restore a branch to a timestamp before the corruption occurred.
- Update the `DATABASE_URL` in the Render environment variables if the connection string changes, and trigger a Manual Deploy.

## 2. Queue (PgBoss) Stalling

If background workers stop picking up code review jobs:
1. Hit the `/api/v1/health/metrics` endpoint and check `activeWorkers`.
2. If activeWorkers is missing, the master node failed to spawn queue listeners.
3. Restart the Render Web Service manually. PgBoss jobs are transactional and stored in the database, so they will automatically resume from where they left off upon restart.

## 3. Rate Limiting by GitHub

If you see GitHub Rate Limit errors:
1. Ensure the `lru-cache` layer is still functioning.
2. The AI Code Reviewer uses authenticated requests using the users GitHub token, which allows 5000 requests per hour per user. No global rate limits should apply, but if they do, users must wait an hour for their individual tokens to reset.

## 4. API Downtime

If Render goes down:
The deployment architecture is completely stateless. You can spin up the backend on any platform that supports Docker (AWS, DigitalOcean, Fly.io, Railway) within minutes by providing the exact same Environment Variables.
