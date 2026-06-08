'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from './LoadingSpinner'
import { useAuthStore, User } from '@/store/authStore'

export interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: (User['role'] | 'guest')[]
}

/**
 * Protected route component that guards pages based on authentication and role
 * @param children - Content to render if user is authorized
 * @param allowedRoles - Array of roles that are allowed to access this route. If not specified, any authenticated user can access
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Simulate checking localStorage if store is not yet hydrated
    const checkAuth = () => {
      if (!isAuthenticated && typeof window !== 'undefined') {
        // Try to restore from localStorage
        const savedToken = localStorage.getItem('auth_token')
        const savedUser = localStorage.getItem('user')

        if (!savedToken || !savedUser) {
          // Not authenticated, redirect to login
          const currentPath = window.location.pathname + window.location.search
          localStorage.setItem('redirect_after_login', currentPath)
          router.push('/login')
          setIsLoading(false)
          return
        }
      }

      // User is authenticated
      if (isAuthenticated) {
        // Check role if required
        if (allowedRoles && allowedRoles.length > 0) {
          if (user && allowedRoles.includes(user.role)) {
            setIsAuthorized(true)
          } else {
            // User doesn't have required role, redirect to unauthorized
            router.push('/unauthorized')
          }
        } else {
          // No role restriction, user is authorized
          setIsAuthorized(true)
        }
      } else {
        // Not authenticated yet
        const currentPath = window.location.pathname + window.location.search
        localStorage.setItem('redirect_after_login', currentPath)
        router.push('/login')
      }

      setIsLoading(false)
    }

    // Small delay to ensure store is hydrated from localStorage
    const timer = setTimeout(checkAuth, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, allowedRoles, router])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
