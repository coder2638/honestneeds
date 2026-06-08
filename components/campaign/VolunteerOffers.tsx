'use client'

import { useState, useCallback } from 'react'
import styled from 'styled-components'
import {
  useCampaignVolunteerOffers,
  useAcceptVolunteerOffer,
  useDeclineVolunteerOffer,
  useCompleteVolunteerOffer,
} from '@/api/hooks/useVolunteer'
import Button from '@/components/ui/Button'
import { CheckCircle, XCircle, Clock, AlertCircle, Briefcase, Calendar, Zap } from 'lucide-react'
import type { VolunteerOffer } from '@/api/services/volunteerService'

interface VolunteerOffersProps {
  campaignId: string
  /** If true, show all statuses. If false, show pending only. */
  expandedView?: boolean
}

const Container = styled.div`
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    flex: 1;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.5rem;
    background-color: #4f46e5;
    color: white;
    border-radius: 9999px;
    font-weight: 600;
    font-size: 0.875rem;
  }
`

const Content = styled.div`
  padding: 1.5rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;

  svg {
    display: block;
    margin: 0 auto 1rem;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
  }
`

const TabsContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e5e7eb;
  overflow-x: auto;
`

const Tab = styled.button<{ $active?: boolean }>`
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: ${(props) => (props.$active ? '#4f46e5' : '#6b7280')};
  font-weight: ${(props) => (props.$active ? '600' : '500')};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  white-space: nowrap;

  &:hover {
    color: #4f46e5;
  }

  ${(props) =>
    props.$active &&
    `
    border-bottom-color: #4f46e5;
    color: #4f46e5;
  `}
`

const OffersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const OfferCard = styled.div<{ status?: string }>`
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  ${(props) => {
    if (props.status === 'accepted') {
      return `
        border-left: 4px solid #10b981;
        background-color: #f0fdf4;
      `
    }
    if (props.status === 'declined') {
      return `
        border-left: 4px solid #ef4444;
        background-color: #fef2f2;
      `
    }
    if (props.status === 'completed') {
      return `
        border-left: 4px solid #8b5cf6;
        background-color: #faf5ff;
      `
    }
    return `
      border-left: 4px solid #f59e0b;
      background-color: #fffbf0;
    `
  }}
`

const OfferHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const OfferTitle = styled.div`
  flex: 1;
  min-width: 0;

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    word-break: break-word;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
  }
`

const StatusBadge = styled.div<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;

  ${(props) => {
    switch (props.status) {
      case 'pending':
        return `
          background-color: #fef3c7;
          color: #92400e;
        `
      case 'accepted':
        return `
          background-color: #dcfce7;
          color: #166534;
        `
      case 'declined':
        return `
          background-color: #fee2e2;
          color: #991b1b;
        `
      case 'completed':
        return `
          background-color: #f3e8ff;
          color: #6b21a8;
        `
      default:
        return ''
    }
  }}
`

const OfferBody = styled.div`
  padding: 1.25rem;

  p {
    margin: 0 0 0.75rem 0;
    color: #374151;
    line-height: 1.6;
    font-size: 0.95rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem 0;
  border-top: 1px solid #d1d5db;
  border-bottom: 1px solid #d1d5db;
`

const InfoItem = styled.div`
  display: flex;
  gap: 0.75rem;

  svg {
    flex-shrink: 0;
    color: #4f46e5;
    opacity: 0.7;
  }

  div {
    flex: 1;
    font-size: 0.875rem;

    .label {
      color: #6b7280;
      font-weight: 500;
    }

    .value {
      color: #1f2937;
      font-weight: 600;
      margin-top: 0.125rem;
    }
  }
`

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.75rem 0;

  .skill-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.75rem;
    background-color: #e0e7ff;
    color: #3730a3;
    border-radius: 9999px;
    font-size: 0.8125rem;
    font-weight: 500;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`

const NotesField = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-family: inherit;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 70px;
  margin-top: 0.5rem;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`

const ContactInfo = styled.div`
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #374151;

  strong {
    color: #1f2937;
  }

  p {
    margin: 0.25rem 0;
  }
`

function OfferItem({ offer, isCreator }: { offer: VolunteerOffer; isCreator: boolean }) {
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState('')

  const { mutate: acceptOffer, isPending: isAccepting } = useAcceptVolunteerOffer()
  const { mutate: declineOffer, isPending: isDeclining } = useDeclineVolunteerOffer()
  const { mutate: completeOffer, isPending: isCompleting } = useCompleteVolunteerOffer()

  const handleAccept = useCallback(() => {
    acceptOffer({ offerId: offer.id, notes: notes || undefined })
    setNotes('')
    setShowNotes(false)
  }, [acceptOffer, offer.id, notes])

  const handleDecline = useCallback(() => {
    const reason = window.prompt('Why are you declining this offer? (optional)')
    if (reason !== null) {
      declineOffer({ offerId: offer.id, declineReason: reason || 'Not specified', notes })
      setNotes('')
      setShowNotes(false)
    }
  }, [declineOffer, offer.id, notes])

  const handleComplete = useCallback(() => {
    if (window.confirm('Mark this volunteer offer as completed?')) {
      completeOffer({ offerId: offer.id, notes: notes || undefined })
      setNotes('')
      setShowNotes(false)
    }
  }, [completeOffer, offer.id, notes])

  const isLoading = isAccepting || isDeclining || isCompleting

  return (
    <OfferCard status={offer.status}>
      <OfferHeader>
        <OfferTitle>
          <h4>{offer.title}</h4>
          <p>
            by <strong>{offer.volunteerName}</strong>
          </p>
        </OfferTitle>
        <StatusBadge status={offer.status}>
          {offer.status === 'pending' && <Clock size={14} />}
          {offer.status === 'accepted' && <CheckCircle size={14} />}
          {offer.status === 'declined' && <XCircle size={14} />}
          {offer.status === 'completed' && <Zap size={14} />}
          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
        </StatusBadge>
      </OfferHeader>

      <OfferBody>
        <p>{offer.description}</p>

        {offer.skillsOffered && offer.skillsOffered.length > 0 && (
          <>
            <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Skills Offered:</strong>
            <SkillsList>
              {offer.skillsOffered.map((skill, idx) => (
                <div key={`skill-${idx}`} className="skill-badge">
                  {skill.name}
                  {skill.yearsOfExperience ? ` (${skill.yearsOfExperience}yr)` : ''}
                </div>
              ))}
            </SkillsList>
          </>
        )}

        <InfoGrid>
          <InfoItem>
            <Calendar size={18} />
            <div>
              <div className="label">Availability</div>
              <div className="value">
                {new Date(offer.availability.startDate).toLocaleDateString()} to{' '}
                {new Date(offer.availability.endDate).toLocaleDateString()}
              </div>
            </div>
          </InfoItem>

          <InfoItem>
            <Clock size={18} />
            <div>
              <div className="label">Hours/Week</div>
              <div className="value">{offer.availability.hoursPerWeek}h</div>
            </div>
          </InfoItem>

          <InfoItem>
            <Briefcase size={18} />
            <div>
              <div className="label">Contact Details</div>
              <div className="value" style={{ fontSize: '0.85rem' }}>
                <div>{offer.contactEmail || (offer.contact_details as any)?.email || 'Email not provided'}</div>
                <div>{offer.contactPhone || (offer.contact_details as any)?.phone || 'Phone not provided'}</div>
              </div>
            </div>
          </InfoItem>
        </InfoGrid>

        {isCreator && offer.status === 'pending' && (
          <>
            {showNotes && (
              <>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Add notes (optional):
                </label>
                <NotesField
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share any additional thoughts or next steps..."
                  disabled={isLoading}
                />
              </>
            )}

            {!showNotes && (
              <div style={{ marginBottom: '0.75rem' }}>
                <Button
                  onClick={() => setShowNotes(true)}
                  variant="ghost"
                  size="sm"
                >
                  Add Notes
                </Button>
              </div>
            )}

            <ActionButtons>
              <Button
                onClick={handleAccept}
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="flex-1"
              >
                {isAccepting ? 'Accepting...' : 'Accept Offer'}
              </Button>

              <Button
                onClick={handleDecline}
                variant="outline"
                size="lg"
                disabled={isLoading}
                className="flex-1"
              >
                {isDeclining ? 'Declining...' : 'Decline'}
              </Button>
            </ActionButtons>

            <ContactInfo>
              <p>
                <strong>Contact Details:</strong>
              </p>
              <p>
                📧 <strong>Email:</strong> {offer.contactEmail || (offer.contact_details as any)?.email || 'Not provided'}
              </p>
              <p>
                📱 <strong>Phone:</strong> {offer.contactPhone || (offer.contact_details as any)?.phone || 'Not provided'}
              </p>
            </ContactInfo>
          </>
        )}

        {isCreator && offer.status === 'accepted' && (
          <>
            <ContactInfo>
              <p>
                <strong>Contact Details:</strong>
              </p>
              <p>
                📧 <strong>Email:</strong> {offer.contactEmail || (offer.contact_details as any)?.email || 'Not provided'}
              </p>
              <p>
                📱 <strong>Phone:</strong> {offer.contactPhone || (offer.contact_details as any)?.phone || 'Not provided'}
              </p>
            </ContactInfo>

            <ActionButtons>
              <Button
                onClick={handleComplete}
                variant="primary"
                size="sm"
                disabled={isLoading}
              >
                {isCompleting ? 'Completing...' : 'Mark Complete'}
              </Button>

              <Button
                onClick={() => setShowNotes(!showNotes)}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                {showNotes ? 'Cancel Notes' : 'Add Notes'}
              </Button>

              {showNotes && (
                <NotesField
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did this volunteer's work go?"
                />
              )}
            </ActionButtons>
          </>
        )}

        {offer.notes && (
          <ContactInfo>
            <p>
              <strong>Creator Notes:</strong>
            </p>
            <p>{offer.notes}</p>
          </ContactInfo>
        )}
      </OfferBody>
    </OfferCard>
  )
}

export function VolunteerOffers({
  campaignId,
  expandedView = false,
}: VolunteerOffersProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'declined' | 'completed'>('pending')

  type StatusFilter = 'pending' | 'accepted' | 'declined' | 'completed' | undefined
  const statusFilter: StatusFilter = expandedView ? undefined : 'pending'
  const { data: offers = [], isLoading, error } = useCampaignVolunteerOffers(campaignId, statusFilter)

  // Group offers by status
  const offersByStatus = {
    pending: offers.filter((o) => o.status === 'pending'),
    accepted: offers.filter((o) => o.status === 'accepted'),
    declined: offers.filter((o) => o.status === 'declined'),
    completed: offers.filter((o) => o.status === 'completed'),
  }

  const currentOffers = offersByStatus[activeTab]
  const totalOffers = offers.length
  const acceptedCount = offersByStatus.accepted.length

  if (isLoading) {
    return (
      <Container>
        <Header>
          <h3>Volunteer Offers</h3>
        </Header>
        <Content>
          <EmptyState>
            <p>Loading volunteer offers...</p>
          </EmptyState>
        </Content>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Header>
          <h3>Volunteer Offers</h3>
        </Header>
        <Content>
          <EmptyState>
            <AlertCircle size={48} />
            <p>Error loading volunteer offers</p>
          </EmptyState>
        </Content>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <h3>Volunteer Offers</h3>
        <div className="badge">{totalOffers}</div>
      </Header>

      <Content>
        {totalOffers === 0 ? (
          <EmptyState>
            <Briefcase size={48} />
            <p>
              No volunteer offers yet. When people offer to help, they'll appear here.
            </p>
          </EmptyState>
        ) : (
          <>
            {expandedView && (
              <TabsContainer>
                {['pending', 'accepted', 'declined', 'completed'].map((status) => (
                  <Tab
                    key={`tab-${status}`}
                    $active={activeTab === status}
                    onClick={() => setActiveTab(status as any)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}{' '}
                    ({offersByStatus[status as keyof typeof offersByStatus].length})
                  </Tab>
                ))}
              </TabsContainer>
            )}

            {currentOffers.length === 0 ? (
              <EmptyState>
                <p>
                  No {activeTab} offers.
                  {activeTab === 'pending' && ' Check back soon!'}
                </p>
              </EmptyState>
            ) : (
              <OffersList>
                {currentOffers.map((offer) => (
                  <OfferItem
                    key={offer.id}
                    offer={offer}
                    isCreator={true}
                  />
                ))}
              </OffersList>
            )}
          </>
        )}
      </Content>
    </Container>
  )
}
