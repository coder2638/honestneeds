'use client';

import styled from 'styled-components';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const HeaderWrapper = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: #1a202c;
  }

  p {
    font-size: 1rem;
    color: #718096;
    margin: 0;
  }
`;

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <HeaderWrapper>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {children}
    </HeaderWrapper>
  );
}
