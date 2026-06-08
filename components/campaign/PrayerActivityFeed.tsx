'use client'

import React, { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useCampaignPrayers, useReportPrayer, useDeletePrayer } from '@/api/hooks/usePrayers'
import { Prayer } from '@/api/services/prayerService'
import { Modal } from '@/components/Modal'

// ─── Tokens ────────────────────────────────────────────────────────────────────

const t = {
  sand:        '#FAF8F4',
  cream:       '#F3EFE8',
  clay:        '#E8E0D4',
  border:      '#DDD8CF',
  slate:       '#2C2B28',
  charcoal:    '#4A4845',
  muted:       '#8A857D',
  white:       '#FFFFFF',
  violet:      '#7C5CBF',
  violetLight: '#F0EBF9',
  violetMid:   '#B89FE0',
  danger:      '#DC2626',
  dangerLight: '#FEF2F2',
}

// ─── Animations ────────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

const skeletonPulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
`

// ─── Layout ────────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  width: 100%;
  font-family: 'DM Sans', sans-serif;
`

// ── Section Header ──────────────────────────────────────────────────────────────

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`

const SectionTitle = styled.h3`
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: ${t.slate};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

const TitleIconWrap = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${t.violetLight};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
`

const CountBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${t.violet};
  background: ${t.violetLight};
  border: 1px solid rgba(124, 92, 191, 0.2);
  padding: 3px 9px;
  border-radius: 100px;
  font-family: 'Syne', sans-serif;
`

// ── Feed List ───────────────────────────────────────────────────────────────────

const FeedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

// ── Prayer Card ─────────────────────────────────────────────────────────────────

const PrayerCard = styled.div<{ $delay?: number }>`
  background: ${t.white};
  border: 1px solid ${t.border};
  border-radius: 14px;
  padding: 1rem 1.125rem;
  transition: box-shadow 180ms ease, border-color 180ms ease;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${p => (p.$delay || 0) * 60}ms;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${t.clay};
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }

  /* Left accent bar based on type */
  &::before {
    content: '';
    position: absolute;
    left: 0; top: 14px; bottom: 14px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: ${t.violetMid};
    opacity: 0.6;
  }
`

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`

// Avatar
const Avatar = styled.div<{ $type: string }>`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  background: ${t.violetLight};
  border: 1px solid rgba(124, 92, 191, 0.15);
`

const CardInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const NameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2px;
`

const SupporterName = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${t.slate};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Timestamp = styled.span`
  font-size: 0.7rem;
  color: ${t.muted};
  white-space: nowrap;
  flex-shrink: 0;
`

const TypePill = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 8px;
  border-radius: 100px;
  background: ${t.violetLight};
  color: ${t.violet};
  margin-top: 2px;
  width: fit-content;
`

// Content
const ContentArea = styled.div`
  margin-top: 0.625rem;
  padding-left: 50px; /* aligns under name, past avatar+gap */

  @media (max-width: 360px) {
    padding-left: 0;
    margin-top: 0.5rem;
  }
`

const TextContent = styled.p`
  font-size: 0.875rem;
  color: ${t.charcoal};
  line-height: 1.65;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`

const TapMessage = styled.p`
  font-size: 0.82rem;
  color: ${t.muted};
  font-style: italic;
  margin: 0;
`

const MediaWrap = styled.div`
  margin-top: 0.625rem;

  audio, video {
    width: 100%;
    border-radius: 10px;
    outline: none;
  }

  video { max-height: 180px; object-fit: cover; }
`

// Footer
const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.625rem;
  border-top: 1px solid ${t.cream};
`

const ActionBtn = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 1px solid ${p => p.$danger ? 'rgba(220,38,38,0.25)' : t.border};
  color: ${p => p.$danger ? t.danger : t.muted};
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 140ms, border-color 140ms, color 140ms;
  font-family: 'DM Sans', sans-serif;

  &:hover {
    background: ${p => p.$danger ? t.dangerLight : t.cream};
    border-color: ${p => p.$danger ? 'rgba(220,38,38,0.5)' : t.clay};
    color: ${p => p.$danger ? t.danger : t.charcoal};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

// ── Status Badges ────────────────────────────────────────────────────────────────

const StatusBadge = styled.span<{ $variant: 'pending' | 'flagged' }>`
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  ${p => p.$variant === 'pending' && css`
    background: #FEF9C3;
    color: #854D0E;
    border: 1px solid rgba(133,77,14,0.2);
  `}
  ${p => p.$variant === 'flagged' && css`
    background: ${t.dangerLight};
    color: ${t.danger};
    border: 1px solid rgba(220,38,38,0.2);
  `}
`

// ── Empty State ──────────────────────────────────────────────────────────────────

const EmptyState = styled.div`
  text-align: center;
  padding: 2.5rem 1rem;
  background: ${t.sand};
  border: 1.5px dashed ${t.border};
  border-radius: 16px;
`

const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  line-height: 1;
`

const EmptyTitle = styled.p`
  font-family: 'Syne', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: ${t.slate};
  margin: 0 0 0.375rem;
`

const EmptySubtitle = styled.p`
  font-size: 0.8rem;
  color: ${t.muted};
  margin: 0;
  max-width: 220px;
  margin: 0 auto;
  line-height: 1.5;
`

// ── Error State ────────────────────────────────────────────────────────────────

const ErrorMsg = styled.div`
  text-align: center;
  padding: 1.5rem;
  color: ${t.danger};
  font-size: 0.85rem;
  background: ${t.dangerLight};
  border: 1px solid rgba(220,38,38,0.15);
  border-radius: 12px;
`

// ── Skeleton ────────────────────────────────────────────────────────────────────

const SkeletonBase = styled.div<{ $w?: string; $h?: string }>`
  width: ${p => p.$w || '100%'};
  height: ${p => p.$h || '12px'};
  background: ${t.cream};
  border-radius: 100px;
  animation: ${skeletonPulse} 1.4s ease infinite;
`

const SkeletonCard = styled.div`
  background: ${t.white};
  border: 1px solid ${t.border};
  border-radius: 14px;
  padding: 1rem 1.125rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`

// ── Pagination ─────────────────────────────────────────────────────────────────

const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${t.clay};
  gap: 0.5rem;
`

const PageBtn = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: ${p => p.$active ? t.violetLight : t.cream};
  border: 1px solid ${p => p.$active ? 'rgba(124,92,191,0.3)' : t.border};
  color: ${p => p.$active ? t.violet : t.charcoal};
  font-family: 'Syne', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.5rem 0.875rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background 150ms, border-color 150ms;
  min-height: 38px;

  &:hover:not(:disabled) {
    background: ${t.violetLight};
    border-color: rgba(124,92,191,0.3);
    color: ${t.violet};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`

const PageInfo = styled.span`
  font-size: 0.75rem;
  color: ${t.muted};
  white-space: nowrap;
`

// ── Report Modal ────────────────────────────────────────────────────────────────

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: 'DM Sans', sans-serif;
`

const ModalLabel = styled.label`
  display: block;
  font-size: 0.825rem;
  font-weight: 600;
  color: ${t.slate};
  margin-bottom: 0.5rem;
`

const ModalSelect = styled.select`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1.5px solid ${t.border};
  border-radius: 10px;
  background: ${t.white};
  color: ${t.slate};
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 150ms;
  appearance: none;
  cursor: pointer;

  &:focus {
    border-color: ${t.violet};
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const ModalBtns = styled.div`
  display: flex;
  gap: 0.625rem;
`

const ModalBtn = styled.button<{ $variant: 'primary' | 'ghost' }>`
  flex: 1;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  font-family: 'Syne', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 150ms, border-color 150ms;
  border: none;
  min-height: 44px;

  ${p => p.$variant === 'primary' && css`
    background: ${t.violet};
    color: white;
    &:hover { background: #6448A8; }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  `}

  ${p => p.$variant === 'ghost' && css`
    background: ${t.cream};
    color: ${t.charcoal};
    border: 1px solid ${t.border};
    &:hover { background: ${t.clay}; }
  `}
`

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_META: Record<string, { icon: string; label: string }> = {
  tap:   { icon: '🤲', label: 'Quick prayer' },
  text:  { icon: '✍️', label: 'Written prayer' },
  voice: { icon: '🎙️', label: 'Voice prayer' },
  video: { icon: '🎥', label: 'Video prayer' },
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  const now = Date.now()
  const diff = Math.floor((now - d.getTime()) / 1000)
  if (diff < 60)  return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const REPORT_REASONS = [
  { value: 'inappropriate_content', label: 'Inappropriate content' },
  { value: 'harassment', label: 'Harassment or abuse' },
  { value: 'spam', label: 'Spam' },
  { value: 'other', label: 'Other' },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface PrayerActivityFeedProps {
  campaignId: string
  maxItems?: number
  className?: string
  showReportButton?: boolean
  showDeleteButton?: boolean
}

export function PrayerActivityFeed({
  campaignId,
  maxItems = 10,
  className = '',
  showReportButton = true,
  showDeleteButton = false,
}: PrayerActivityFeedProps) {
  const [page, setPage] = useState(1)
  const [reportingId, setReportingId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState('')

  const { data, isLoading, error } = useCampaignPrayers(campaignId, page, maxItems)
  const { mutate: reportPrayer, isPending: isReporting } = useReportPrayer()
  const { mutate: deletePrayer, isPending: isDeleting } = useDeletePrayer()

  // ── Loading skeletons ──────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <Wrapper className={className}>
        <SectionHeader>
          <SectionTitle>
            <TitleIconWrap>🙏</TitleIconWrap>
            Prayer Wall
          </SectionTitle>
        </SectionHeader>
        <FeedList>
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} style={{ animationDelay: `${i * 80}ms` }}>
              <SkeletonBase $w="38px" $h="38px" style={{ borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <SkeletonBase $w="120px" $h="12px" />
                  <SkeletonBase $w="50px" $h="10px" />
                </div>
                <SkeletonBase $h="10px" />
                <SkeletonBase $w="70%" $h="10px" />
              </div>
            </SkeletonCard>
          ))}
        </FeedList>
      </Wrapper>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <Wrapper className={className}>
        <ErrorMsg>Could not load prayers — please try again later.</ErrorMsg>
      </Wrapper>
    )
  }

  // ── Empty ──────────────────────────────────────────────────────────────────

  if (!data?.prayers?.length) {
    return (
      <Wrapper className={className}>
        <SectionHeader>
          <SectionTitle>
            <TitleIconWrap>🙏</TitleIconWrap>
            Prayer Wall
          </SectionTitle>
        </SectionHeader>
        <EmptyState>
          <EmptyIcon>🕊️</EmptyIcon>
          <EmptyTitle>No prayers yet</EmptyTitle>
          <EmptySubtitle>
            Be the first to send a prayer of support for this campaign.
          </EmptySubtitle>
        </EmptyState>
      </Wrapper>
    )
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleReport = () => {
    if (!reportingId || !reportReason.trim()) return
    reportPrayer({ prayerId: reportingId, reason: reportReason })
    setReportingId(null)
    setReportReason('')
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this prayer?')) deletePrayer(id)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Wrapper className={className}>
      <SectionHeader>
        <SectionTitle>
          <TitleIconWrap>🙏</TitleIconWrap>
          Prayer Wall
        </SectionTitle>
        {data.total > 0 && (
          <CountBadge>{data.total.toLocaleString()} prayers</CountBadge>
        )}
      </SectionHeader>

      <FeedList>
        {data.prayers.map((prayer: Prayer, idx: number) => {
          const meta = TYPE_META[prayer.type] || { icon: '🙏', label: 'Prayer' }
          return (
            <PrayerCard key={prayer._id} $delay={idx}>
              <CardTop>
                <Avatar $type={prayer.type}>{meta.icon}</Avatar>
                <CardInfo>
                  <NameRow>
                    <SupporterName>
                      {prayer.is_anonymous ? 'Anonymous' : prayer.supporter_name || 'Prayer Supporter'}
                    </SupporterName>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {prayer.status === 'pending' && <StatusBadge $variant="pending">Pending</StatusBadge>}
                      {prayer.is_flagged && <StatusBadge $variant="flagged">Flagged</StatusBadge>}
                      <Timestamp>{formatTime(prayer.created_at)}</Timestamp>
                    </div>
                  </NameRow>
                  <TypePill $type={prayer.type}>{meta.label}</TypePill>
                </CardInfo>
              </CardTop>

              <ContentArea>
                {prayer.type === 'text' && prayer.content && (
                  <TextContent>{prayer.content}</TextContent>
                )}
                {prayer.type === 'tap' && (
                  <TapMessage>Sent a quiet prayer of support ✨</TapMessage>
                )}
                {prayer.type === 'voice' && prayer.audio_url && (
                  <MediaWrap><audio src={prayer.audio_url} controls /></MediaWrap>
                )}
                {prayer.type === 'video' && prayer.video_url && (
                  <MediaWrap><video src={prayer.video_url} controls /></MediaWrap>
                )}
              </ContentArea>

              {(showReportButton || showDeleteButton) && (
                <CardFooter>
                  {prayer.report_count > 0 && (
                    <span style={{ fontSize: '0.7rem', color: t.muted, marginRight: 'auto' }}>
                      🚩 {prayer.report_count}
                    </span>
                  )}
                  {showReportButton && (
                    <ActionBtn $danger onClick={() => setReportingId(prayer._id)}>
                      🚩 Report
                    </ActionBtn>
                  )}
                  {showDeleteButton && (
                    <ActionBtn onClick={() => handleDelete(prayer._id)} disabled={isDeleting}>
                      ✕ Remove
                    </ActionBtn>
                  )}
                </CardFooter>
              )}
            </PrayerCard>
          )
        })}
      </FeedList>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <PaginationRow>
          <PageBtn
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Prev
          </PageBtn>
          <PageInfo>
            {page} / {data.totalPages}
          </PageInfo>
          <PageBtn
            onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
          >
            Next →
          </PageBtn>
        </PaginationRow>
      )}

      {/* Report Modal */}
      <Modal
        isOpen={!!reportingId}
        onClose={() => { setReportingId(null); setReportReason('') }}
        title="Report Prayer"
        size="sm"
      >
        <ModalBody>
          <div>
            <ModalLabel htmlFor="report-reason">Why are you reporting this?</ModalLabel>
            <ModalSelect
              id="report-reason"
              value={reportReason}
              onChange={e => setReportReason(e.target.value)}
              disabled={isReporting}
            >
              <option value="">Choose a reason…</option>
              {REPORT_REASONS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </ModalSelect>
          </div>
          <ModalBtns>
            <ModalBtn
              $variant="ghost"
              onClick={() => { setReportingId(null); setReportReason('') }}
              disabled={isReporting}
            >
              Cancel
            </ModalBtn>
            <ModalBtn
              $variant="primary"
              onClick={handleReport}
              disabled={!reportReason.trim() || isReporting}
            >
              {isReporting ? 'Reporting…' : 'Submit Report'}
            </ModalBtn>
          </ModalBtns>
        </ModalBody>
      </Modal>
    </Wrapper>
  )
}

export default PrayerActivityFeed