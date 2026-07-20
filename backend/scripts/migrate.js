#!/usr/bin/env node

/**
 * Database Migration Script for Production Deployment
 * ─────────────────────────────────────────────────────────────────────────────
 * This script runs Prisma migrations safely in production with:
 *   - Pre-migration connection validation
 *   - Migration execution via `prisma migrate deploy`
 *   - Post-migration schema verification
 *   - Clear exit codes for CI/CD pipelines
 *
 * Usage:
 *   node scripts/migrate.js              → Run migrations
 *   npm run db:migrate:prod              → Alias via package.json
 *
 * Exit codes:
 *   0 = Success
 *   1 = Migration failed
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  console.log(' Starting production database migration...\n');

  // ── Step 1: Validate connection ──────────────────────────────────────────
  try {
    console.log('  [1/3] Validating database connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('  Database connection verified.\n');
  } catch (error) {
    console.error('  Cannot connect to database:', error.message);
    process.exit(1);
  }

  // ── Step 2: Run migrations ───────────────────────────────────────────────
  try {
    console.log('  [2/3] Applying pending migrations...');
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: process.env,
    });
    console.log(' Migrations applied successfully.\n');
  } catch (error) {
    console.error('Migration failed:', error.message);
    console.error('\n ROLLBACK REQUIRED: Review the failed migration and fix manually.');
    console.error('  See: https://www.prisma.io/docs/guides/deployment/deploy-database-changes');
    process.exit(1);
  }

  // ── Step 3: Verify schema ────────────────────────────────────────────────
  try {
    console.log('  [3/3] Verifying database schema...');
    // Query a table from each major model to verify schema integrity
    await prisma.user.count();
    await prisma.project.count();
    await prisma.review.count();
    console.log(' Schema verification passed.\n');
  } catch (error) {
    console.error('  Schema verification failed:', error.message);
    console.error('  The migration may have partially applied. Manual intervention required.');
    process.exit(1);
  }

  console.log(' Database migration completed successfully!');
}

migrate()
  .catch((error) => {
    console.error(' Unexpected migration error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
