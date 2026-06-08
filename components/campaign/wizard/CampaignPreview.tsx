/**
 * CampaignPreview.tsx
 * Displays a realistic preview of how the campaign will appear to donors/supporters
 * Used in Step 4 of the CampaignWizard to show creators the final appearance before publishing
 */

import React from 'react'
import styled from 'styled-components'

interface CampaignData {
  title?: string
  description?: string
  campaignType?: 'fundraising' | 'sharing'
  goalAmount?: number
  rewardPerShare?: number
  budget?: number
  campaignDuration?: number
  category?: string
  tags?: string[]
  platforms?: string[]
}

interface CampaignPreviewProps {
  data: CampaignData
  imagePreview?: string | null
}

const PreviewContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    border-radius: 6px;
  }
`

const PreviewHeader = styled.div`
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 11px;
    letter-spacing: 0.5px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 10px;
    letter-spacing: 0px;
  }
`

const HeroImage = styled.div<{ imageSrc?: string | null }>`
  width: 100%;
  height: 280px;
  background: ${props => props.imageSrc ? `url(${props.imageSrc})` : '#e0e0e0'};
  background-size: cover;
  background-position: center;
  position: relative;

  @media (max-width: 768px) {
    height: 200px;
  }

  @media (max-width: 480px) {
    height: 160px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
  }
`

const BadgeOverlay = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: white;
  color: #667eea;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 10;

  @media (max-width: 768px) {
    top: 8px;
    right: 8px;
    padding: 4px 10px;
    font-size: 10px;
  }

  @media (max-width: 480px) {
    top: 6px;
    right: 6px;
    padding: 4px 8px;
    font-size: 9px;
  }
`

const ContentSection = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 20px;
    margin: 0 0 8px 0;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    margin: 0 0 6px 0;
  }
`

const Description = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 20px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 13px;
    margin: 0 0 16px 0;
    -webkit-line-clamp: 2;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin: 0 0 12px 0;
  }
`

const MetricsSection = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    margin-bottom: 12px;
  }
`

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 6px;
  flex-wrap: wrap;
  gap: 8px;

  .raised {
    font-weight: 600;
    color: #1f2937;
  }

  .goal {
    color: #9ca3af;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 4px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    margin-bottom: 4px;
  }
`

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;

  .fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  @media (max-width: 480px) {
    height: 6px;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-top: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`

const StatItem = styled.div`
  text-align: center;

  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #667eea;
    line-height: 1;
  }

  .stat-label {
    font-size: 11px;
    color: #9ca3af;
    margin-top: 4px;
    text-transform: uppercase;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .stat-value {
      font-size: 16px;
    }

    .stat-label {
      font-size: 10px;
      margin-top: 2px;
    }
  }

  @media (max-width: 480px) {
    .stat-value {
      font-size: 14px;
    }

    .stat-label {
      font-size: 9px;
      margin-top: 2px;
    }
  }
`

const ActionSection = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;

  @media (max-width: 768px) {
    gap: 10px;
    margin-top: 16px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }
`

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
    }
  ` : `
    background: #e5e7eb;
    color: #374151;
    
    &:hover {
      background: #d1d5db;
    }
  `}

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 10px 14px;
    min-height: 40px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 12px 14px;
    min-height: 44px;
  }
`

const TypeBadge = styled.div<{ $campaignType?: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 8px;

  ${props => {
    if (props.$campaignType === 'fundraising') {
      return `background: #dbeafe; color: #0369a1;`
    } else if (props.$campaignType === 'sharing') {
      return `background: #dcfce7; color: #166534;`
    }
    return `background: #f3e8ff; color: #6b21a8;`
  }}

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 3px 6px;
  }
`

const CategoryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;

  @media (max-width: 768px) {
    gap: 6px;
    margin-top: 10px;
  }

  @media (max-width: 480px) {
    gap: 4px;
    margin-top: 8px;
  }
`

const Tag = styled.span`
  display: inline-block;
  background: #f3f4f6;
  color: #6b7280;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 10px;
  }
`

const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 16px 0;

  @media (max-width: 768px) {
    margin: 12px 0;
  }

  @media (max-width: 480px) {
    margin: 8px 0;
  }
`

const PlatformBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;

  .platform {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #f3f4f6;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    gap: 6px;
    margin-top: 10px;

    .platform {
      font-size: 11px;
      padding: 3px 10px;
    }
  }

  @media (max-width: 480px) {
    gap: 4px;
    margin-top: 8px;

    .platform {
      font-size: 10px;
      padding: 3px 8px;
    }
  }
`

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    gap: 10px;
    padding-top: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    padding-top: 8px;
  }
`

const CreatorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
  font-size: 16px;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
`

const CreatorDetails = styled.div`
  .creator-name {
    font-size: 13px;
    font-weight: 600;
    color: #1f2937;
  }

  .creator-role {
    font-size: 12px;
    color: #9ca3af;
  }

  @media (max-width: 768px) {
    .creator-name {
      font-size: 12px;
    }

    .creator-role {
      font-size: 11px;
    }
  }

  @media (max-width: 480px) {
    .creator-name {
      font-size: 11px;
    }

    .creator-role {
      font-size: 10px;
    }
  }
`

/**
 * CampaignPreview Component
 */
const CampaignPreview: React.FC<CampaignPreviewProps> = ({ data, imagePreview }) => {
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Determine progress for fundraising campaigns
  const isFundraising = data?.campaignType === 'fundraising'
  const isSharing = data?.campaignType === 'sharing'
  
  const goalAmount = isFundraising ? (data?.goalAmount || 0) : 0
  const progressPercentage = isFundraising && goalAmount > 0 ? Math.min(100, 0) : 0 // 0 at creation

  return (
    <PreviewContainer>
      <PreviewHeader>Preview as it appears to supporters</PreviewHeader>

      {/* Hero Image */}
      <HeroImage imageSrc={imagePreview}>
        <BadgeOverlay>Preview</BadgeOverlay>
      </HeroImage>

      {/* Content Section */}
      <ContentSection>
        {/* Type Badge */}
        <TypeBadge $campaignType={data?.campaignType}>
          {isFundraising ? '🎯 Fundraising' : '📢 Share Campaign'}
        </TypeBadge>

        {/* Title */}
        <Title>{data?.title || 'Campaign Title'}</Title>

        {/* Description */}
        <Description>
          {data?.description || 'Your campaign description will appear here...'}
        </Description>

        {/* Type-Specific Content */}
        {isFundraising && (
          <>
            {/* Progress Section for Fundraising */}
            <MetricsSection>
              <ProgressLabel>
                <span className="raised">Raised: ${formatCurrency(0)}</span>
                <span className="goal">of ${formatCurrency(data?.goalAmount || 0)} goal</span>
              </ProgressLabel>
              <ProgressBar>
                <div className="fill" style={{ width: `${progressPercentage}%` }} />
              </ProgressBar>

              {/* Stats */}
              <StatsGrid>
                <StatItem>
                  <div className="stat-value">0</div>
                  <div className="stat-label">Supporters</div>
                </StatItem>
                <StatItem>
                  <div className="stat-value">0%</div>
                  <div className="stat-label">Funded</div>
                </StatItem>
                <StatItem>
                  <div className="stat-value">{data?.campaignDuration || 30}</div>
                  <div className="stat-label">Days Left</div>
                </StatItem>
              </StatsGrid>
            </MetricsSection>

            {/* Category */}
            {data?.category && (
              <>
                <SectionDivider />
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>
                  Category
                </div>
                <Tag>{data.category}</Tag>
              </>
            )}

            {/* Tags */}
            {data?.tags && data.tags.length > 0 && (
              <>
                <SectionDivider />
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>
                  Tags
                </div>
                <CategoryTags>
                  {data.tags.slice(0, 4).map((tag: string, idx: number) => (
                    <Tag key={idx}>{tag}</Tag>
                  ))}
                  {data.tags.length > 4 && <Tag>+{data.tags.length - 4} more</Tag>}
                </CategoryTags>
              </>
            )}
          </>
        )}

        {isSharing && (
          <>
            {/* Sharing Campaign Specific Stats */}
            <MetricsSection>
              <StatsGrid>
                <StatItem>
                  <div className="stat-value">${formatCurrency(data?.rewardPerShare || 0)}</div>
                  <div className="stat-label">Per Share</div>
                </StatItem>
                <StatItem>
                  <div className="stat-value">0</div>
                  <div className="stat-label">Shares</div>
                </StatItem>
                <StatItem>
                  <div className="stat-value">${formatCurrency(data?.budget || 0)}</div>
                  <div className="stat-label">Budget</div>
                </StatItem>
              </StatsGrid>
            </MetricsSection>

            {/* Platforms */}
            {data?.platforms && data.platforms.length > 0 && (
              <>
                <SectionDivider />
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>
                  Share on
                </div>
                <PlatformBadges>
                  {data.platforms.map((platform: string, idx: number) => (
                    <div key={idx} className="platform">
                      {platform === 'twitter' && '𝕏'}
                      {platform === 'facebook' && '👍'}
                      {platform === 'instagram' && '📷'}
                      {platform === 'tiktok' && '🎵'}
                      {platform === 'linkedin' && '💼'}
                      {platform === 'telegram' && '📱'}
                      {platform === 'whatsapp' && '💬'}
                      {platform === 'email' && '✉️'}
                      <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                    </div>
                  ))}
                </PlatformBadges>
              </>
            )}
          </>
        )}

        {/* Action Section */}
        <SectionDivider />
        <ActionSection>
          <ActionButton variant="primary">
            {isFundraising ? '💰 Donate' : '📤 Share'}
          </ActionButton>
          <ActionButton variant="secondary">❤️ Save</ActionButton>
        </ActionSection>

        {/* Creator Info */}
        <CreatorInfo>
          <CreatorAvatar>C</CreatorAvatar>
          <CreatorDetails>
            <div className="creator-name">Campaign Creator</div>
            <div className="creator-role">
              {isFundraising ? 'Fundraiser' : 'Share Campaign Host'}
            </div>
          </CreatorDetails>
        </CreatorInfo>
      </ContentSection>
    </PreviewContainer>
  )
}

export default CampaignPreview
