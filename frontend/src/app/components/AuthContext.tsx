import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member } from '@/app/types/library';
import { getMembers, saveMembers, initializeStorage } from '@/app/utils/mockData';

interface AuthContextType {
  user: Member | null;
  isBackendOnline: boolean | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (member: Omit<Member, 'id' | 'qrCode' | 'booksIssued'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Member | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    initializeStorage();
    const storedUser = localStorage.getItem('current_user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('current_user');
      }
    }

    // Ping backend to check status without blocking
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch(`${API_BASE}/books`, {
        signal: controller.signal,
        headers: { 'Bypass-Tunnel-Reminder': 'true' }
      });
      clearTimeout(timeoutId);
      setIsBackendOnline(res.ok || res.status === 401 || res.status === 403);
    } catch {
      clearTimeout(timeoutId);
      setIsBackendOnline(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        signal: controller.signal,
        headers: { 
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true' 
        },
        body: JSON.stringify({ username: email, password }),
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        setIsBackendOnline(true);
        const data = await response.json();
        const loggedUser: Member = {
          id: data.id?.toString() || '1',
          name: data.username,
          email: data.email || email,
          studentId: data.id?.toString() || email,
          password: '',
          role: data.role?.toLowerCase().includes('admin') ? 'admin' : 'student',
          qrCode: `MEMBER-${data.id}`,
          booksIssued: [],
          maxBooksAllowed: 5
        };

        setUser(loggedUser);
        localStorage.setItem('current_user', JSON.stringify(loggedUser));
        localStorage.setItem('token', data.token);
        return { success: true };
      }
      
      // If server returned 401/400 (explicit wrong credentials on live server)
      if (response.status === 401 || response.status === 400) {
        setIsBackendOnline(true);
        // Also check if matches demo accounts before outright failing
        const localMembers = getMembers();
        const demoUser = localMembers.find(m => (m.email.toLowerCase() === email.toLowerCase() || m.studentId.toLowerCase() === email.toLowerCase()) && m.password === password);
        if (demoUser) {
          setUser(demoUser);
          localStorage.setItem('current_user', JSON.stringify(demoUser));
          localStorage.setItem('token', 'demo-token-' + demoUser.id);
          return { success: true };
        }
        return { success: false, message: 'Invalid email or password' };
      }

      throw new Error(`Server returned status: ${response.status}`);
    } catch {
      clearTimeout(timeoutId);
      setIsBackendOnline(false);

      // Seamless fallback to local/mock database
      const localMembers = getMembers();
      const matched = localMembers.find(
        (m) => (m.email.toLowerCase() === email.toLowerCase() || m.studentId.toLowerCase() === email.toLowerCase()) && 
               (m.password === password || !m.password)
      );

      if (matched) {
        setUser(matched);
        localStorage.setItem('current_user', JSON.stringify(matched));
        localStorage.setItem('token', 'local-token-' + matched.id);
        return { success: true };
      }

      return { 
        success: false, 
        message: 'Invalid credentials. For demo, try admin@library.com (admin123) or john.doe@student.com (student123)' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
    localStorage.removeItem('token');
  };

  const register = async (memberData: Omit<Member, 'id' | 'qrCode' | 'booksIssued'>): Promise<boolean> => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        signal: controller.signal,
        headers: { 
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true' 
        },
        body: JSON.stringify({
          username: memberData.email,
          email: memberData.email,
          password: memberData.password,
          role: 'ROLE_STUDENT'
        }),
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        setIsBackendOnline(true);
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        return true;
      }
      throw new Error('Registration API failed');
    } catch {
      clearTimeout(timeoutId);
      setIsBackendOnline(false);

      // Save into local members
      const localMembers = getMembers();
      const existing = localMembers.find(m => m.email.toLowerCase() === memberData.email.toLowerCase());
      if (existing) {
        return false;
      }

      const newId = (localMembers.length + 1).toString();
      const newMember: Member = {
        id: newId,
        name: memberData.name,
        email: memberData.email,
        studentId: memberData.studentId || `STU${newId.padStart(3, '0')}`,
        password: memberData.password,
        role: memberData.role || 'student',
        qrCode: `MEMBER-${memberData.studentId || newId}`,
        booksIssued: [],
        maxBooksAllowed: memberData.maxBooksAllowed || 3
      };

      saveMembers([...localMembers, newMember]);
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isBackendOnline, login, logout, register }}>
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
