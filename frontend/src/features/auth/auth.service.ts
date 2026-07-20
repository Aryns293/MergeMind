import api from '@/services/api';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from './types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', credentials);
    return data.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const { data } = await api.get('/auth/profile');
    return data.data;
  },
};
