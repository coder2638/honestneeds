import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'

interface ApiErrorResponse {
  message?: string
  error?: string
}

interface RetryConfig extends InternalAxiosRequestConfig {
  retryCount?: number
  skipRetry?: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const isDev = process.env.NODE_ENV === 'development'
const MAX_RETRIES = 3
const BASE_DELAY = 1000 // 1 second

/**
 * Calculate exponential backoff delay
 * Formula: baseDelay * (2 ^ retryCount) + jitter (random 0-1000ms)
 */
const getExponentialBackoffDelay = (retryCount: number): number => {
  const exponentialDelay = BASE_DELAY * Math.pow(2, retryCount)
  const jitter = Math.random() * 1000
  return exponentialDelay + jitter
}

/**
 * Check if error is retryable (network error or 5xx server error)
 */
const isRetryableError = (error: AxiosError): boolean => {
  if (!error.response) {
    // Network error
    return true
  }
  // Retry on 5xx server errors
  return error.response.status >= 500
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true, // Enable sending cookies with requests
  // Don't set default Content-Type - let axios auto-detect based on data type
  // FormData needs its own boundary, JSON needs application/json
  headers: {},
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (client-side only)
    let token = null
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('auth_token')
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      // Check if this is a known public endpoint to avoid spamming console warnings
      const url = config.url || ''
      const isPublic = 
        url.includes('/auth/') ||
        url.includes('/public') ||
        url.includes('/sponsorships/create') ||
        url.includes('/onboard') ||
        (config.method?.toLowerCase() === 'get' && (
          url.includes('/campaigns') ||
          url.includes('/need-types') ||
          url.includes('/trending') ||
          url.includes('/related') ||
          (url.includes('/sponsorships/') && !url.includes('/sponsorships/admin'))
        ))

      if (!isPublic) {
        console.warn('[API] ✗ No auth token found for private endpoint - request will fail with 401', {
          url: config.url,
          method: config.method
        })
      } else if (isDev) {
        console.log('[API] Public endpoint request (no auth token needed)', {
          url: config.url,
          method: config.method
        })
      }
    }

    // Handle FormData requests - don't set Content-Type so browser can set proper boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    if (isDev) {
      console.log('[API Request]', config.method?.toUpperCase(), config.url, config.data instanceof FormData ? '[FormData]' : config.data || {})
    }
    return config
  },
  (error) => {
    if (isDev) {
      console.error('[API Request Error]', error)
    }
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors with retry logic
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (isDev) {
      console.log('[API Response]', response.status, response.config.url, response.data)
    }
    return response
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const config = error.config as RetryConfig | undefined

    if (!config || config.skipRetry) {
      handleApiError(error)
      return Promise.reject(error)
    }

    // Initialize retry count
    if (!config.retryCount) {
      config.retryCount = 0
    }

    // Check if we should retry
    if (isRetryableError(error) && config.retryCount < MAX_RETRIES) {
      config.retryCount++
      const delay = getExponentialBackoffDelay(config.retryCount - 1)

      if (isDev) {
        console.log(
          `[API Retry] Attempt ${config.retryCount}/${MAX_RETRIES} after ${delay.toFixed(0)}ms`,
          config.url
        )
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))

      // Retry the request
      return apiClient.request(config)
    }

    // If no more retries, handle the error
    handleApiError(error)
    return Promise.reject(error)
  }
)

/**
 * Handle API errors with appropriate user feedback
 */
function handleApiError(error: AxiosError<ApiErrorResponse>): void {
  if (isDev) {
    console.error('[API Error] Full details:', {
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        hasAuthHeader: !!error.config?.headers?.Authorization
      }
    })
  }

  if (error.response?.status === 401) {
    // Unauthorized - only clear auth if token exists but is invalid
    // Don't clear if no token was sent (let subsequent request try again)
    if (typeof window !== 'undefined') {
      const currentToken = localStorage.getItem('auth_token')
      const currentUser = localStorage.getItem('user')
      
      console.warn('[API] 401 Error - Auth status:', {
        hadToken: !!currentToken,
        hadUser: !!currentUser,
        url: error.config?.url,
        hadAuthHeader: !!error.config?.headers?.Authorization
      })
      
      // Only clear auth if we had a token (session expired), not if token was missing
      if (currentToken && currentUser) {
        console.warn('[API] Clearing auth due to session expiration')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        
        // Store the redirect URL to return after login
        const currentPath = window.location.pathname + window.location.search
        if (currentPath !== '/login') {
          localStorage.setItem('redirect_after_login', currentPath)
        }
        window.location.href = '/login'
        toast.error('Session expired. Please login again.')
      } else {
        // No token in localStorage - avoid redirect loop, just show error
        console.error('[API] 401 Error but no token in localStorage. Endpoint:', error.config?.url)
        toast.error('Authentication failed. Please ensure you are logged in.')
      }
    }
  } else if (error.response?.status === 403) {
    // Forbidden - user lacks permissions
    toast.error('You do not have permission to perform this action.')
  } else if (error.response?.status === 404) {
    // Not found
    const message = error.response?.data?.message || 'Resource not found'
    toast.error(message)
  } else if (error.response?.status === 400) {
    // Bad request - validation errors
    const message = error.response?.data?.message || error.response?.data?.error || 'Invalid request'
    toast.error(message)
  } else if (error.response?.status && error.response.status >= 500) {
    // Server error
    toast.error('Server error. Please try again later.')
  } else if (error.code === 'ECONNABORTED') {
    // Timeout
    toast.error('Request timeout. Please try again.')
  } else if (!error.response) {
    // Network error
    toast.error('Network error. Please check your connection.')
  } else {
    // Generic error
    toast.error('An error occurred. Please try again.')
  }
}

export default apiClient
