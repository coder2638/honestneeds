'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const ProgressContainer = styled.div`
  width: 100%;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme?.colors?.bg || '#F8FAFC'};
  border-radius: ${({ theme }) => theme?.radii?.pill || '9999px'};
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme?.colors?.primary || '#6366F1'} 0%, ${({ theme }) => theme?.colors?.secondary || '#A78BFA'} 100%);
  border-radius: ${({ theme }) => theme?.radii?.pill || '9999px'};
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme?.spacing?.sm || '8px'};
  font-size: ${({ theme }) => theme?.typography?.sizes?.small?.size || '14px'};
`;

const ProgressLabel = styled.span`
  color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
`;

const ProgressValue = styled.span`
  font-weight: ${({ theme }) => theme?.typography?.weights?.semibold || '600'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
`;

export default function ProgressBar({ 
  progress = 0, 
  label,
  showPercentage = true,
  animated = true 
}) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <ProgressContainer>
      <ProgressTrack>
        <ProgressFill
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ 
            duration: animated ? 1 : 0, 
            ease: [0.2, 0.9, 0.2, 1] 
          }}
        />
      </ProgressTrack>
      {showPercentage && (
        <ProgressInfo>
          {label && <ProgressLabel>{label}</ProgressLabel>}
          <ProgressValue>{Math.round(clampedProgress)}%</ProgressValue>
        </ProgressInfo>
      )}
    </ProgressContainer>
  );
}
