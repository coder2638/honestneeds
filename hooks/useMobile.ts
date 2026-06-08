/**
 * Mobile Hooks
 * React hooks for mobile-specific functionality
 * 
 * Usage:
 * import { useMobileViewport, useMobileOrientation, useTouchGestures } from '@/hooks/mobile'
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { getViewportSize, isViewportMobile, isViewportTablet } from '@/lib/mobile/viewport'
import { prefersReducedMotion, isTouchDevice } from '@/lib/mobile/viewport'
import { GestureCallbacks, GestureConfig, useTouchGestures as useGesturesLib } from '@/lib/mobile/gestures'

/**
 * Hook to track viewport size changes
 */
export const useMobileViewport = () => {
  const [viewport, setViewport] = useState(() => getViewportSize())

  useEffect(() => {
    const handleResize = () => {
      setViewport(getViewportSize())
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return viewport
}

/**
 * Hook to detect if current viewport is mobile, tablet, or desktop
 */
export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop' | null>(null)

  useEffect(() => {
    const viewport = getViewportSize()
    if (viewport) {
      setDeviceType(viewport.category)
    }
  }, [])

  return deviceType
}

/**
 * Hook to detect orientation changes
 */
export const useMobileOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => {
    if (typeof window === 'undefined') return 'portrait'
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  })

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleOrientationChange)

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleOrientationChange)
    }
  }, [])

  return orientation
}

/**
 * Hook to track keyboard visibility (mobile)
 */
export const useMobileKeyboard = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const viewport = getViewportSize()
      if (!viewport) return

      // Rough estimate: if height is significantly less, keyboard is likely open
      const estimatedKeyboardHeight = viewport.height < window.screen.height ? 
        window.screen.height - viewport.height : 0

      setKeyboardHeight(estimatedKeyboardHeight)
      setIsKeyboardVisible(estimatedKeyboardHeight > 100)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return { isKeyboardVisible, keyboardHeight }
}

/**
 * Hook for gesture detection
 */
export const useMobileGestures = (callbacks: GestureCallbacks, config?: GestureConfig) => {
  return useGesturesLib(callbacks, config)
}

/**
 * Hook to check if device prefers reduced motion
 */
export const usePrefersReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(() => prefersReducedMotion())

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches)
    }

    // Use addEventListener for better browser support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  return prefersReduced
}

/**
 * Hook to detect touch capability
 */
export const useTouchCapable = () => {
  const [canTouch, setCanTouch] = useState(() => isTouchDevice())

  useEffect(() => {
    setCanTouch(isTouchDevice())
  }, [])

  return canTouch
}

/**
 * Hook to detect dark mode preference
 */
export const usePrefersDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  return isDark
}

/**
 * Hook to prevent scroll bounce on iOS
 */
export const usePreventScrollBounce = (element?: HTMLElement) => {
  useEffect(() => {
    const target = element || document.body
    let lastY = 0

    const handleTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY
      const app = target

      if (app.scrollTop === 0 && currentY > lastY) {
        // Scrolling down at top
        e.preventDefault()
      } else if (
        app.scrollTop + app.clientHeight === app.scrollHeight &&
        currentY < lastY
      ) {
        // Scrolling up at bottom
        e.preventDefault()
      }

      lastY = currentY
    }

    target.addEventListener('touchstart', handleTouchStart, false)
    target.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      target.removeEventListener('touchstart', handleTouchStart)
      target.removeEventListener('touchmove', handleTouchMove)
    }
  }, [element])
}

/**
 * Hook to manage fullscreen mode
 */
export const useFullscreen = (ref: React.RefObject<HTMLElement>) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const enter = useCallback(async () => {
    if (!ref.current) return

    try {
      if (ref.current.requestFullscreen) {
        await ref.current.requestFullscreen()
      } else if ((ref.current as any).webkitRequestFullscreen) {
        await (ref.current as any).webkitRequestFullscreen()
      }
      setIsFullscreen(true)
    } catch (err) {
      console.error('Failed to enter fullscreen:', err)
    }
  }, [ref])

  const exit = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else if ((document as any).webkitFullscreenElement) {
        await (document as any).webkitExitFullscreen()
      }
      setIsFullscreen(false)
    } catch (err) {
      console.error('Failed to exit fullscreen:', err)
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return { isFullscreen, enter, exit }
}

/**
 * Hook for vibration/haptic feedback
 */
export const useVibration = () => {
  const vibrate = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }, [])

  const stopVibration = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(0)
    }
  }, [])

  return { vibrate, stopVibration }
}

/**
 * Hook for push notifications
 */
export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false)
  const [isPermissionGranted, setIsPermissionGranted] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    const checkSupport = async () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window
      setIsSupported(supported)

      if (supported && 'Notification' in window) {
        setIsPermissionGranted(Notification.permission === 'granted')
      }
    }

    checkSupport()
  }, [])

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return

    const permission = await Notification.requestPermission()
    setIsPermissionGranted(permission === 'granted')
    return permission === 'granted'
  }, [])

  const subscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      })
      setSubscription(sub)
      return sub
    } catch (err) {
      console.error('Failed to subscribe to push notifications:', err)
      return null
    }
  }, [])

  const unsubscribe = useCallback(async () => {
    if (!subscription) return

    try {
      await subscription.unsubscribe()
      setSubscription(null)
    } catch (err) {
      console.error('Failed to unsubscribe from push notifications:', err)
    }
  }, [subscription])

  return {
    isSupported,
    isPermissionGranted,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
  }
}

/**
 * Hook to access device battery status
 */
export const useBatteryStatus = () => {
  const [battery, setBattery] = useState<{
    level: number
    charging: boolean
    chargingTime: number
    dischargingTime: number
  } | null>(null)

  useEffect(() => {
    const getBattery = async () => {
      if (!('getBattery' in navigator)) return

      try {
        const batStatus = await (navigator as any).getBattery()

        const updateBattery = () => {
          setBattery({
            level: batStatus.level,
            charging: batStatus.charging,
            chargingTime: batStatus.chargingTime,
            dischargingTime: batStatus.dischargingTime,
          })
        }

        updateBattery()

        batStatus.addEventListener('levelchange', updateBattery)
        batStatus.addEventListener('chargingchange', updateBattery)
        batStatus.addEventListener('chargingtimechange', updateBattery)
        batStatus.addEventListener('dischargingtimechange', updateBattery)

        return () => {
          batStatus.removeEventListener('levelchange', updateBattery)
          batStatus.removeEventListener('chargingchange', updateBattery)
          batStatus.removeEventListener('chargingtimechange', updateBattery)
          batStatus.removeEventListener('dischargingtimechange', updateBattery)
        }
      } catch (err) {
        console.error('Battery API not supported:', err)
      }
    }

    getBattery()
  }, [])

  return battery
}

export default {
  useMobileViewport,
  useDeviceType,
  useMobileOrientation,
  useMobileKeyboard,
  useMobileGestures,
  usePrefersReducedMotion,
  useTouchCapable,
  usePrefersDarkMode,
  usePreventScrollBounce,
  useFullscreen,
  useVibration,
  usePushNotifications,
  useBatteryStatus,
}
