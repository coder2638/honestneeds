import React from 'react'
import { Metadata } from 'next'
import styled from 'styled-components'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { CampaignWizard } from '@/components/campaign/wizard/CampaignWizard'

export const metadata: Metadata = {
  title: 'Create Campaign - HonestNeed',
  description: 'Create a new fundraising or sharing campaign on HonestNeed',
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f7f6f3;
  padding: 0;
`

export default function CreateCampaignPage() {
  return (
    <ProtectedRoute allowedRoles={['creator', 'admin']}>
      <PageContainer>
        <CampaignWizard draftExists={true} />
      </PageContainer>
    </ProtectedRoute>
  )
}