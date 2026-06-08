'use client';

import styled, { css } from 'styled-components';

const tagVariants = {
  default: css`
    background-color: ${({ theme }) => theme?.colors?.bg || '#F8FAFC'};
    color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
  `,
  primary: css`
    background-color: rgba(244, 63, 94, 0.1);
    color: ${({ theme }) => theme?.colors?.secondary || '#F43F5E'};
  `,
  secondary: css`
    background-color: rgba(99, 102, 241, 0.1);
    color: ${({ theme }) => theme?.colors?.primary || '#6366F1'};
  `,
  accent: css`
    background-color: rgba(245, 158, 11, 0.15);
    color: ${({ theme }) => theme?.colors?.accentDark || '#D97706'};
  `,
  success: css`
    background-color: rgba(16, 185, 129, 0.1);
    color: ${({ theme }) => theme?.colors?.success || '#10B981'};
  `,
  urgent: css`
    background-color: rgba(239, 68, 68, 0.1);
    color: ${({ theme }) => theme?.colors?.error || '#EF4444'};
  `,
};

const tagSizes = {
  small: css`
    padding: ${({ theme }) => theme?.spacing?.xs || '4px'} ${({ theme }) => theme?.spacing?.sm || '8px'};
    font-size: ${({ theme }) => theme?.typography?.sizes?.xs?.size || '12px'};
  `,
  medium: css`
    padding: ${({ theme }) => theme?.spacing?.sm || '8px'} ${({ theme }) => theme?.spacing?.md || '12px'};
    font-size: ${({ theme }) => theme?.typography?.sizes?.small?.size || '14px'};
  `,
};

const StyledTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.xs || '4px'};
  border-radius: ${({ theme }) => theme?.radii?.small || '6px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.medium || '500'};
  white-space: nowrap;

  ${({ $variant }) => tagVariants[$variant] || tagVariants.default}
  ${({ $size }) => tagSizes[$size] || tagSizes.medium}

  svg {
    width: 1em;
    height: 1em;
  }
`;

export default function Tag({ children, variant = 'default', size = 'medium', icon: Icon }) {
  return (
    <StyledTag $variant={variant} $size={size}>
      {Icon && <Icon />}
      {children}
    </StyledTag>
  );
}
