import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/app/components/AuthContext';
import { Login } from '@/app/components/Login';
import { StudentDashboard } from '@/app/components/StudentDashboard';
import { AdminDashboard } from '@/app/components/AdminDashboard';
import { initializeStorage } from '@/app/utils/mockData';
import { Toaster } from '@/app/components/ui/sonner';

function AppContent() {
  const { user } = useAuth();

  useEffect(() => {
    initializeStorage();
  }, []);

  if (!user) {
    return <Login />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  return <StudentDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}
