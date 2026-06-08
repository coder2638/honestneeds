/**
 * Hooks Index
 * Central export point for all custom React hooks
 */

// Auth hooks
export { useAuth, useIsAuthenticated, useCurrentUser } from './useAuth'
export {
  useLogin,
  useRegister,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useVerifySession,
} from './useAuthMutations'
export { useAuthHydration, useAuthHydrationStatus } from './useAuthHydration'

// Toast hook
export { useToast } from './useToast'
