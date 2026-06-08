'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { apiClient } from '@/lib/api'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    role: 'admin' | 'creator' | 'supporter' | 'guest'
    avatar?: string
  }
  token: string
}

interface RegisterPayload {
  email: string
  name: string
  password: string
  role?: 'creator' | 'supporter'
}

interface RegisterResponse {
  user: {
    id: string
    email: string
    name: string
    role: 'admin' | 'creator' | 'supporter' | 'guest'
    avatar?: string
  }
  token?: string
}

interface ForgotPasswordPayload {
  email: string
}

interface ForgotPasswordResponse {
  message: string
}

interface ResetPasswordPayload {
  token: string
  password: string
}

interface ResetPasswordResponse {
  message: string
}

/**
 * Hook for user login mutation
 * Handles authentication and stores token/user in Zustand store and localStorage
 */
export const useLogin = () => {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await apiClient.post<LoginResponse>('/auth/login', payload)
      return response.data
    },
    onSuccess: (data) => {
      // Store auth data
      setAuth(data.user, data.token)

      // Show success message
      toast.success(`Welcome back, ${data.user.name}!`)

      // Redirect to dashboard or saved redirect URL
      const redirectUrl = typeof window !== 'undefined' ? localStorage.getItem('redirect_after_login') : null
      if (redirectUrl && redirectUrl !== '/login') {
        localStorage.removeItem('redirect_after_login')
        router.push(redirectUrl)
      } else {
        router.push('/dashboard')
      }
    },
    onError: (error: AxiosError) => {
      // Error handling is done by api interceptor
      console.error('Login error:', error)
    },
  })
}

/**
 * Hook for user registration mutation
 */
export const useRegister = () => {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await apiClient.post<RegisterResponse>('/auth/register', payload)
      return response.data
    },
    onSuccess: (data) => {
      if (data.token) {
        // Auto-login after registration
        setAuth(data.user, data.token)
        toast.success('Account created successfully!')
        router.push('/dashboard')
      } else {
        // Need to login manually
        toast.success('Account created! Please login.')
        router.push('/login')
      }
    },
    onError: (error: AxiosError) => {
      console.error('Registration error:', error)
    },
  })
}

/**
 * Hook for user logout mutation
 */
export const useLogout = () => {
  const router = useRouter()
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      // Call logout endpoint to invalidate token on backend
      try {
        await apiClient.post('/auth/logout')
      } catch (error) {
        // Continue logout even if API call fails
        console.warn('Logout API call failed:', error)
      }
    },
    onSuccess: () => {
      // Clear local auth state
      clearAuth()
      toast.success('Logged out successfully')
      router.push('/login')
    },
    onError: (error: AxiosError) => {
      console.error('Logout error:', error)
      // Still clear auth locally even if backend fails
      clearAuth()
      router.push('/login')
    },
  })
}

/**
 * Hook for forgot password mutation
 * Sends password reset link to user's email
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      const response = await apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', payload)
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset link sent to your email')
    },
    onError: (error: AxiosError) => {
      console.error('Forgot password error:', error)
    },
  })
}

/**
 * Hook for reset password mutation
 * Uses the token from the reset link to set new password
 */
export const useResetPassword = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const response = await apiClient.post<ResetPasswordResponse>('/auth/reset-password', payload)
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset successfully!')
      router.push('/login')
    },
    onError: (error: AxiosError) => {
      console.error('Reset password error:', error)
    },
  })
}

/**
 * Hook to check if token is still valid
 * Useful for verifying session on app startup
 */
export const useVerifySession = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get('/auth/me')
      return response.data
    },
    onError: (error: AxiosError) => {
      // If 401, auth interceptor will handle logout
      console.error('Session verification error:', error)
    },
  })
}
