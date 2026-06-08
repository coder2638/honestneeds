'use client';

import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: ${({ maxWidth }) => {
    switch (maxWidth) {
      case 'small': return '768px';
      case 'medium': return '1024px';
      case 'large': return '1200px';
      case 'xl': return '1360px';
      default: return '1200px';
    }
  }};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme?.spacing?.lg || '16px'};

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    padding: 0 ${({ theme }) => theme?.spacing?.xl || '24px'};
  }

  @media (min-width: ${({ theme }) => theme?.breakpoints?.desktop || '1280px'}) {
    padding: 0 ${({ theme }) => theme?.spacing?.['2xl'] || '32px'};
  }
`;

const Section = styled.section`
  padding: ${({ theme, padding }) => {
    switch (padding) {
      case 'small': return `${theme?.spacing?.['2xl'] || '32px'} 0`;
      case 'large': return `${theme?.spacing?.['6xl'] || '96px'} 0`;
      default: return `${theme?.spacing?.['5xl'] || '80px'} 0`;
    }
  }};

  ${({ $bgColor, theme }) => $bgColor && `
    background-color: ${theme?.colors?.[$bgColor] || $bgColor};
  `}
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme, gap }) => theme?.spacing?.[gap] || theme?.spacing?.xl || '24px'};
  grid-template-columns: ${({ columns }) => {
    if (typeof columns === 'object') {
      return columns.mobile || '1fr';
    }
    return `repeat(${columns}, 1fr)`;
  }};

  @media (min-width: ${({ theme }) => theme?.breakpoints?.mobile || '640px'}) {
    grid-template-columns: ${({ columns }) => {
      if (typeof columns === 'object') {
        return columns.tablet || columns.desktop || 'repeat(2, 1fr)';
      }
      return `repeat(${columns}, 1fr)`;
    }};
  }

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    grid-template-columns: ${({ columns }) => {
      if (typeof columns === 'object') {
        return columns.desktop || 'repeat(3, 1fr)';
      }
      return `repeat(${columns}, 1fr)`;
    }};
  }
`;

const Flex = styled.div`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  align-items: ${({ align }) => align || 'center'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
  gap: ${({ theme, gap }) => theme?.spacing?.[gap] || theme?.spacing?.md || '12px'};
  flex-wrap: ${({ wrap }) => wrap || 'nowrap'};

  @media (max-width: ${({ theme }) => theme?.breakpoints?.mobile || '640px'}) {
    flex-direction: ${({ $responsive }) => $responsive ? 'column' : undefined};
  }
`;

export { Section, Grid, Flex };
export default Container;
