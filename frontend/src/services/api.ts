import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT if we store it in memory/localStorage 
// (If using HTTP-only cookies, this is not needed, but good to have prepared)
api.interceptors.request.use(
  (config) => {
    // Assuming token is stored in localStorage for now, or handled via cookies.
    // We will finalize this in Phase 2.
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login or refresh token)
      // Implementation in Phase 2
    }
    return Promise.reject(error);
  }
);

export default api;
