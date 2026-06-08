/**
 * Debug Authentication Utility
 * Comprehensive debugging for auth flow issues
 */

export const debugAuth = () => {
  const timestamp = new Date().toISOString();
  
  console.log('\n' + '='.repeat(80));
  console.log(`[${timestamp}] 🔐 COMPREHENSIVE AUTH DEBUG REPORT`);
  console.log('='.repeat(80) + '\n');

  // 1. Auth Store
  console.group('📦 1. AUTH STORE STATE');
  try {
    const authStore = require('../store/authStore').useAuthStore.getState();
    console.log('Auth Store:', authStore);
    console.log({
      isAuthenticated: authStore.isAuthenticated,
      userId: authStore.user?.id,
      userEmail: authStore.user?.email,
      hasToken: !!authStore.token,
      tokenLength: authStore.token ? authStore.token.length : 0,
      tokenPreview: authStore.token ? authStore.token.substring(0, 50) + '...' : 'NONE',
      roles: authStore.user?.roles,
    });
  } catch (err) {
    console.error('Failed to get auth store:', err);
  }
  console.groupEnd();

  // 2. LocalStorage
  console.group('💾 2. LOCALSTORAGE');
  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    const authState = localStorage.getItem('auth-store');
    
    console.log('Keys in localStorage:', Object.keys(localStorage));
    console.log({
      'auth_token': authToken ? `✓ (${authToken.length} chars)` : '✗ MISSING',
      'user': user ? '✓' : '✗ MISSING',
      'auth-store': authState ? '✓' : '✗ MISSING',
    });
    
    if (authToken) {
      console.log('auth_token preview:', authToken.substring(0, 50) + '...');
    }
    if (user) {
      try {
        console.log('user object:', JSON.parse(user));
      } catch (e) {
        console.log('user (raw):', user.substring(0, 100));
      }
    }
    if (authState) {
      try {
        const parsed = JSON.parse(authState);
        console.log('auth-store parsed:', {
          hasToken: !!parsed.state?.token,
          hasUser: !!parsed.state?.user,
          isAuthenticated: parsed.state?.isAuthenticated,
        });
      } catch (e) {
        console.log('auth-store (raw):', authState.substring(0, 100));
      }
    }
  } else {
    console.log('window is not available (SSR environment)');
  }
  console.groupEnd();

  // 3. Cookies
  console.group('🍪 3. COOKIES');
  if (typeof window !== 'undefined') {
    const cookies = document.cookie;
    console.log('All cookies:', cookies ? cookies.substring(0, 100) + '...' : 'NONE');
    
    // Parse auth_token specifically
    const authTokenMatch = cookies.match(/auth_token=([^;]*)/);
    if (authTokenMatch && authTokenMatch[1]) {
      console.log('auth_token in cookie:', {
        exists: true,
        length: authTokenMatch[1].length,
        preview: authTokenMatch[1].substring(0, 30) + '...',
      });
    } else {
      console.log('auth_token in cookie:', { exists: false });
    }
  }
  console.groupEnd();

  // 4. Axios Config
  console.group('🌐 4. AXIOS CONFIGURATION');
  console.log({
    'NEXT_PUBLIC_API_URL': process.env.NEXT_PUBLIC_API_URL,
    'Expected baseURL': 'http://localhost:5000/api',
    'NODE_ENV': process.env.NODE_ENV,
  });
  console.groupEnd();

  // 5. Network Info
  console.group('📡 5. NETWORK INFORMATION');
  if (typeof window !== 'undefined') {
    console.log({
      'Current URL': window.location.href,
      'Origin': window.location.origin,
      'Hostname': window.location.hostname,
      'Port': window.location.port,
    });
  }
  console.groupEnd();

  // 6. Request simulation
  console.group('🧪 6. REQUEST SIMULATION');
  try {
    const axiosInstance = require('../api/axiosConfig').default;
    console.log('Axios instance baseURL:', axiosInstance.defaults.baseURL);
    console.log('Would construct URL as:', axiosInstance.defaults.baseURL + '/creator/payout-requests');
  } catch (err) {
    console.error('Failed to check axios:', err);
  }
  console.groupEnd();

  console.log('\n' + '='.repeat(80));
  console.log(`END OF AUTH DEBUG REPORT [${timestamp}]`);
  console.log('='.repeat(80) + '\n');
};

export default debugAuth;
