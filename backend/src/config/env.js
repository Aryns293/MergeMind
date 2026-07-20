import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_DATABASE_URL: z.string().min(1).optional(), // Direct connection for migrations (bypasses pooler)
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required for AI module'),
  GITHUB_ACCESS_TOKEN: z.string().min(1, 'GITHUB_ACCESS_TOKEN is required for GitHub integration').optional(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  REDIS_URL: z.string().url().optional(), // Optional placeholder for future scalability
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  /* eslint-disable no-console */
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(_env.error.format(), null, 2));
  /* eslint-enable no-console */
  process.exit(1);
}

export const env = _env.data;
