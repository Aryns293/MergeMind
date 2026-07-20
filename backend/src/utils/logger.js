import pino from 'pino';
import { env } from '../config/env.js';
import fs from 'fs';
import path from 'path';

// Development configuration uses pino-pretty for stdout
const devTransport = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    ignore: 'pid,hostname',
    translateTime: 'SYS:standard',
  },
};

// Production configuration logs to stdout ONLY (cloud platforms handle log aggregation natively)
const prodTransport = {
  target: 'pino/file',
  options: { destination: 1 } // 1 = stdout
};

const logger = pino({
  level: env.LOG_LEVEL || (env.NODE_ENV === 'production' ? 'info' : 'debug'),
  // Base fields to include with every log
  base: env.NODE_ENV === 'production' ? { pid: process.pid, env: env.NODE_ENV } : undefined,
  transport: env.NODE_ENV === 'production' ? prodTransport : devTransport,
});

export default logger;

