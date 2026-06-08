import { useAuthStore } from '@/store/authStore'

/**
 * Hook to access current authenticated user and auth state
 * @returns Auth store state and actions
 */
export const useAuth = () => {
  return useAuthStore()
}

/**
 * Hook to check if user is authenticated
 * @returns boolean indicating if user is authenticated
 */
export const useIsAuthenticated = () => {
  return useAuthStore((state) => state.isAuthenticated)
}

/**
 * Hook to get current user
 * @returns Current user object or null
 */
export const useCurrentUser = () => {
  return useAuthStore((state) => state.user)
}
