'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { useCreatorModerationQueue, useApprovePrayer, useRejectPrayer } from '@/api/hooks/usePrayers'
import { Prayer } from '@/api/services/prayerService'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { COLORS, SPACING, TYPOGRAPHY } from '@/styles/tokens'

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING[6]};
`

const TabsContainer = styled.div`
  display: flex;
  gap: ${SPACING[2]};
  border-bottom: 1px solid ${COLORS.BORDER};
`

const Tab = styled.button<{ active: boolean; variant?: string }>`
  padding: ${SPACING[2]} ${SPACING[4]};
  font-weight: 500;
  border-bottom: 2px solid ${(props) => (props.active ? '#9333ea' : 'transparent')};
  background: transparent;
  color: ${(props) => (props.active ? '#9333ea' : COLORS.MUTED_TEXT)};
  cursor: pointer;
  transition: all 0.2s;
  font-size: ${TYPOGRAPHY.SIZE_SM};

  &:hover {
    color: ${(props) => (props.active ? '#9333ea' : COLORS.TEXT)};
  }
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${SPACING[8]} 0;
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${SPACING[8]} 0;

  p {
    color: ${COLORS.ERROR};
    font-size: ${TYPOGRAPHY.SIZE_SM};
  }
`

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: ${SPACING[12]} 0;
`

const EmptyIcon = styled.p`
  font-size: 1.5rem;
  margin-bottom: ${SPACING[2]};
`

const EmptyText = styled.p`
  color: ${COLORS.MUTED_TEXT};
  font-size: ${TYPOGRAPHY.SIZE_SM};
`

const PrayersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING[3]};
`

const PrayerCard = styled.div`
  padding: ${SPACING[4]};
  background: ${COLORS.SURFACE};
  border-radius: 0.5rem;
  border: 1px solid ${COLORS.BORDER};
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${SPACING[3]};
  gap: ${SPACING[3]};
`

const CardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING[2]};
  flex: 1;
`

const PrayerType = styled.span`
  font-size: 1.25rem;
`

const CardInfo = styled.div`
  flex: 1;
`

const PrayerName = styled.p`
  font-weight: 500;
  color: ${COLORS.TEXT};
  margin: 0;
  font-size: ${TYPOGRAPHY.SIZE_SM};
`

const PrayerTime = styled.p`
  font-size: 0.75rem;
  color: ${COLORS.MUTED_TEXT};
  margin: 0;
  margin-top: ${SPACING[1]};
`

const BadgeGroup = styled.div`
  display: flex;
  gap: ${SPACING[2]};
  flex-wrap: wrap;
`

const Badge = styled.span<{ variant?: string }>`
  padding: ${SPACING[1]} ${SPACING[2]};
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => {
    switch (props.variant) {
      case 'flagged':
        return '#fee2e2'
      case 'reported':
        return '#fed7aa'
      default:
        return COLORS.BG
    }
  }};
  color: ${(props) => {
    switch (props.variant) {
      case 'flagged':
        return '#991b1b'
      case 'reported':
        return '#92400e'
      default:
        return COLORS.TEXT
    }
  }};
`

const ContentSection = styled.div`
  margin-bottom: ${SPACING[3]};
`

const ContentText = styled.p`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.TEXT};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
`

const AudioVideo = styled.div`
  margin-top: ${SPACING[2]};
`

const MediaPlayer = styled.audio`
  width: 100%;
  height: 2rem;
`

const VideoPlayer = styled.video`
  width: 100%;
  border-radius: 0.25rem;
  max-height: 150px;
`

const DurationText = styled.p`
  font-size: 0.75rem;
  color: ${COLORS.MUTED_TEXT};
  margin: ${SPACING[1]} 0 0 0;
`

const FlagReasonBox = styled.div`
  margin-bottom: ${SPACING[3]};
  padding: ${SPACING[2]};
  background: #fee2e2;
  border-radius: 0.25rem;
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: #991b1b;

  p {
    margin: 0;
    font-weight: 600;

    &:not(:first-of-type) {
      margin-top: ${SPACING[1]};
      font-weight: normal;
    }
  }
`

const ReportReasonsBox = styled.div`
  margin-bottom: ${SPACING[3]};
  padding: ${SPACING[2]};
  background: #fed7aa;
  border-radius: 0.25rem;
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: #92400e;

  p {
    margin: 0 0 ${SPACING[1]} 0;
    font-weight: 600;
  }

  ul {
    margin: 0;
    padding-left: ${SPACING[4]};
  }

  li {
    margin-bottom: ${SPACING[1]};
  }
`

const ActionSection = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  gap: ${SPACING[2]};
  padding-top: ${SPACING[3]};
  border-top: 1px solid ${COLORS.BORDER};
`

const StatusMessage = styled.div<{ status: string }>`
  padding-top: ${SPACING[3]};
  border-top: 1px solid ${COLORS.BORDER};
  font-size: 0.75rem;
  color: ${(props) => {
    switch (props.status) {
      case 'approved':
        return '#166534'
      case 'rejected':
        return '#991b1b'
      default:
        return COLORS.MUTED_TEXT
    }
  }};
`

interface PrayerModerationQueueProps {
  campaignId: string
}

type TabType = 'pending' | 'flagged' | 'reported'

/**
 * PrayerModerationQueue Component
 * Allows campaign creators to moderate and manage prayers
 * Shows pending, flagged, and reported prayers separately
 */
const PrayerModerationQueue: React.FC<PrayerModerationQueueProps> = ({
  campaignId,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('pending')
  const [rejectingPrayerId, setRejectingPrayerId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const { data, isLoading, error } = useCreatorModerationQueue(campaignId)
  const { mutate: approvePrayer, isPending: isApproving } = useApprovePrayer()
  const { mutate: rejectPrayer, isPending: isRejecting } = useRejectPrayer()

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner size="md" />
      </LoadingContainer>
    )
  }

  if (error) {
    return (
      <ErrorContainer>
        <p>Failed to load moderation queue. Please try again later.</p>
      </ErrorContainer>
    )
  }

  const items = data?.[activeTab] || []
  const totalPending = data?.pending?.length || 0
  const totalFlagged = data?.flagged?.length || 0
  const totalReported = data?.reported?.length || 0

  const handleApprove = (prayerId: string) => {
    approvePrayer(prayerId)
  }

  const handleReject = (prayerId: string) => {
    if (!rejectReason.trim()) return

    rejectPrayer({
      prayerId,
      reason: rejectReason,
    })

    setRejectingPrayerId(null)
    setRejectReason('')
  }

  const renderPrayerContent = (prayer: Prayer) => {
    switch (prayer.type) {
      case 'tap':
        return <ContentText>✨ Quick tap prayer</ContentText>
      case 'text':
        return <ContentText>{prayer.content}</ContentText>
      case 'voice':
        return (
          <AudioVideo>
            <MediaPlayer
              src={prayer.audio_url}
              controls
            />
            {prayer.audio_duration_seconds && (
              <DurationText>Duration: {prayer.audio_duration_seconds}s</DurationText>
            )}
          </AudioVideo>
        )
      case 'video':
        return (
          <AudioVideo>
            <VideoPlayer
              src={prayer.video_url}
              controls
            />
            {prayer.video_duration_seconds && (
              <DurationText>Duration: {prayer.video_duration_seconds}s</DurationText>
            )}
          </AudioVideo>
        )
      default:
        return null
    }
  }

  return (
    <Container>
      {/* Tabs */}
      <TabsContainer>
        <Tab
          active={activeTab === 'pending'}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending {totalPending > 0 && <span> ({totalPending})</span>}
        </Tab>

        <Tab
          active={activeTab === 'flagged'}
          onClick={() => setActiveTab('flagged')}
        >
          🚩 Flagged {totalFlagged > 0 && <span> ({totalFlagged})</span>}
        </Tab>

        <Tab
          active={activeTab === 'reported'}
          onClick={() => setActiveTab('reported')}
        >
          ⚠️ Reported {totalReported > 0 && <span> ({totalReported})</span>}
        </Tab>
      </TabsContainer>

      {/* Empty State */}
      {items.length === 0 && (
        <EmptyStateContainer>
          {activeTab === 'pending' && (
            <>
              <EmptyIcon>✨</EmptyIcon>
              <EmptyText>No pending prayers to review. Your prayers are all approved!</EmptyText>
            </>
          )}
          {activeTab === 'flagged' && (
            <>
              <EmptyIcon>✅</EmptyIcon>
              <EmptyText>No flagged prayers. Keep up the good moderation!</EmptyText>
            </>
          )}
          {activeTab === 'reported' && (
            <>
              <EmptyIcon>😊</EmptyIcon>
              <EmptyText>No reported prayers. Your community is being respectful!</EmptyText>
            </>
          )}
        </EmptyStateContainer>
      )}

      {/* Prayer Items */}
      <PrayersList>
        {items.map((item) => {
          const prayer = item.prayer || item
          return (
            <PrayerCard key={prayer._id}>
              {/* Header */}
              <CardHeader>
                <CardHeaderLeft>
                  <PrayerType>
                    {prayer.type === 'tap' && '👆'}
                    {prayer.type === 'text' && '✍️'}
                    {prayer.type === 'voice' && '🎙️'}
                    {prayer.type === 'video' && '🎥'}
                  </PrayerType>
                  <CardInfo>
                    <PrayerName>
                      {prayer.is_anonymous ? 'Anonymous' : prayer.supporter_name || 'Prayer Supporter'}
                    </PrayerName>
                    <PrayerTime>
                      {new Date(prayer.created_at).toLocaleDateString()}{' '}
                      {new Date(prayer.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </PrayerTime>
                  </CardInfo>
                </CardHeaderLeft>

                {/* Status Badges */}
                <BadgeGroup>
                  {prayer.is_flagged && (
                    <Badge variant="flagged">🚩 Flagged</Badge>
                  )}
                  {prayer.report_count > 0 && (
                    <Badge variant="reported">⚠️ {prayer.report_count} reports</Badge>
                  )}
                </BadgeGroup>
              </CardHeader>

              {/* Content */}
              <ContentSection>{renderPrayerContent(prayer)}</ContentSection>

              {/* Flag Reason */}
              {prayer.is_flagged && prayer.flag_reason && (
                <FlagReasonBox>
                  <p>Flag reason:</p>
                  <p>{prayer.flag_reason}</p>
                </FlagReasonBox>
              )}

              {/* Report Reasons */}
              {item.report_reasons && item.report_reasons.length > 0 && (
                <ReportReasonsBox>
                  <p>Report reasons:</p>
                  <ul>
                    {item.report_reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </ReportReasonsBox>
              )}

              {/* Actions */}
              {prayer.status === 'pending' && (
                <ActionSection show={true}>
                  <Button
                    onClick={() => handleApprove(prayer._id)}
                    disabled={isApproving}
                    variant="primary"
                    size="sm"
                    style={{ flex: 1, background: '#16a34a', color: 'white' }}
                  >
                    {isApproving ? '...' : '✅ Approve'}
                  </Button>
                  <Button
                    onClick={() => setRejectingPrayerId(prayer._id)}
                    disabled={isRejecting}
                    variant="secondary"
                    size="sm"
                    style={{ flex: 1 }}
                  >
                    ❌ Reject
                  </Button>
                </ActionSection>
              )}

              {prayer.status === 'approved' && (
                <StatusMessage status="approved">
                  ✅ Approved - Published to feed
                </StatusMessage>
              )}

              {prayer.status === 'rejected' && (
                <StatusMessage status="rejected">
                  ❌ Rejected - Hidden from feed
                </StatusMessage>
              )}
            </PrayerCard>
          )
        })}
      </PrayersList>

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectingPrayerId}
        onClose={() => {
          setRejectingPrayerId(null)
          setRejectReason('')
        }}
        title="Reject Prayer"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[4] }}>
          <p style={{ fontSize: TYPOGRAPHY.SIZE_SM, color: COLORS.MUTED_TEXT }}>
            Why would you like to reject this prayer?
          </p>

          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Optional reason for rejection..."
            style={{
              width: '100%',
              height: `${24 * 4}px`,
              padding: SPACING[3],
              border: `1px solid ${COLORS.BORDER}`,
              borderRadius: '0.5rem',
              background: COLORS.SURFACE,
              color: COLORS.TEXT,
              fontSize: TYPOGRAPHY.SIZE_SM,
              fontFamily: 'inherit',
            }}
            disabled={isRejecting}
          />

          <div style={{ display: 'flex', gap: SPACING[2] }}>
            <Button
              onClick={() => {
                setRejectingPrayerId(null)
                setRejectReason('')
              }}
              variant="secondary"
              style={{ flex: 1 }}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              onClick={() => rejectingPrayerId && handleReject(rejectingPrayerId)}
              variant="primary"
              style={{ flex: 1, background: '#dc2626', color: 'white' }}
              disabled={isRejecting}
            >
              {isRejecting ? 'Rejecting...' : 'Reject'}
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  )
}

export { PrayerModerationQueue }
