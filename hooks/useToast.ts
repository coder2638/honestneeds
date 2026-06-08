import { useCallback } from 'react'
import { toast } from 'react-toastify'

export interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning'
  title?: string
  message: string
  duration?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

/**
 * useToast Hook
 * Wrapper around react-toastify for consistent toast notifications
 */
export function useToast() {
  const showToast = useCallback((options: ToastOptions) => {
    const {
      type,
      title,
      message,
      duration = 3000,
      position = 'top-right',
    } = options

    const content = title ? `${title}\n${message}` : message

    toast[type](content, {
      position,
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }, [])

  return { showToast }
}
