import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/auth';
import type { Permission } from './permissions';
import { hasPermission, ROLE_PERMISSIONS, ROLE_DASHBOARD_ROUTES } from './permissions';

interface AuthContextType {
  user: User | null;
  token: string | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  defaultRoleKey: string;
  login: (user: User, token: string) => void;
  logout: () => void;
  can: (permission: Permission) => boolean;
  openAuthModal: (defaultRoleKey?: string) => void;
  closeAuthModal: () => void;
  getDashboardRoute: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [defaultRoleKey, setDefaultRoleKey] = useState('ADMIN');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (loggedInUser: User, authToken: string) => {
    setUser(loggedInUser);
    setToken(authToken);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const can = (permission: Permission): boolean => {
    return hasPermission(user?.role, permission);
  };

  const openAuthModal = (roleKey: string = 'ADMIN') => {
    setDefaultRoleKey(roleKey);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const getDashboardRoute = (): string => {
    if (!user) return '/';
    return ROLE_DASHBOARD_ROUTES[user.role] || '/dashboard/employee';
  };

  const permissions = user ? ROLE_PERMISSIONS[user.role] || [] : [];

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permissions,
        isAuthenticated: !!user && !!token,
        isAuthModalOpen,
        defaultRoleKey,
        login,
        logout,
        can,
        openAuthModal,
        closeAuthModal,
        getDashboardRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
