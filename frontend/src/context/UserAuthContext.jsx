import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize and validate session
  useEffect(() => {
    const initializeUserAuth = async () => {
      const token = localStorage.getItem('tt_user_token');
      if (token) {
        try {
          const response = await apiService.userAuth.getMe();
          if (response.data?.success) {
            setUser(response.data.data);
            setIsAuthenticated(true);
          } else {
            // Token expired or invalid
            localStorage.removeItem('tt_user_token');
          }
        } catch (err) {
          console.error('Failed to validate user token:', err);
          localStorage.removeItem('tt_user_token');
        }
      }
      setLoading(false);
    };

    initializeUserAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.userAuth.login({ email, password });
      if (response.data?.success) {
        const { token, ...userData } = response.data.data;
        localStorage.setItem('tt_user_token', token);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (err) {
      console.error('User login error:', err);
      return {
        success: false,
        error: err.response?.data?.error || 'Invalid credentials'
      };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const response = await apiService.userAuth.register({ name, email, password, phone });
      if (response.data?.success) {
        const { token, ...userData } = response.data.data;
        localStorage.setItem('tt_user_token', token);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err) {
      console.error('User registration error:', err);
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to create traveler account'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('tt_user_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const googleLogin = async (token) => {
    try {
      setLoading(true);
      const response = await apiService.userAuth.googleLogin({ token });
      if (response.data?.success) {
        const { token: jwtToken, ...userData } = response.data.data;
        localStorage.setItem('tt_user_token', jwtToken);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Google Login failed' };
    } catch (err) {
      console.error('Google user login error:', err);
      return {
        success: false,
        error: err.response?.data?.error || 'Google login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        googleLogin
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};
