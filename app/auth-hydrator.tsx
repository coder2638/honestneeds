'use client'

import React from 'react'
import { useAuthHydration } from '@/hooks/useAuthHydration'

/**
 * Component to hydrate auth store from localStorage
 * This should wrap the app content to ensure auth is restored before pages render
 */
export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const isHydrated = useAuthHydration()

  // Optionally show loading state while hydrating (usually instant)
  // Returning children immediately is fine since hydration is fast
  if (!isHydrated) {
    return <>{children}</>
  }

  return <>{children}</>
}
