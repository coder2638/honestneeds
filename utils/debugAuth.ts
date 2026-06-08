/**
 * Authentication State Debugger
 * Helps troubleshoot missing auth headers and token issues
 */

import { useAuthStore } from '../store/authStore';
import axiosInstance from '../api/axiosConfig';

export function debugAuthState() {
  const timestamp = new Date().toISOString();
  console.log(`\n[${ timestamp}] ============ AUTH STATE DEBUG ============`);
  
  // Get auth store
  const authStore = useAuthStore.getState();
  
  console.log(`[${timestamp}] 📦 Zustand Auth Store:`, {
    isAuthenticated: authStore.isAuthenticated,
    user: {
      id: authStore.user?.id,
      email: authStore.user?.email,
      role: authStore.user?.role,
    },
    hasToken: !!authStore.token,
    tokenLength: authStore.token ? authStore.token.length : 0,
    tokenPreview: authStore.token ? authStore.token.substring(0, 20) + '...' : 'NONE',
  });
  
  // Check localStorage
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    console.log(`[${timestamp}] 💾 LocalStorage:`, {
      hasStoredToken: !!storedToken,
      storedTokenLength: storedToken ? storedToken.length : 0,
      hasStoredUser: !!storedUser,
      storedUserPreview: storedUser ? JSON.parse(storedUser).email : 'N/A',
    });
    
    // Check cookies
    const cookies = document.cookie.split(';').map(c => c.trim());
    const authCookie = cookies.find(c => c.startsWith('auth_token='));
    
    console.log(`[${timestamp}] 🍪 Cookies:`, {
      totalCookies: cookies.length,
      hasAuthCookie: !!authCookie,
      authCookieLength: authCookie ? authCookie.length : 0,
    });
  }
  
  console.log(`[${timestamp}] ========================================\n`);
}

export function debugAxiosConfig() {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ============ AXIOS CONFIG DEBUG ============`);
  
  console.log(`[${timestamp}] baseURL:`, (axiosInstance as any).defaults.baseURL);
  console.log(`[${timestamp}] timeout:`, (axiosInstance as any).defaults.timeout);
  console.log(`[${timestamp}] withCredentials:`, (axiosInstance as any).defaults.withCredentials);
  
  console.log(`[${timestamp}] ==========================================\n`);
}

export function debugBeforeRequest(url: string) {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ============ PRE-REQUEST DEBUG ============`);
  console.log(`[${timestamp}] About to request: ${url}`);
  
  debugAuthState();
  debugAxiosConfig();
  
  console.log(`[${timestamp}] ==========================================\n`);
}
