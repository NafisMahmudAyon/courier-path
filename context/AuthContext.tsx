'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '../components/aspect-ui';
import { usePathname, useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast()
  const pathname = usePathname()
  const router = useRouter()
  const BASE_URL = "https://socket-server-cjq4.onrender.com/"
  // const BASE_URL = "http://localhost:5000/"


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
      if(pathname === '/login' || pathname === '/register')
      router.push('/dashboard')
    } else {
      setLoading(false);
      if(pathname != '/' && pathname != '/track' && pathname != '/register' )
      router.push('/')
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`${BASE_URL}api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser({
          id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        });
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        toast({
          message: `Login successful!`,
          type: 'success',
          duration: 3000
        })
        router.push('/dashboard')
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        message: error.message || `Login failed!`,
        type: 'error',
        duration: 3000
      })
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await fetch(`${BASE_URL}api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        toast({
          message: `Registration successful!`,
          type: 'success',
          duration: 3000
        })
        router.push('/dashboard')
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        message: error.message || `Registration failed!`,
        type: 'error',
        duration: 3000
      })
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast({
      message: `Logged out successfully`,
      type: 'success',
      duration: 3000
    })
  };

  

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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