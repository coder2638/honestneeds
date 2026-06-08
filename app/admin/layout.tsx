'use client'

import { ReactNode } from 'react'
import styled from 'styled-components'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Styled Components
const LoadingContainer = styled.div`
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
`

const LoadingSpinner = styled.div`
  animation: spin 1s linear infinite;
  border-radius: 9999px;
  width: 3rem;
  height: 3rem;
  border: 2px solid #e2e8f0;
  border-top-color: #6366f1;
  border-bottom-color: #6366f1;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const MainContent = styled.main`
  flex: 1;
  min-height: calc(100vh - 4rem);
  background-color: #f8fafc;
`

const ContentContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (min-width: 640px) {
    padding: 2rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem 2rem;
  }
`

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      router.push('/unauthorized')
    }
  }, [user, router])

  // Show loading state while checking permission
  if (!user || user.role !== 'admin') {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    )
  }

  return (
    <MainContent>
      <ContentContainer>
        {children}
      </ContentContainer>
    </MainContent>
  )
}
