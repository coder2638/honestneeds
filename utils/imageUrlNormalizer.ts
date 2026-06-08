/**
 * Image URL Normalization Utility
 * Handles various image URL formats and ensures consistent paths across the application
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || API_BASE_URL

/**
 * Normalize image URL to absolute URL accessible from frontend
 * Handles multiple URL formats:
 * - Relative paths: /uploads/campaigns/image.jpg
 * - Absolute paths: http://localhost:3001/uploads/campaigns/image.jpg
 * - Already normalized: https://cdn.example.com/image.jpg
 * - Missing URLs: null or undefined
 *
 * @param {string | null | undefined} imageUrl - Image URL to normalize
 * @returns {string | null} - Normalized absolute URL or null
 */
export const normalizeImageUrl = (imageUrl: string | null | undefined): string | null => {
  // Handle null/undefined/empty strings
  if (!imageUrl || imageUrl.trim() === '') {
    console.debug('[normalizeImageUrl] Image URL is empty, returning null')
    return null
  }

  // Already an absolute URL (http/https/data)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
    console.debug('[normalizeImageUrl] Image URL is already absolute', { imageUrl })
    return imageUrl
  }

  // Relative path (starts with / or relative path)
  if (imageUrl.startsWith('/')) {
    // Handle different relative path patterns
    if (imageUrl.startsWith('/uploads/')) {
      // Already has uploads prefix - use API base URL
      const normalizedUrl = `${API_BASE_URL}${imageUrl}`
      console.debug('[normalizeImageUrl] Normalized relative uploads path', {
        original: imageUrl,
        normalized: normalizedUrl,
      })
      return normalizedUrl
    }

    if (imageUrl.startsWith('/cdn/') || imageUrl.startsWith('/storage/') || imageUrl.startsWith('/images/')) {
      // Use CDN if available, otherwise API
      const normalizedUrl = `${CDN_BASE_URL}${imageUrl}`
      console.debug('[normalizeImageUrl] Normalized CDN/storage path', {
        original: imageUrl,
        normalized: normalizedUrl,
      })
      return normalizedUrl
    }

    // Generic root-relative path
    const normalizedUrl = `${API_BASE_URL}${imageUrl}`
    console.debug('[normalizeImageUrl] Normalized root-relative path', {
      original: imageUrl,
      normalized: normalizedUrl,
    })
    return normalizedUrl
  }

  // Relative path without leading slash (e.g., uploads/campaigns/image.jpg)
  if (!imageUrl.includes('://')) {
    const normalizedUrl = `${API_BASE_URL}/${imageUrl}`
    console.debug('[normalizeImageUrl] Normalized relative path', {
      original: imageUrl,
      normalized: normalizedUrl,
    })
    return normalizedUrl
  }

  // Fallback: return as-is
  console.warn('[normalizeImageUrl] Image URL format not recognized', { imageUrl })
  return imageUrl
}

/**
 * Get image URL with fallback
 * Returns placeholder if URL is null/undefined
 *
 * @param {string | null | undefined} imageUrl - Image URL to normalize
 * @param {string} placeholder - Placeholder URL if image is missing
 * @returns {string} - Normalized URL or placeholder
 */
export const getImageUrl = (
  imageUrl: string | null | undefined,
  placeholder: string = '/images/fallback-campaign.jpg',
): string => {
  const normalized = normalizeImageUrl(imageUrl)
  return normalized || placeholder
}

/**
 * Validate if image URL is valid and accessible
 * Returns true if image should load, false if likely to fail
 *
 * @param {string | null | undefined} imageUrl - Image URL to validate
 * @returns {boolean} - True if URL format is valid
 */
export const isValidImageUrl = (imageUrl: string | null | undefined): boolean => {
  const normalized = normalizeImageUrl(imageUrl)
  if (!normalized) return false

  try {
    // Try to construct URL to validate format
    new URL(normalized)
    return true
  } catch {
    console.warn('[isValidImageUrl] Invalid image URL format', { imageUrl, normalized })
    return false
  }
}

/**
 * Get image source set for responsive images
 * Generates srcSet for different device pixel ratios
 *
 * @param {string | null | undefined} imageUrl - Base image URL
 * @param {boolean} useWebP - Include WebP format
 * @returns {string} - srcSet string for img element
 */
export const getImageSrcSet = (
  imageUrl: string | null | undefined,
  useWebP: boolean = false,
): string => {
  const normalized = normalizeImageUrl(imageUrl)
  if (!normalized) return ''

  // For now, return single URL in srcSet format
  // In the future, could add resizing service support
  return `${normalized} 1x, ${normalized} 2x`
}

/**
 * Optimize image URL by adding resize parameters (if service supports)
 * Currently a pass-through, ready for CDN/image service integration
 *
 * @param {string | null | undefined} imageUrl - Image URL to optimize
 * @param {Object} options - Optimization options
 * @param {number} options.width - Target width
 * @param {number} options.height - Target height
 * @param {string} options.format - Image format (webp, jpg, png)
 * @param {number} options.quality - Quality 0-100
 * @returns {string | null} - Optimized URL
 */
export const optimizeImageUrl = (
  imageUrl: string | null | undefined,
  options: {
    width?: number
    height?: number
    format?: 'webp' | 'jpg' | 'png'
    quality?: number
  } = {},
): string | null => {
  const normalized = normalizeImageUrl(imageUrl)
  if (!normalized) return null

  // TODO: Integrate with image optimization service
  // For now, return normalized URL as-is
  console.debug('[optimizeImageUrl] Image optimization not yet configured', {
    imageUrl: normalized,
    options,
  })

  return normalized
}

/**
 * Extract image path from various URL formats
 * Useful for debugging and URL manipulation
 *
 * @param {string | null | undefined} imageUrl - Image URL
 * @returns {string | null} - Relative path only
 */
export const extractImagePath = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null

  try {
    // Try to parse as URL
    if (imageUrl.includes('://')) {
      const url = new URL(imageUrl)
      return url.pathname
    }

    // Already a path
    return imageUrl
  } catch {
    return imageUrl
  }
}

export default {
  normalizeImageUrl,
  getImageUrl,
  isValidImageUrl,
  getImageSrcSet,
  optimizeImageUrl,
  extractImagePath,
}
