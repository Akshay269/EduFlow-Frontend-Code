'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, User } from './api';  // ← import User from api.ts

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isStudent: boolean;
  isInstructor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const response = await api.getProfile();
      setUser(response.data);  // ← fix: was setUser(profile)
    } catch {
      localStorage.removeItem('eduflow_token');
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem('eduflow_token');
    if (savedToken) {
      setToken(savedToken);
      loadProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [loadProfile]);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    const authToken = response.data.token;  // ✅ already correct
    localStorage.setItem('eduflow_token', authToken);
    setToken(authToken);
    await loadProfile();
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    const response = await api.register(name, email, password, role);
    const authToken = response.data.token;  // ← fix: was response.token
    localStorage.setItem('eduflow_token', authToken);
    setToken(authToken);
    await loadProfile();
  };

  const logout = () => {
    localStorage.removeItem('eduflow_token');
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        isAuthenticated: !!user,
        isStudent: user?.role === 'STUDENT',
        isInstructor: user?.role === 'INSTRUCTOR',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
