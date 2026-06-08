/**
 * Design System Theme
 * Central location for all design tokens: colors, typography, spacing, shadows, etc.
 * Used throughout the application for consistency and maintainability
 */

export const colors = {
  // Primary brand color
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  primaryBg: '#E0E7FF',

  // Secondary brand color
  secondary: '#F43F5E',
  secondaryLight: '#FB7185',
  secondaryDark: '#E11D48',
  secondaryBg: '#FFE4E6',

  // Accent color
  accent: '#F59E0B',
  accentLight: '#FBBF24',
  accentDark: '#D97706',
  accentBg: '#FEF3C7',

  // Semantic colors
  success: '#10B981',
  successLight: '#6EE7B7',
  successDark: '#059669',
  successBg: '#ECFDF5',

  error: '#EF4444',
  errorLight: '#FCA5A5',
  errorDark: '#DC2626',
  errorBg: '#FEF2F2',

  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',
  warningBg: '#FEF3C7',

  info: '#3B82F6',
  infoLight: '#93C5FD',
  infoDark: '#1D4ED8',
  infoBg: '#EFF6FF',

  // Neutral colors
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  mutedText: '#64748B',
  muted: '#94A3B8',
  border: '#E2E8F0',
  divider: '#CBD5E1',
  disabled: '#F1F5F9',

  // Overlay & transparent
  overlay: 'rgba(15, 23, 42, 0.5)',
  overlayLight: 'rgba(15, 23, 42, 0.25)',
  overlayDark: 'rgba(15, 23, 42, 0.75)',
};

export const typography = {
  // Font families
  fonts: {
    body: "'Georgia', 'Times New Roman', serif",
    mono: '"Courier New", monospace',
  },

  // Font sizes (responsive scale: xs to 4xl)
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },

  // Font weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.01em',
    normal: '0em',
    wide: '0.025em',
  },
};

export const spacing = {
  // Spacing scale in rem (0 to 16, 0.25rem increments)
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
};

export const borderRadius = {
  none: '0',
  xs: '0.125rem',    // 2px
  sm: '0.25rem',     // 4px
  base: '0.375rem', // 6px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  full: '9999px',
};

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  focus: `0 0 0 3px rgba(99, 102, 241, 0.5)`,
};

export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

export const mediaQueries = {
  // Up (min-width)
  up: {
    xs: `@media (min-width: ${breakpoints.xs})`,
    sm: `@media (min-width: ${breakpoints.sm})`,
    md: `@media (min-width: ${breakpoints.md})`,
    lg: `@media (min-width: ${breakpoints.lg})`,
    xl: `@media (min-width: ${breakpoints.xl})`,
  },
  // Down (max-width)
  down: {
    xs: `@media (max-width: 639px)`,
    sm: `@media (max-width: 767px)`,
    md: `@media (max-width: 1023px)`,
    lg: `@media (max-width: 1279px)`,
    xl: `@media (max-width: 1919px)`,
  },
};

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
};

// Combine all theme exports
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  mediaQueries,
  transitions,
};

export default theme;
