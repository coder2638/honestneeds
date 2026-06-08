'use client';

import styled from 'styled-components';
import { Lightbulb } from 'lucide-react';

// Campaign type
interface Campaign {
  id: string;
  title: string;
  description: string;
  createdAt: string | Date;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  donorCount?: number;
  healthScore?: number;
  engagementScore?: number;
  conversionRate?: number;
  performanceTrend?: string;
  lastActivityAt?: string;
  tags?: string[];
}

/**
 * Recommendations Panel Component
 * Shows AI-powered recommendations for campaign optimization
 */

interface Recommendation {
  id: string;
  type: 'opportunity' | 'warning' | 'insight' | 'success';
  title: string;
  description: string;
  campaignId?: string;
  campaignTitle?: string;
  priority: 'high' | 'medium' | 'low';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface RecommendationsPanelProps {
  campaigns: Campaign[];
  onActionClick?: (action: string, campaignId?: string) => void;
  isCompact?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;

  svg {
    color: #f59e0b;
  }
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const RecommendationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: 600px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;

    &:hover {
      background: #9ca3af;
    }
  }
`;

const RecommendationItem = styled.div<{ type: string; priority: string }>`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: ${(props) => {
    switch (props.type) {
      case 'opportunity':
        return '#eff6ff';
      case 'warning':
        return '#fef3c7';
      case 'success':
        return '#f0fdf4';
      case 'insight':
        return '#faf5ff';
      default:
        return 'white';
    }
  }};
  border-left: 4px solid
    ${(props) => {
      switch (props.type) {
        case 'opportunity':
          return '#3b82f6';
        case 'warning':
          return '#f59e0b';
        case 'success':
          return '#10b981';
        case 'insight':
          return '#a855f7';
        default:
          return '#6b7280';
      }
    }};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${(props) => {
      switch (props.type) {
        case 'opportunity':
          return '#dbeafe';
        case 'warning':
          return '#fde68a';
        case 'success':
          return '#dcfce7';
        case 'insight':
          return '#f3e8ff';
        default:
          return '#f9fafb';
      }
    }};
  }
`;

const RecommendationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const IconContainer = styled.div<{ type: string }>`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  background: ${(props) => {
    switch (props.type) {
      case 'opportunity':
        return '#3b82f6';
      case 'warning':
        return '#f59e0b';
      case 'success':
        return '#10b981';
      case 'insight':
        return '#a855f7';
      default:
        return '#6b7280';
    }
  }};
`;

const ContentContainer = styled.div`
  flex: 1;
`;

const PriorityBadge = styled.div<{ priority: string }>`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 3px;
  background: ${(props) => {
    switch (props.priority) {
      case 'high':
        return '#fee2e2';
      case 'medium':
        return '#fef3c7';
      case 'low':
        return '#dbeafe';
      default:
        return '#e5e7eb';
    }
  }};
  color: ${(props) => {
    switch (props.priority) {
      case 'high':
        return '#991b1b';
      case 'medium':
        return '#92400e';
      case 'low':
        return '#0c2d6b';
      default:
        return '#374151';
    }
  }};
`;

const RecommendationTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
`;

const RecommendationTitleText = styled.span`
  font-weight: 600;
  font-size: 13px;
  color: #1f2937;
`;

const RecommendationDescription = styled.p`
  font-size: 13px;
  color: #4b5563;
  margin: 4px 0 0;
  line-height: 1.4;
`;

const CampaignReference = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 8px;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
`;

const ActionButton = styled.button`
  margin-top: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 200ms;
  background: rgba(59, 130, 246, 0.1);
  color: #1e40af;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
  }

  &:active {
    background: rgba(59, 130, 246, 0.3);
  }
`;

const EmptyState = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: #6b7280;
`;

const EmptyStateIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`;

const EmptyStateText = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0;
`;

/**
 * Generate recommendations based on campaign data
 */
function generateRecommendations(campaigns: Campaign[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  campaigns.forEach((campaign) => {
    // Check for underperforming active campaigns
    if (campaign.status === 'active' && campaign.goalAmount > 0) {
      const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;

      if (progress < 25) {
        recommendations.push({
          id: `underperf-${campaign.id}`,
          type: 'warning',
          title: 'Low Performance Alert',
          description: `"${campaign.title}" is underperforming with only ${Math.round(progress)}% of goal reached. Consider amplifying your marketing efforts.`,
          campaignId: campaign.id,
          campaignTitle: campaign.title,
          priority: 'high',
          action: {
            label: 'View Campaign',
            onClick: () => {},
          },
        });
      }

      // Check for campaigns nearing completion
      if (progress >= 85 && progress < 100) {
        recommendations.push({
          id: `almost-done-${campaign.id}`,
          type: 'success',
          title: 'Goal Almost Reached!',
          description: `Great news! "${campaign.title}" is ${Math.round(progress)}% to goal. Keep the momentum!`,
          campaignId: campaign.id,
          campaignTitle: campaign.title,
          priority: 'medium',
        });
      }

      // Check for campaigns that have reached goal
      if (progress >= 100) {
        recommendations.push({
          id: `goal-reached-${campaign.id}`,
          type: 'success',
          title: 'Goal Reached!',
          description: `Congratulations! "${campaign.title}" has reached its fundraising goal. Consider completing the campaign.`,
          campaignId: campaign.id,
          campaignTitle: campaign.title,
          priority: 'medium',
          action: {
            label: 'Complete Campaign',
            onClick: () => {},
          },
        });
      }
    }

    // Check for stale draft campaigns
    if (campaign.status === 'draft') {
      const daysOld = Math.floor(
        (Date.now() - new Date(campaign.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysOld > 14) {
        recommendations.push({
          id: `stale-draft-${campaign.id}`,
          type: 'insight',
          title: 'Forgotten Draft?',
          description: `"${campaign.title}" has been a draft for ${daysOld} days. Activate it to start raising funds.`,
          campaignId: campaign.id,
          campaignTitle: campaign.title,
          priority: 'low',
          action: {
            label: 'Activate Now',
            onClick: () => {},
          },
        });
      }
    }

    // Check for paused campaigns
    if (campaign.status === 'paused' && campaign.goalAmount > 0) {
      const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;

      if (progress < 50) {
        recommendations.push({
          id: `paused-underperform-${campaign.id}`,
          type: 'opportunity',
          title: 'Resume Underperforming Campaign',
          description: `"${campaign.title}" is paused at ${Math.round(progress)}% of goal. Consider resuming to reach your target.`,
          campaignId: campaign.id,
          campaignTitle: campaign.title,
          priority: 'medium',
          action: {
            label: 'Resume Campaign',
            onClick: () => {},
          },
        });
      }
    }
  });

  // General insights
  if (campaigns.length === 0) {
    recommendations.push({
      id: 'no-campaigns',
      type: 'insight',
      title: 'Create Your First Campaign',
      description: 'Get started by creating your first fundraising campaign to help people in need.',
      priority: 'high',
    });
  }

  if (campaigns.filter((c) => c.status === 'active').length === 0) {
    recommendations.push({
      id: 'no-active',
      type: 'opportunity',
      title: 'No Active Campaigns',
      description:
        'You have no active campaigns. Consider activating a draft or creating a new campaign.',
      priority: 'medium',
    });
  }

  // Check for high performers
  const highPerformers = campaigns.filter(
    (c) => c.goalAmount > 0 && (c.raisedAmount / c.goalAmount) * 100 >= 100
  ).length;

  if (highPerformers > 0) {
    recommendations.push({
      id: 'high-achievers',
      type: 'success',
      title: 'You Are A Superhero! 🦸',
      description: `You have ${highPerformers} campaign${highPerformers !== 1 ? 's' : ''} that have exceeded their goals. Amazing work!`,
      priority: 'low',
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] -
      priorityOrder[b.priority as keyof typeof priorityOrder]
      ? -1
      : 1;
  });
}

/**
 * Get icon for recommendation type
 */
function getRecommendationIcon(type: string): React.ReactNode {
  switch (type) {
    case 'opportunity':
      return '💡';
    case 'warning':
      return '⚠️';
    case 'success':
      return '🎉';
    case 'insight':
      return '✨';
    default:
      return '•';
  }
}

export function RecommendationsPanel({
  campaigns,
}: RecommendationsPanelProps) {
  const recommendations = generateRecommendations(campaigns);

  return (
    <Container>
      <Header>
        <Lightbulb size={18} />
        <Title>Smart Recommendations</Title>
      </Header>

      <RecommendationsList>
        {recommendations.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>✨</EmptyStateIcon>
            <EmptyStateText>All set! No recommendations at this time.</EmptyStateText>
          </EmptyState>
        ) : (
          recommendations.map((rec) => (
            <RecommendationItem key={rec.id} type={rec.type} priority={rec.priority}>
              <RecommendationHeader>
                <IconContainer type={rec.type}>{getRecommendationIcon(rec.type)}</IconContainer>

                <ContentContainer>
                  <RecommendationTitle>
                    <RecommendationTitleText>{rec.title}</RecommendationTitleText>
                    <PriorityBadge priority={rec.priority}>{rec.priority}</PriorityBadge>
                  </RecommendationTitle>

                  <RecommendationDescription>{rec.description}</RecommendationDescription>

                  {rec.campaignTitle && (
                    <CampaignReference>Campaign: {rec.campaignTitle}</CampaignReference>
                  )}

                  {rec.action && (
                    <ActionButton onClick={rec.action.onClick}>{rec.action.label}</ActionButton>
                  )}
                </ContentContainer>
              </RecommendationHeader>
            </RecommendationItem>
          ))
        )}
      </RecommendationsList>
    </Container>
  );
}
