import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { useData } from './DataContext';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  loginWithCode: (code: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { residents } = useData();

  const login = async (email: string, password: string): Promise<User> => {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === 'admin@elmirador.cl') {
      const adminUser: User = {
        id: 'admin',
        name: 'Administrador',
        email: 'admin@elmirador.cl',
        role: 'admin',
      };
      setUser(adminUser);
      return adminUser;
    }

    const resident = residents.find(
      (r) => r.email.trim().toLowerCase() === normalizedEmail && r.status === 'active'
    );

    if (!resident) {
      throw new Error('Credenciales invalidas');
    }

    const residentUser: User = {
      id: resident.id,
      name: resident.name,
      email: resident.email,
      role: resident.role,
      apartmentNumber: resident.apartmentNumber,
    };
    setUser(residentUser);
    return residentUser;
  };

  const loginWithCode = async (code: string): Promise<User> => {
    const normalizedCode = code.trim().toUpperCase();
    const resident = residents.find(
      (r) =>
        r.role === 'tenant' &&
        r.tenantCode?.trim().toUpperCase() === normalizedCode &&
        r.status === 'active'
    );

    if (!resident) {
      throw new Error('Codigo invalido');
    }

    const tenantUser: User = {
      id: resident.id,
      name: resident.name,
      email: resident.email,
      role: 'tenant',
      apartmentNumber: resident.apartmentNumber,
    };
    setUser(tenantUser);
    return tenantUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithCode,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
