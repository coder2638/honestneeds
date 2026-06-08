/**
 * Axios Configuration
 * Handles auth token injection and global error handling
 */

import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create axios instance with default config
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Include cookies in requests
});

/**
 * Request Interceptor: Add auth token to all requests
 */
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const timestamp = new Date().toISOString();
      let token = null;
      // Priority 1: Zustand store
      const authStore = useAuthStore.getState();
      token = authStore?.token;
      // Priority 2: localStorage fallback
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token');
      }
      const { user, isAuthenticated } = authStore;
      // Always use absolute URL for all requests
      if (config.url && !config.url.startsWith('http')) {
        const url = config.url.startsWith('/') ? config.url : '/' + config.url;
        config.url = API_BASE_URL + url;
      }
      console.log(`\n[${timestamp}] 🚀 [AXIOS REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
      console.log(`[${timestamp}]   Full URL: ${config.url}`);
      console.log(`[${timestamp}]   Auth Store - isAuthenticated: ${isAuthenticated}, token exists: ${!!authStore?.token}`);
      console.log(`[${timestamp}]   Token Source: ${authStore?.token ? 'Zustand Store' : 'localStorage'}`);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[${timestamp}]   ✅ Authorization header INJECTED`);
        console.log(`[${timestamp}]   Token length: ${token.length} chars, Preview: ${token.substring(0, 25)}...`);
      } else {
        console.warn(`[${timestamp}]   ⚠️  NO TOKEN FOUND - Authorization header NOT INJECTED`);
        console.warn(`[${timestamp}]   Auth Store state:`, { 
          isAuthenticated, 
          userId: user?.id,
          hasToken: !!authStore?.token
        });
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ❌ [AXIOS ERROR] Request interceptor error:`, error.message);
    }
    return config;
  },
  (error) => {
    console.error('[Axios] Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Handle 401 errors (token expired)
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[Axios] 401 Unauthorized - Token may be expired');
      
      // Clear auth from store and redirect to login
      useAuthStore.getState().clearAuth();
      
      // Redirect to login page if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
