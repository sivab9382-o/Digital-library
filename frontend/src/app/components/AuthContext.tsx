import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member } from '@/app/types/library';

interface AuthContextType {
  user: Member | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (member: Omit<Member, 'id' | 'qrCode' | 'booksIssued'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Member | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('current_user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true' 
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const loggedUser: Member = {
          id: data.id,
          name: data.username,
          email: data.email,
          studentId: data.id, // Use ID as studentId
          password: '',
          role: data.role.toLowerCase().includes('admin') ? 'admin' : 'student',
          qrCode: `MEMBER-${data.id}`,
          booksIssued: [],
          maxBooksAllowed: 5
        };

        // Enhancing user object if possible or accepting minimal
        setUser(loggedUser);
        localStorage.setItem('current_user', JSON.stringify(loggedUser));
        localStorage.setItem('token', data.token);
        return { success: true };
      }
      return { success: false, message: `Login failed: ${response.status} ${response.statusText}` };
    } catch (error) {
      console.error('Login failed', error);
      return { success: false, message: 'Network error or server unreachable' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
    localStorage.removeItem('token');
  };

  const register = async (memberData: Omit<Member, 'id' | 'qrCode' | 'booksIssued'>): Promise<boolean> => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true' 
        },
        body: JSON.stringify({
          username: memberData.email, // Using email as username for consistency
          email: memberData.email,
          password: memberData.password,
          role: 'ROLE_STUDENT' // Enforce student role from frontend too
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Auto login or just return true
        localStorage.setItem('token', data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
