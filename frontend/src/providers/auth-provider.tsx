"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse } from '@/features/auth/types';
import { authService } from '@/features/auth/auth.service';
import { initSocket, disconnectSocket } from '@/services/socket';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await authService.getProfile();
          setUser(data.user);
          initSocket(); // Connect socket on successful auto-login
        } catch (error: any) {
          console.error('Failed to restore session:', error);
          // Only log out if it's an actual authentication error (401)
          if (error?.response?.status === 401) {
            localStorage.removeItem('token');
            // If we are on a protected route, redirect to login
            if (!pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/forgot-password') && pathname !== '/') {
              router.push('/login');
            }
          }
        }
      } else {
        // No token present
        if (!pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/forgot-password') && pathname !== '/') {
          router.push('/login');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [pathname, router]);

  const login = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    setUser(data.user);
    initSocket();
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    disconnectSocket();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
