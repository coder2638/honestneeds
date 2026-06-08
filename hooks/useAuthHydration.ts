'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'

/**
 * Hook to hydrate auth store from localStorage on app startup
 * This ensures auth state persists across page refreshes and SSR transitions
 * Must be called in a client-side component (cannot be called in server components)
 */
export const useAuthHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false)
  const { setAuth, user, token } = useAuthStore()

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') {
      setIsHydrated(true)
      return
    }

    // If store already has data, skip hydration
    if (user && token) {
      setIsHydrated(true)
      return
    }

    // Try to restore from localStorage
    try {
      const savedToken = localStorage.getItem('auth_token')
      const savedUserStr = localStorage.getItem('user')

      if (savedToken && savedUserStr) {
        try {
          const savedUser = JSON.parse(savedUserStr)
          setAuth(savedUser, savedToken)
        } catch (parseError) {
          // If JSON parsing fails, clear corrupted data
          console.warn('Failed to parse stored user data:', parseError)
          localStorage.removeItem('user')
          localStorage.removeItem('auth_token')
        }
      }
    } catch (error) {
      // If localStorage access fails, continue without state
      console.warn('Failed to access localStorage:', error)
    } finally {
      // Mark as hydrated regardless of success/failure
      setIsHydrated(true)
    }
  }, [user, token, setAuth])

  return isHydrated
}

/**
 * Hook to get current hydration status
 * Useful to show loading state until auth is restored
 */
export const useAuthHydrationStatus = () => {
  return useAuthHydration()
}
