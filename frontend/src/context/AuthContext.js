// ============================================================
// context/AuthContext.js - Global Auth State
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // True while checking stored auth

  // On app load: restore user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('fitsync_user');
    const token = localStorage.getItem('fitsync_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login: save to state + localStorage
  const login = (userData, token) => {
    localStorage.setItem('fitsync_token', token);
    localStorage.setItem('fitsync_user', JSON.stringify(userData));
    setUser(userData);
  };

  // Logout: clear everything
  const logout = () => {
    localStorage.removeItem('fitsync_token');
    localStorage.removeItem('fitsync_user');
    setUser(null);
  };

  // Update user in state and storage after profile edit
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem('fitsync_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy use
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
