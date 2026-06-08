/**
 * Re-export test utilities from __tests__/utils/test-utils.tsx
 * Maintained for backward compatibility with existing test imports
 * 
 * This file allows tests to import from @/lib/test-utils
 * while the actual implementation is in __tests__/utils/test-utils.tsx
 */

// Re-export all test utilities
export * from '../__tests__/utils/test-utils'
