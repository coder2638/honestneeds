'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/store/authStore'
import { authService, type AuthResponse } from '@/api/services/authService'

/**
 * Auth Hooks
 * - useLogin: Login with email and password
 * - useRegister: Register new user
 * - useForgotPassword: Request password reset email
 * - useResetPassword: Reset password with token
 * - useCheckEmailExists: Check if email is already registered
 * - useLogout: Clear auth state and logout
 */

// ============================================
// USE LOGIN
// ============================================
export function useLogin() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: async ({
      email,
      password,
      staySignedIn,
    }: {
      email: string
      password: string
      staySignedIn: boolean
    }) => {
      console.log('[useLogin] Starting login mutation for:', email)
      const result = await authService.login(email, password)

      if (!result.success) {
        console.error('[useLogin] Login failed:', result.error)
        throw new Error(result.error || 'Login failed')
      }

      if (!result.data || !result.data.user || !result.data.token) {
        console.error('[useLogin] Invalid response data:', result.data)
        throw new Error('Invalid response from server')
      }

      console.log('[useLogin] Login response received:', {
        userId: result.data.user.id,
        tokenLength: result.data.token.length,
        tokenPreview: result.data.token.substring(0, 20) + '...'
      })

      return result.data
    },
    onSuccess: (data) => {
      console.log('[useLogin] onSuccess callback - about to call setAuth', { userId: data.user.id })
      setAuth(data.user, data.token)
      console.log('[useLogin] setAuth called, now checking localStorage...')
      
      // Verify token was saved
      if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem('auth_token')
        console.log('[useLogin] ✓ Token verification:', {
          tokenSaved: !!savedToken,
          tokenMatches: savedToken === data.token,
          savedTokenPreview: savedToken?.substring(0, 20) + '...'
        })
      }
      
      toast.success('Login successful!')

      // Redirect to dashboard or stored redirect URL
      const redirectUrl =
        typeof window !== 'undefined'
          ? localStorage.getItem('redirect_after_login') || '/dashboard'
          : '/dashboard'

      if (typeof window !== 'undefined') {
        localStorage.removeItem('redirect_after_login')
      }

      console.log('[useLogin] Redirecting to:', redirectUrl)
      router.push(redirectUrl)
    },
    onError: (error) => {
      console.error('[useLogin] Login error:', error.message)
      toast.error(error.message || 'Login failed. Please try again.')
    },
  })
}

// ============================================
// USE REGISTER
// ============================================
export function useRegister() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: async ({
      email,
      displayName,
      password,
    }: {
      email: string
      displayName: string
      password: string
    }) => {
      const result = await authService.register(email, displayName, password)

      if (!result.success) {
        throw new Error(result.error || 'Registration failed')
      }

      if (!result.data || !result.data.user || !result.data.token) {
        console.error('[useRegister] Invalid response data:', result.data)
        throw new Error('Invalid response from server')
      }

      return result.data
    },
    onSuccess: (data) => {
      console.log('[useRegister] Registration successful, setting auth:', { userId: data.user.id })
      // Auto-login if backend returns token
      if (data && data.user && data.token) {
        setAuth(data.user, data.token)
        toast.success('Registration successful! Welcome aboard!')
        // Redirect after a short delay to allow toast to show
        setTimeout(() => {
          router.push('/dashboard')
        }, 500)
      } else {
        console.error('[useRegister] Missing user or token in response')
        toast.error('Registration failed: Invalid response')
      }
    },
    onError: (error) => {
      console.error('[useRegister] Registration error:', error.message)
      toast.error(error.message || 'Registration failed. Please try again.')
    },
  })
}

// ============================================
// USE FORGOT PASSWORD
// ============================================
export function useForgotPassword() {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const result = await authService.requestPasswordReset(email)

      if (!result.success) {
        throw new Error(result.error || 'Failed to send reset email')
      }

      return result.message
    },
    onSuccess: (message) => {
      toast.success(message || 'Reset link sent to your email')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send reset email. Please try again.')
    },
  })
}

// ============================================
// USE RESET PASSWORD
// ============================================
export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      const result = await authService.resetPassword(token, password)

      if (!result.success) {
        throw new Error(result.error || 'Failed to reset password')
      }

      return result.message
    },
    onSuccess: (message) => {
      toast.success(message || 'Password reset successfully!')
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reset password. Please try again.')
    },
  })
}

// ============================================
// USE CHECK EMAIL EXISTS
// ============================================
export function useCheckEmailExists() {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      return await authService.checkEmailExists(email)
    },
    onError: (error) => {
      // Silent error for email check
      console.error('Email check error:', error)
    },
  })
}

// ============================================
// USE LOGOUT
// ============================================
export function useLogout() {
  const router = useRouter()
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      return await authService.logout()
    },
    onSuccess: () => {
      clearAuth()
      toast.success('Logged out successfully')
      router.push('/')
    },
    onError: (error) => {
      clearAuth()
      toast.error('Logged out')
      router.push('/')
    },
  })
}
