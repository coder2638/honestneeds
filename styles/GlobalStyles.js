'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStylesBase = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme?.typography?.bodyFont || "'Georgia', 'Times New Roman', serif"};
    font-size: ${({ theme }) => theme?.typography?.sizes?.body?.size || '16px'};
    line-height: ${({ theme }) => theme?.typography?.sizes?.body?.lineHeight || '24px'};
    color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
    background-color: ${({ theme }) => theme?.colors?.bg || '#F8FAFC'};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme?.typography?.headingFont || "'Georgia', 'Times New Roman', serif"};
    font-weight: ${({ theme }) => theme?.typography?.weights?.bold || '700'};
    color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  }

  h1 {
    font-size: ${({ theme }) => theme?.typography?.sizes?.h1?.size || '40px'};
    line-height: ${({ theme }) => theme?.typography?.sizes?.h1?.lineHeight || '48px'};
  }

  h2 {
    font-size: ${({ theme }) => theme?.typography?.sizes?.h2?.size || '32px'};
    line-height: ${({ theme }) => theme?.typography?.sizes?.h2?.lineHeight || '40px'};
  }

  h3 {
    font-size: ${({ theme }) => theme?.typography?.sizes?.h3?.size || '24px'};
    line-height: ${({ theme }) => theme?.typography?.sizes?.h3?.lineHeight || '32px'};
  }

  h4 {
    font-size: ${({ theme }) => theme?.typography?.sizes?.h4?.size || '20px'};
    line-height: ${({ theme }) => theme?.typography?.sizes?.h4?.lineHeight || '28px'};
  }

  p {
    margin-bottom: ${({ theme }) => theme?.spacing?.lg || '16px'};
  }

  a {
    color: ${({ theme }) => theme?.colors?.primary || '#6366F1'};
    text-decoration: none;
    transition: color ${({ theme }) => theme?.transitions?.fast || '140ms cubic-bezier(0.2, 0.9, 0.2, 1)'};

    &:hover {
      color: ${({ theme }) => theme?.colors?.primaryDark || '#4338CA'};
    }
  }

  button {
    font-family: ${({ theme }) => theme?.typography?.bodyFont || "'Georgia', 'Times New Roman', serif"};
    cursor: pointer;
    border: none;
    outline: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  input, textarea, select {
    font-family: ${({ theme }) => theme?.typography?.bodyFont || "'Georgia', 'Times New Roman', serif"};
    font-size: ${({ theme }) => theme?.typography?.sizes?.body?.size || '16px'};
  }

  /* Focus styles for accessibility */
  *:focus-visible {
    outline: 3px solid rgba(244, 63, 94, 0.25);
    outline-offset: 2px;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme?.colors?.bg || '#F8FAFC'};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme?.colors?.border || '#E2E8F0'};
    border-radius: ${({ theme }) => theme?.radii?.small || '6px'};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme?.colors?.muted || '#64748B'};
  }
`;

export default GlobalStylesBase;
