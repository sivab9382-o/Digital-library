import React, { useState } from 'react';
import { useAuth } from '@/app/components/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { BookOpen, QrCode, Smartphone, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { ShareAppQRModal } from '@/app/components/ShareAppQRModal';
import { CollectionShowcaseModal } from '@/app/components/CollectionShowcaseModal';

export const Login: React.FC = () => {
  const { login, register, isBackendOnline } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await login(loginData.email, loginData.password);
      if (result.success) {
        toast.success('Login successful!');
      } else {
        toast.error(result.message || 'Invalid credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const success = await register({
      name: registerData.name,
      email: registerData.email,
      studentId: registerData.studentId,
      password: registerData.password,
      role: 'student',
      maxBooksAllowed: 3,
    });

    if (success) {
      toast.success('Account created successfully! Please login.');
      setRegisterData({ name: '', email: '', studentId: '', password: '', confirmPassword: '' });
      // Transition to login tab automatically
      const tabsElement = document.querySelector('[value="login"]') as HTMLElement;
      if (tabsElement) tabsElement.click();
    } else {
      toast.error('Registration failed. Email might already be in use.');
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'student') => {
    if (role === 'admin') {
      setLoginData({ email: 'admin@library.com', password: 'admin123' });
      toast.info('Filled Admin credentials');
    } else {
      setLoginData({ email: 'john.doe@student.com', password: 'student123' });
      toast.info('Filled Student credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 p-4 relative">
      {/* Top Banner with QR Access */}
      <div className="w-full max-w-md flex items-center justify-between mb-3 px-1">
        <div className="flex items-center space-x-1 text-xs">
          {isBackendOnline ? (
            <span className="flex items-center text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-full">
              <Wifi className="w-3 h-3 mr-1" /> Cloud API Online
            </span>
          ) : (
            <span className="flex items-center text-slate-600 bg-slate-200/80 border border-slate-300 px-2 py-0.5 rounded-full" title="Continuous demo & local mode active">
              <WifiOff className="w-3 h-3 mr-1" /> Demo & Offline Ready
            </span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowQRModal(true)}
          className="text-xs bg-white/90 hover:bg-white border-indigo-200 text-indigo-700 shadow-xs flex items-center"
        >
          <QrCode className="w-3.5 h-3.5 mr-1 text-indigo-600" />
          <Smartphone className="w-3 h-3 mr-1" />
          Scan QR to Open
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-xl border-slate-200/80">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <div className="bg-primary/10 p-3 rounded-2xl shadow-inner">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
            Digital Library System
          </CardTitle>
          <CardDescription className="text-slate-500">
            Manage your library with QR Code Integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Quick Collection Showcase Banner */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowCollectionModal(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 hover:from-indigo-100 hover:to-blue-100 transition-all text-xs text-indigo-900 group shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-left">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs shrink-0">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    Explore 63 Books & Collections
                    <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Live</span>
                  </div>
                  <div className="text-[11px] text-slate-500">CS, Java, Python, AI, Award Winners & Sci-Fi</div>
                </div>
              </div>
              <span className="text-indigo-600 font-semibold text-xs group-hover:translate-x-1 transition-transform">Browse &rarr;</span>
            </button>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email / ID</Label>
                  <Input
                    id="login-email"
                    type="text"
                    placeholder="your@email.com or student ID"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </form>

              {/* Demo Quick-Fill Buttons */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-2 font-medium">Quick Demo Accounts:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('admin')}
                    className="text-left p-2 rounded-lg border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100/70 transition-colors text-xs"
                  >
                    <div className="font-semibold text-indigo-900">Admin Account</div>
                    <div className="text-indigo-600 text-[11px] truncate">admin@library.com</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('student')}
                    className="text-left p-2 rounded-lg border border-blue-100 bg-blue-50/60 hover:bg-blue-100/70 transition-colors text-xs"
                  >
                    <div className="font-semibold text-blue-900">Student Account</div>
                    <div className="text-blue-600 text-[11px] truncate">john.doe@student.com</div>
                  </button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="John Doe"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-studentId">Student ID</Label>
                  <Input
                    id="register-studentId"
                    type="text"
                    placeholder="STU12345"
                    value={registerData.studentId}
                    onChange={(e) => setRegisterData({ ...registerData, studentId: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Confirm Password</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Create Account</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Share QR Dialog */}
      <ShareAppQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />

      {/* Full Collections Showcase Dialog */}
      <CollectionShowcaseModal
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        onSelectBookToLogin={(_book) => {
          fillDemoCredentials('student');
        }}
      />
    </div>
  );
};

