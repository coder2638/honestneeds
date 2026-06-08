'use client';

import styled from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.spacing?.xs || '4px'};
  width: 100%;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme?.typography?.sizes?.small?.size || '14px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.medium || '500'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme?.spacing?.md || '12px'} ${({ theme }) => theme?.spacing?.lg || '16px'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#E2E8F0'};
  border-radius: ${({ theme }) => theme?.radii?.medium || '12px'};
  font-size: ${({ theme }) => theme?.typography?.sizes?.body?.size || '16px'};
  background-color: ${({ theme }) => theme?.colors?.surface || '#FFFFFF'};
  transition: all ${({ theme }) => theme?.transitions?.fast || '100ms ease'};

  &::placeholder {
    color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
  }

  &:focus {
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366F1'};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }

  &:disabled {
    background-color: ${({ theme }) => theme?.colors?.bg || '#F8FAFC'};
    cursor: not-allowed;
  }

  ${({ $error, theme }) => $error && `
    border-color: ${theme?.colors?.error || '#E0242 4'};
    
    &:focus {
      box-shadow: 0 0 0 3px rgba(224, 36, 36, 0.15);
    }
  `}
`;

const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme?.typography?.sizes?.small?.size || '14px'};
  color: ${({ theme }) => theme?.colors?.error || '#E0242 4'};
`;

const InputIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: ${({ theme }) => theme?.spacing?.md || '12px'};
    color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
    width: 20px;
    height: 20px;
  }

  ${StyledInput} {
    padding-left: ${({ theme }) => theme?.spacing?.['3xl'] || '48px'};
  }
`;

export { Label, ErrorMessage, InputIcon };
export default StyledInput;
