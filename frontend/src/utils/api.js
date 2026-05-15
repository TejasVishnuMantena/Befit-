// ============================================================
// utils/api.js - Axios Instance with Auth Header
// ============================================================
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach JWT token from localStorage to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitsync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 (unauthorized) globally - redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fitsync_token');
      localStorage.removeItem('fitsync_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
