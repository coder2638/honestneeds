/**
 * Design System Tokens
 * Centralized configuration for colors, typography, spacing, and other design variables
 */

export const colors = {
  primary: '#6366F1', // Indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#F43F5E', // Rose
  secondaryLight: '#FB7185',
  secondaryDark: '#E11D48',
  accent: '#F59E0B', // Amber
  accentLight: '#FBBF24',
  accentDark: '#D97706',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  error: '#EF4444',
  errorLight: '#FCA5A5',
  success: '#10B981',
  successLight: '#A7F3D0',
  warning: '#F59E0B',
  warningLight: '#FCD34D',
  info: '#0EA5E9',
  infoLight: '#BAE6FD',
}

export const typography = {
  fontFamily: "'Georgia', 'Times New Roman', serif",
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
}

export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
}

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
  base: '0 1px 3px 0 rgba(15, 23, 42, 0.1), 0 1px 2px 0 rgba(15, 23, 42, 0.06)',
  md: '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)',
  lg: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
  xl: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
}

export const borderRadius = {
  none: '0',
  sm: '0.25rem', // 4px
  base: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
}

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

export const mediaQueries = {
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
  smDown: `(max-width: ${parseInt(breakpoints.sm) - 1}px)`,
  mdDown: `(max-width: ${parseInt(breakpoints.md) - 1}px)`,
  lgDown: `(max-width: ${parseInt(breakpoints.lg) - 1}px)`,
}

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
}

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  breakpoints,
  mediaQueries,
  transitions,
}

export default theme
