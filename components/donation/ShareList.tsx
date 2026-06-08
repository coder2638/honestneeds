'use client'

import styled from 'styled-components'
import Link from 'next/link'
import { useState } from 'react'

interface Share {
  shareId: string
  campaignId: string
  campaignTitle: string
  channel: string
  is_paid: boolean
  reward_amount: number // in cents
  status: string
  createdAt: string
}

interface ShareListProps {
  shares: Share[]
  isLoading: boolean
  onCopyLink?: (link: string) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;

  @media (max-width: 768px) {
    border: none;
    display: none;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;

  thead {
    background-color: #f8fafc;
    border-bottom: 2px solid #e2e8f0;

    th {
      padding: 1rem;
      text-align: left;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 0.5px;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #e2e8f0;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #f8fafc;
      }

      &:last-child {
        border-bottom: none;
      }

      td {
        padding: 1rem;
        color: #0f172a;
      }
    }
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;

    thead th {
      padding: 0.75rem;
      font-size: 0.7rem;
    }

    tbody td {
      padding: 0.75rem;
    }
  }
`

// Mobile Card Layout
const CardGridWrapper = styled.div`
  display: none;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    display: flex;
  }
`

const ShareCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease;

  &:active {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`

const CardLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 80px;
`

const CardValue = styled.span`
  font-weight: 600;
  color: #0f172a;
  text-align: right;
  flex: 1;
  padding-left: 1rem;
`

const CardHeader = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f9ff;
`

const CampaignTitle = styled(Link)`
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  word-break: break-word;
  transition: color 0.2s ease;

  &:hover {
    color: #4f46e5;
    text-decoration: underline;
  }
`

const CardActions = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
`

const CampaignCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const CampaignLink = styled(Link)`
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;

  &:hover {
    color: #4f46e5;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }
`

const ChannelBadge = styled.span<{ channel: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  background-color: ${props => {
    switch (props.channel) {
      case 'facebook':
        return '#dbeafe'
      case 'twitter':
        return '#bfdbfe'
      case 'linkedin':
        return '#dbeafe'
      case 'email':
        return '#fef08a'
      case 'whatsapp':
        return '#dcfce7'
      case 'link':
        return '#f3e8ff'
      default:
        return '#f0f9ff'
    }
  }};
  color: ${props => {
    switch (props.channel) {
      case 'facebook':
        return '#0c4a6e'
      case 'twitter':
        return '#0369a1'
      case 'linkedin':
        return '#0c4a6e'
      case 'email':
        return '#854d0e'
      case 'whatsapp':
        return '#15803d'
      case 'link':
        return '#6b21a8'
      default:
        return '#0369a1'
    }
  }};
`

const StatCell = styled.span`
  font-weight: 700;
  color: #0f172a;
`

const DateCell = styled.span`
  color: #64748b;
  font-size: 0.9rem;
`

const ActionsCell = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

const ActionButton = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #6366f1;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ede9fe;
    border-color: #6366f1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }
`

const EmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
`

const EmptyText = styled.p`
  color: #64748b;
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
`

const EmptyLink = styled(Link)`
  display: inline-block;
  padding: 0.625rem 1.25rem;
  background-color: #6366f1;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #4f46e5;
  }
`

const LoadingRow = styled.tr`
  td {
    padding: 1rem;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: loading 1.5s infinite;

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  }
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`

const PaginationButton = styled.button`
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #ede9fe;
    border-color: #6366f1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.active {
    background-color: #6366f1;
    color: white;
    border-color: #6366f1;
  }
`

const PaginationInfo = styled.span`
  color: #64748b;
  font-size: 0.9rem;
  margin: 0 1rem;
`

const getChannelLabel = (channel: string): string => {
  switch (channel) {
    case 'facebook':
      return 'Facebook'
    case 'twitter':
      return 'Twitter'
    case 'linkedin':
      return 'LinkedIn'
    case 'email':
      return 'Email'
    case 'whatsapp':
      return 'WhatsApp'
    case 'link':
      return 'Direct Link'
    default:
      return channel
  }
}

export function ShareList({
  shares,
  isLoading,
  onCopyLink,
  currentPage,
  totalPages,
  onPageChange,
}: ShareListProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopyLink = (shareId: string) => {
    const referralUrl = `${window.location.origin}/campaigns?ref=${shareId}`
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(shareId)
      setTimeout(() => setCopied(null), 2000)
      if (onCopyLink) {
        onCopyLink(referralUrl)
      }
    })
  }

  if (isLoading) {
    return (
      <>
        {/* Desktop Loading */}
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Channel</th>
                <th>Date</th>
                <th>Status</th>
                <th>Reward</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <LoadingRow key={i}>
                  <td style={{ width: '30%' }} />
                  <td style={{ width: '15%' }} />
                  <td style={{ width: '15%' }} />
                  <td style={{ width: '12%' }} />
                  <td style={{ width: '12%' }} />
                  <td style={{ width: '16%' }} />
                </LoadingRow>
              ))}
            </tbody>
          </Table>
        </TableWrapper>

        {/* Mobile Loading */}
        <CardGridWrapper>
          {[...Array(5)].map((_, i) => (
            <ShareCard key={i}>
              <CardHeader>
                <div style={{
                  height: '1.5rem',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'loading 1.5s infinite',
                  borderRadius: '4px'
                }} />
              </CardHeader>
              <CardRow>
                <div style={{
                  height: '1rem',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'loading 1.5s infinite',
                  borderRadius: '4px',
                  width: '100%'
                }} />
              </CardRow>
            </ShareCard>
          ))}
        </CardGridWrapper>
      </>
    )
  }

  if (!shares || shares.length === 0) {
    return (
      <EmptyMessage>
        <EmptyIcon>🔗</EmptyIcon>
        <EmptyTitle>No shares yet</EmptyTitle>
        <EmptyText>Share campaigns to help creators reach more supporters and earn rewards.</EmptyText>
        <EmptyLink href="/campaigns">Browse Campaigns</EmptyLink>
      </EmptyMessage>
    )
  }

  return (
    <Container>
      {/* Desktop Table View */}
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Channel</th>
              <th>Date</th>
              <th>Status</th>
              <th>Reward</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shares.map(share => (
              <tr key={share.shareId}>
                <td>
                  <CampaignCell>
                    <CampaignLink href={`/campaigns/${share.campaignId}`}>
                      {share.campaignTitle}
                    </CampaignLink>
                  </CampaignCell>
                </td>
                <td>
                  <ChannelBadge channel={share.channel}>
                    {getChannelLabel(share.channel)}
                  </ChannelBadge>
                </td>
                <td>
                  <DateCell>
                    {new Date(share.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </DateCell>
                </td>
                <td>
                  <StatCell>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      backgroundColor: share.status === 'completed' ? '#dcfce7' : share.status === 'pending' ? '#fef3c7' : '#e0e7ff',
                      color: share.status === 'completed' ? '#15803d' : share.status === 'pending' ? '#92400e' : '#3730a3'
                    }}>
                      {share.status.charAt(0).toUpperCase() + share.status.slice(1)}
                    </span>
                  </StatCell>
                </td>
                <td>
                  <StatCell>
                    ${(share.reward_amount / 100).toFixed(2)}
                    {share.is_paid && <span style={{ fontSize: '0.85rem', color: '#27ae60', marginLeft: '0.5rem' }}>✓</span>}
                  </StatCell>
                </td>
                <td>
                  <ActionsCell>
                    <ActionButton
                      onClick={() => handleCopyLink(share.shareId)}
                      title="Copy referral link"
                    >
                      {copied === share.shareId ? '✓ Copied' : 'Copy Link'}
                    </ActionButton>
                  </ActionsCell>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      {/* Mobile Card View */}
      <CardGridWrapper>
        {shares.map(share => (
          <ShareCard key={share.shareId}>
            <CardHeader>
              <CampaignTitle href={`/campaigns/${share.campaignId}`}>
                {share.campaignTitle}
              </CampaignTitle>
            </CardHeader>

            <CardRow>
              <CardLabel>Channel</CardLabel>
              <CardValue>
                <ChannelBadge channel={share.channel}>
                  {getChannelLabel(share.channel)}
                </ChannelBadge>
              </CardValue>
            </CardRow>

            <CardRow>
              <CardLabel>Date</CardLabel>
              <CardValue>
                {new Date(share.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </CardValue>
            </CardRow>

            <CardRow>
              <CardLabel>Status</CardLabel>
              <CardValue>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  backgroundColor: share.status === 'completed' ? '#dcfce7' : share.status === 'pending' ? '#fef3c7' : '#e0e7ff',
                  color: share.status === 'completed' ? '#15803d' : share.status === 'pending' ? '#92400e' : '#3730a3'
                }}>
                  {share.status.charAt(0).toUpperCase() + share.status.slice(1)}
                </span>
              </CardValue>
            </CardRow>

            <CardRow>
              <CardLabel>Reward</CardLabel>
              <CardValue>
                ${(share.reward_amount / 100).toFixed(2)}
                {share.is_paid && <span style={{ fontSize: '0.85rem', color: '#27ae60', marginLeft: '0.5rem' }}>✓</span>}
              </CardValue>
            </CardRow>

            <CardActions>
              <ActionButton
                onClick={() => handleCopyLink(share.shareId)}
                title="Copy referral link"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {copied === share.shareId ? '✓ Copied' : 'Copy Link'}
              </ActionButton>
            </CardActions>
          </ShareCard>
        ))}
      </CardGridWrapper>

      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </PaginationButton>

          <PaginationInfo>
            Page {currentPage} of {totalPages}
          </PaginationInfo>

          <PaginationButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </PaginationButton>
        </PaginationContainer>
      )}
    </Container>
  )
}
