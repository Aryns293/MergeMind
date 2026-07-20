const PRODUCTION_API_URL = 'https://mergemind-backend.onrender.com/api';
const PRODUCTION_SOCKET_URL = 'https://mergemind-backend.onrender.com';
const LOCAL_API_URL = 'http://localhost:5000/api';
const LOCAL_SOCKET_URL = 'http://localhost:5000';

export function resolveApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'mergemind.vercel.app' || hostname.endsWith('.vercel.app')) {
      return PRODUCTION_API_URL;
    }
  }

  return LOCAL_API_URL;
}

export function resolveSocketUrl(): string {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }

  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'mergemind.vercel.app' || hostname.endsWith('.vercel.app')) {
      return PRODUCTION_SOCKET_URL;
    }
  }

  return LOCAL_SOCKET_URL;
}
