// Design Tokens for HonestNeed (Updated Palette)
export const theme = {
  colors: {
    // Primary - Indigo (Professional, Trustworthy)
    primary: '#6366F1',
    primaryDark: '#4338CA',
    primaryLight: '#A5B4FC',
    
    // Secondary - Rose (Warm, Compassionate, Energetic)
    secondary: '#F43F5E',
    secondaryDark: '#E11D48',
    secondaryLight: '#FB7185',
    
    // Accent - Amber (Optimism, Highlights)
    accent: '#F59E0B',
    accentDark: '#D97706',
    accentLight: '#FCD34D',
    
    // Feedback Colors
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    muted: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    border: '#E2E8F0',
  },
  typography: {
    headingFont: 'Poppins, sans-serif',
    bodyFont: 'Inter, sans-serif',
    sizes: {
      h1: { size: '40px', lineHeight: '48px' },
      h2: { size: '32px', lineHeight: '40px' },
      h3: { size: '24px', lineHeight: '32px' },
      h4: { size: '20px', lineHeight: '28px' },
      body: { size: '16px', lineHeight: '24px' },
      small: { size: '14px', lineHeight: '20px' },
      xs: { size: '12px', lineHeight: '16px' },
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '40px',
    '4xl': '48px',
    '5xl': '64px',
    '6xl': '80px',
  },
  radii: {
    small: '6px',
    medium: '12px',
    large: '20px',
    pill: '9999px',
  },
  shadows: {
    elevation1: '0 1px 4px rgba(15, 23, 42, 0.06)',
    elevation2: '0 6px 18px rgba(15, 23, 42, 0.08)',
    elevation3: '0 18px 50px rgba(15, 23, 42, 0.12)',
    primary: '0 4px 14px rgba(244, 63, 94, 0.3)',
  },
  breakpoints: {
    mobile: '640px',
    tablet: '1024px',
    desktop: '1200px',
  },
  transitions: {
    fast: '140ms cubic-bezier(0.2, 0.9, 0.2, 1)',
    normal: '200ms cubic-bezier(0.2, 0.9, 0.2, 1)',
    slow: '300ms cubic-bezier(0.2, 0.9, 0.2, 1)',
  },
};

export default theme;
