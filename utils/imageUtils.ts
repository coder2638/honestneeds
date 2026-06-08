/**
 * Image Utilities
 * Handles image URL transformation for Next.js Image component compatibility
 */

/**
 * Get the backend base URL for image serving
 * Used to convert relative paths like 'uploads/campaign_xxx.jpg' to absolute URLs
 */
export function getImageBaseUrl(): string {
  // Check for explicit backend URL env var
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL
  }
  
  // Default to localhost:5000 in development
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000'
  }
  
  // Default to current origin in production
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Server-side default
  return 'http://localhost:5000'
}

/**
 * Convert image URL to absolute URL for Next.js Image component
 * 
 * Handles three types of URLs:
 * 1. Relative paths from backend: 'uploads/campaign_xxx.jpg' -> 'http://localhost:5000/uploads/campaign_xxx.jpg'
 * 2. Absolute URLs: 'http://...' -> returned as-is
 * 3. Root paths: '/uploads/...' -> returned as-is
 * 
 * @param imageUrl - The image URL or path to process
 * @returns A valid absolute URL for Next.js Image component
 */
export function normalizeImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) {
    console.debug('🖼️ [imageUtils] No image URL provided');
    return null
  }

  // Already absolute URL - return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    console.debug('🖼️ [imageUtils] Absolute URL detected, using as-is', {
      originalUrl: imageUrl,
      isSecure: imageUrl.startsWith('https://'),
    });
    return imageUrl
  }

  // Already root path - return as-is
  if (imageUrl.startsWith('/')) {
    console.debug('🖼️ [imageUtils] Root path detected, using as-is', {
      originalUrl: imageUrl,
    });
    return imageUrl
  }

  // Relative backend path - add backend base URL
  // e.g., 'uploads/campaign_xxx.jpg' -> 'http://localhost:5000/uploads/campaign_xxx.jpg'
  const baseUrl = getImageBaseUrl();
  const normalizedUrl = `${baseUrl}/${imageUrl}`;
  
  console.debug('🖼️ [imageUtils] Relative path normalized', {
    originalUrl: imageUrl,
    baseUrl,
    normalizedUrl,
    nodeEnv: process.env.NODE_ENV,
  });

  // Test fetch the image to see response headers
  if (typeof window !== 'undefined') {
    fetch(normalizedUrl, { method: 'HEAD' })
      .then(response => {
        console.debug('🖼️ [imageUtils] HEAD request successful', {
          normalizedUrl,
          status: response.status,
          contentType: response.headers.get('content-type'),
          corsOrigin: response.headers.get('access-control-allow-origin'),
          corsCredentials: response.headers.get('access-control-allow-credentials'),
          corsHeaders: response.headers.get('access-control-allow-headers'),
        });
      })
      .catch(error => {
        console.warn('⚠️ [imageUtils] HEAD request failed', {
          normalizedUrl,
          error: error.message,
        });
      });
  }

  return normalizedUrl
}

/**
 * Get a safe image URL with fallback
 * Returns normalized URL or null if not available
 */
export function getSafeImageUrl(imageUrl?: string | null): string | null {
  try {
    return normalizeImageUrl(imageUrl)
  } catch (error) {
    console.warn('⚠️ [imageUtils] Failed to normalize image URL:', { imageUrl, error })
    return null
  }
}
