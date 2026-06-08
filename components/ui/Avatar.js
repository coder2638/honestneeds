'use client';

import styled, { css } from 'styled-components';

const avatarSizes = {
  small: '32px',
  medium: '40px',
  large: '56px',
  xl: '80px',
};

const StyledAvatar = styled.div`
  width: ${({ size }) => avatarSizes[size] || avatarSizes.medium};
  height: ${({ size }) => avatarSizes[size] || avatarSizes.medium};
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background-color: ${({ theme, $bgColor }) => $bgColor || theme?.colors?.primary || '#6366F1'};
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ src }) => src && css`
    background-image: url(${src});
    background-size: cover;
    background-position: center;
  `}

  ${({ $bordered, theme }) => $bordered && css`
    border: 3px solid ${theme?.colors?.surface || '#FFFFFF'};
    box-shadow: ${theme?.shadows?.elevation1 || '0 1px 3px rgba(0,0,0,0.08)'};
  `}
`;

const Initials = styled.span`
  color: white;
  font-weight: ${({ theme }) => theme?.typography?.weights?.bold || '700'};
  font-size: ${({ size }) => {
    switch (size) {
      case 'small': return '12px';
      case 'large': return '20px';
      case 'xl': return '28px';
      default: return '14px';
    }
  }};
`;

// Generate a consistent color based on name
function getColorFromName(name) {
  const colors = ['#E11D48', '#6366F1', '#F59E0B', '#10B981', '#F43F5E', '#4F46E5'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Get initials from name
function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ 
  src, 
  name = '', 
  size = 'medium', 
  bordered = false 
}) {
  const bgColor = getColorFromName(name);
  const initials = getInitials(name);

  return (
    <StyledAvatar 
      src={src} 
      size={size} 
      $bordered={bordered}
      $bgColor={!src ? bgColor : undefined}
    >
      {!src && <Initials size={size}>{initials}</Initials>}
    </StyledAvatar>
  );
}
