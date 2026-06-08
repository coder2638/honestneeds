'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiShield, FiGlobe } from 'react-icons/fi';
import Container from '../ui/Container';

const StripSection = styled.section`
  padding: ${({ theme }) => theme?.spacing?.xl || '24px'} 0;
  background-color: ${({ theme }) => theme?.colors?.surface || '#FFFFFF'};
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#E2E8F0'};
`;

const StripContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.xl || '24px'};

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Metrics = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.['2xl'] || '32px'};
`;

const Metric = styled(motion.div)`
  text-align: center;
`;

const MetricValue = styled.div`
  font-family: ${({ theme }) => theme?.typography?.headingFont || 'Poppins, sans-serif'};
  font-size: ${({ theme }) => theme?.typography?.sizes?.h2?.size || '32px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.bold || '700'};
  color: ${({ theme }) => theme?.colors?.primary || '#6366F1'};
`;

const MetricLabel = styled.div`
  font-size: ${({ theme }) => theme?.typography?.sizes?.small?.size || '14px'};
  color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
  margin-top: ${({ theme }) => theme?.spacing?.xs || '4px'};
`;

const TrustBadges = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.xl || '24px'};
`;

const TrustBadge = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.sm || '8px'};
  font-size: ${({ theme }) => theme?.typography?.sizes?.small?.size || '14px'};
  color: ${({ theme }) => theme?.colors?.muted || '#64748B'};

  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme?.colors?.success || '#10B981'};
  }
`;

const metrics = [
  { value: '1.2K', label: 'Campaigns' },
  { value: '8.4K', label: 'Supporters' },
  { value: '$120K', label: 'Helped' },
];

const trustItems = [
  { icon: FiCheckCircle, label: 'Verified Platform' },
  { icon: FiShield, label: 'Secure Payments' },
  { icon: FiGlobe, label: 'Community Driven' },
];

export default function TrustStrip() {
  return (
    <StripSection>
      <StripContainer>
        <Metrics>
          {metrics.map((metric, index) => (
            <Metric
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MetricValue>{metric.value}</MetricValue>
              <MetricLabel>{metric.label}</MetricLabel>
            </Metric>
          ))}
        </Metrics>

        <TrustBadges>
          {trustItems.map((item, index) => (
            <TrustBadge
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <item.icon />
              {item.label}
            </TrustBadge>
          ))}
        </TrustBadges>
      </StripContainer>
    </StripSection>
  );
}
