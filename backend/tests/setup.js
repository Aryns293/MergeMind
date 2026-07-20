import { vi } from 'vitest';

// Global setup for Vitest
process.env.NODE_ENV ||= 'test';
process.env.DATABASE_URL ||= 'postgresql://mockuser:mockpass@localhost:5432/mockdb';
process.env.JWT_SECRET ||= 'mock_jwt_secret_must_be_10_chars';
process.env.GEMINI_API_KEY ||= 'mock_gemini_api_key';
process.env.GITHUB_ACCESS_TOKEN ||= 'mock_github_access_token';

// Example: Suppress logger output during tests to keep console clean
vi.mock('../src/utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));
