'use client'

import React from 'react'
import styled from 'styled-components'
import { PrayerModerationQueue } from '@/components/creator/PrayerModerationQueue'
import { Button } from '@/components/Button'
import { COLORS, SPACING, TYPOGRAPHY } from '@/styles/tokens'

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING[6]};
`

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING[3]};
`

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING[3]};
  margin-bottom: ${SPACING[2]};
`

const TitleIcon = styled.span`
  font-size: 1.875rem;
`

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${COLORS.TEXT};
  margin: 0;
`

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${COLORS.MUTED_TEXT};
  margin: 0;

  strong {
    color: ${COLORS.TEXT};
  }
`

const InfoBox = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  padding: ${SPACING[4]};

  p {
    font-size: ${TYPOGRAPHY.SIZE_SM};
    color: #1e40af;
    margin: 0;

    strong {
      font-weight: 600;
    }
  }
`

const QueueWrapper = styled.div`
  background: ${COLORS.SURFACE};
  border-radius: 0.5rem;
  border: 1px solid ${COLORS.BORDER};
  padding: ${SPACING[6]};
`

const ComingSoonBox = styled.div`
  background: linear-gradient(to right, #f3e8ff, #fce7f3);
  border: 1px solid #e9d5ff;
  border-radius: 0.5rem;
  padding: ${SPACING[12]} 0;
  text-align: center;
`

const ComingSoonIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: ${SPACING[4]};
`

const ComingSoonTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${COLORS.TEXT};
  margin: 0 0 ${SPACING[2]} 0;
`

const ComingSoonText = styled.p`
  color: ${COLORS.MUTED_TEXT};
  margin: 0 0 ${SPACING[6]} 0;
  max-width: 448px;
  margin-left: auto;
  margin-right: auto;
`

interface PrayerModerationPageProps {
  campaignId?: string
  campaignTitle?: string
}

/**
 * PrayerModerationPage Component
 * Full page view for creators to moderate prayers across campaigns
 */
const PrayerModerationPage: React.FC<PrayerModerationPageProps> = ({
  campaignId,
  campaignTitle,
}) => {
  // If campaignId is provided, show moderation for that campaign only
  if (campaignId) {
    return (
      <Container>
        {/* Page Header */}
        <PageHeader>
          <TitleSection>
            <TitleIcon>🙏</TitleIcon>
            <Title>Prayer Moderation</Title>
          </TitleSection>
          {campaignTitle && (
            <Subtitle>
              Campaign: <strong>{campaignTitle}</strong>
            </Subtitle>
          )}
        </PageHeader>

        {/* Info Box */}
        <InfoBox>
          <p>
            <strong>📋 Moderation Queue:</strong> Review, approve, and reject prayers submitted
            to your campaign. Flagged prayers are automatically reviewed for content violations.
          </p>
        </InfoBox>

        {/* Moderation Queue */}
        <QueueWrapper>
          <PrayerModerationQueue campaignId={campaignId} />
        </QueueWrapper>
      </Container>
    )
  }

  // Show message for multiple campaigns (not implemented in Phase 3)
  return (
    <Container>
      {/* Page Header */}
      <PageHeader>
        <TitleSection>
          <TitleIcon>🙏</TitleIcon>
          <Title>Prayer Moderation</Title>
        </TitleSection>
        <Subtitle>Manage prayers across all your campaigns</Subtitle>
      </PageHeader>

      {/* Coming Soon Message */}
      <ComingSoonBox>
        <ComingSoonIcon>🚀</ComingSoonIcon>
        <ComingSoonTitle>Coming Soon</ComingSoonTitle>
        <ComingSoonText>
          Multi-campaign moderation dashboard will be available in Phase 4. For now, access
          prayer moderation from your individual campaign settings.
        </ComingSoonText>
        <Button
          href="/creator/campaigns"
          variant="primary"
          className="inline-flex items-center gap-2"
        >
          Go to Campaigns
        </Button>
      </ComingSoonBox>
    </Container>
  )
}

export { PrayerModerationPage }
