/**
 * Prisma Database Seed Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Seeds the database with initial data for development and staging environments.
 *
 * Usage:
 *   npx prisma db seed          → Run this seed script
 *   npm run db:seed             → Alias via package.json
 *
 * IMPORTANT:
 *   - This script is idempotent — it uses upsert to avoid duplicate data.
 *   - Do NOT run in production unless you need initial reference data.
 *   - The seed user uses a bcrypt-hashed password for "password123".
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(' Seeding database...');

  // ── Seed User ────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('password123', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@mergemind.vercel.app' },
    update: {},
    create: {
      email: 'demo@mergemind.vercel.app',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log(`  User seeded: ${demoUser.email} (id: ${demoUser.id})`);

  // ── Seed Project ─────────────────────────────────────────────────────────
  const demoProject = await prisma.project.upsert({
    where: { id: demoUser.id }, // Will not match, forces create
    update: {},
    create: {
      userId: demoUser.id,
      name: 'Demo Project',
    },
  });

  console.log(` Project seeded: ${demoProject.name} (id: ${demoProject.id})`);

  console.log(' Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
