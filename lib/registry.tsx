'use client'

import React from 'react'

/**
 * Styled Components Registry for Next.js App Router
 * Handles SSR hydration mismatch by disabling strictness in dev
 */
export function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Client-side only - return children after hydration
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>
  }

  return <>{children}</>
}
