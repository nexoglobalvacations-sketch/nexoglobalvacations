import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate active sessions on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('tt_admin_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiService.admin.getMe();
        if (response.data?.success) {
          setAdmin(response.data.data);
        } else {
          localStorage.removeItem('tt_admin_token');
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        localStorage.removeItem('tt_admin_token');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Admin login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await apiService.admin.login({ email, password });
      
      if (response.data?.success) {
        const { token, ...adminData } = response.data.data;
        localStorage.setItem('tt_admin_token', token);
        setAdmin(adminData);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login action error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Invalid email or password'
      };
    } finally {
      setLoading(false);
    }
  };

  // Admin logout function
  const logout = () => {
    localStorage.removeItem('tt_admin_token');
    setAdmin(null);
  };

  // Admin Google login function
  const googleLogin = async (token) => {
    try {
      setLoading(true);
      const response = await apiService.admin.googleLogin({ token });
      
      if (response.data?.success) {
        const { token: jwtToken, ...adminData } = response.data.data;
        localStorage.setItem('tt_admin_token', jwtToken);
        setAdmin(adminData);
        return { success: true };
      }
      return { success: false, error: 'Google Login failed' };
    } catch (error) {
      console.error('Google login action error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Unauthorized admin account'
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, googleLogin, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
