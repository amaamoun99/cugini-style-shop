import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, getCurrentUser } from '@/api/auth';
import axiosInstance from '@/api/axiosInstance';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from local storage
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // Set the token in axios headers
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch current user profile
          const response = await getCurrentUser();
          if (response.status === 'success' && response.data?.user) {
            setUser(response.data.user);
          }
        } catch (err) {
          console.error('Failed to initialize auth:', err);
          // If token is invalid, remove it
          localStorage.removeItem('authToken');
          delete axiosInstance.defaults.headers.common['Authorization'];
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await apiLogin(email, password);
      
      if (response.status === 'success' && response.token) {
        // Save token to local storage
        localStorage.setItem('authToken', response.token);
        
        // Set token in axios headers
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        
        // Fetch user data
        const userResponse = await getCurrentUser();
        if (userResponse.status === 'success' && userResponse.data?.user) {
          setUser(userResponse.data.user);
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Remove token from local storage
    localStorage.removeItem('authToken');
    
    // Remove token from axios headers
    delete axiosInstance.defaults.headers.common['Authorization'];
    
    // Reset user state
    setUser(null);
  };

  // Determine if user is admin
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin,
    isLoading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
