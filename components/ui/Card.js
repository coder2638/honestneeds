'use client';

import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

const cardVariants = {
  default: css`
    background-color: ${({ theme }) => theme?.colors?.surface || '#FFFFFF'};
    border-radius: ${({ theme }) => theme?.radii?.medium || '12px'};
    box-shadow: ${({ theme }) => theme?.shadows?.elevation2 || '0 4px 12px rgba(0,0,0,0.1)'};
    overflow: hidden;
  `,
  elevated: css`
    background-color: ${({ theme }) => theme?.colors?.surface || '#FFFFFF'};
    border-radius: ${({ theme }) => theme?.radii?.large || '20px'};
    box-shadow: ${({ theme }) => theme?.shadows?.elevation3 || '0 12px 24px rgba(0,0,0,0.15)'};
    overflow: hidden;
  `,
  flat: css`
    background-color: ${({ theme }) => theme?.colors?.surface || '#FFFFFF'};
    border-radius: ${({ theme }) => theme?.radii?.medium || '12px'};
    border: 1px solid ${({ theme }) => theme?.colors?.border || '#E2E8F0'};
    overflow: hidden;
  `,
};

const StyledCard = styled(motion.div)`
  ${({ $variant }) => cardVariants[$variant] || cardVariants.default}
  transition: all ${({ theme }) => theme?.transitions?.normal || '200ms ease'};

  ${({ $hoverable, theme }) => $hoverable && css`
    cursor: pointer;

    &:hover {
      transform: translateY(-6px);
      box-shadow: ${theme?.shadows?.elevation3 || '0 12px 24px rgba(0,0,0,0.15)'};
    }
  `}

  ${({ $boosted, theme }) => $boosted && css`
    border-left: 4px solid ${theme?.colors?.accent || '#F59E0B'};
  `}
`;

const CardImage = styled.div`
  width: 100%;
  height: ${({ height }) => height || '200px'};
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme?.spacing?.xl || '24px'};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.md || '12px'};
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '12px'};
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme?.spacing?.lg || '16px'};
  border-top: 1px solid ${({ theme }) => theme?.colors?.border || '#E2E8F0'};
  margin-top: ${({ theme }) => theme?.spacing?.lg || '16px'};
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.xs || '4px'};
  padding: ${({ theme }) => theme?.spacing?.xs || '4px'} ${({ theme }) => theme?.spacing?.sm || '8px'};
  border-radius: ${({ theme }) => theme?.radii?.small || '6px'};
  font-size: ${({ theme }) => theme?.typography?.sizes?.xs?.size || '12px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.semibold || '600'};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${({ $type, theme }) => {
    switch ($type) {
      case 'boosted':
        return css`
          background-color: rgba(245, 158, 11, 0.15);
          color: ${theme?.colors?.accentDark || '#D97706'};
        `;
      case 'new':
        return css`
          background-color: rgba(99, 102, 241, 0.15);
          color: ${theme?.colors?.primary || '#6366F1'};
        `;
      case 'urgent':
        return css`
          background-color: rgba(224, 36, 36, 0.15);
          color: ${theme?.colors?.error || '#E0242 4'};
        `;
      default:
        return css`
          background-color: ${theme?.colors?.bg || '#F8FAFC'};
          color: ${theme?.colors?.muted || '#64748B'};
        `;
    }
  }}
`;

export { CardImage, CardContent, CardHeader, CardFooter, Badge };
export default StyledCard;
