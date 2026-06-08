'use client'

import React from 'react'
import styled from 'styled-components'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PrayerModerationPage } from '@/components/creator/PrayerModerationPage'
import { Button } from '@/components/Button'

/**
 * Prayer Moderation Page Route
 * Dedicated page for creators to moderate prayer submissions
 */

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  background: #f8fafc;
`

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #3b82f6;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.2s ease;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #eff6ff;
  }
`

const HeaderContent = styled.div`
  flex: 1;
`

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
`

const PageSubtitle = styled.p`
  font-size: 15px;
  color: #6b7280;
  margin: 0;
`

export default function PrayerModerationRoute() {
  return (
    <Container>
      {/* Page Header */}
      <PageHeader>
        <BackLink href="/creator/dashboard">
          <ArrowLeft size={18} />
          Back to Dashboard
        </BackLink>
      </PageHeader>

      <HeaderContent>
        <PageTitle>🙏 Prayer Support Moderation</PageTitle>
        <PageSubtitle>
          Review, approve, and manage prayer submissions from your campaigns
        </PageSubtitle>
      </HeaderContent>

      {/* Moderation Component */}
      <div style={{ marginTop: '32px' }}>
        <PrayerModerationPage />
      </div>
    </Container>
  )
}
