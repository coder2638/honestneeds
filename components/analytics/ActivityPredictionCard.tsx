'use client'

import React from 'react'
import styled from 'styled-components'
import { User, Activity, TrendingUp, AlertCircle } from 'lucide-react'

interface ActivityPrediction {
  userId: string
  userName?: string
  activityScore: number
  prediction: 'high' | 'medium' | 'low'
  lastActivityDays: number
  engagementTrend: 'increasing' | 'stable' | 'decreasing'
  estimatedValue?: number
  riskLevel: 'low' | 'medium' | 'high'
  nextPredictedActivityDate?: string
}

interface ActivityPredictionCardProps {
  predictions: ActivityPrediction[]
  title?: string
  loading?: boolean
  onUserClick?: (userId: string) => void
  currencySymbol?: string
}

const Container = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

const Subtitle = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 20px;
  margin-top: 0;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`

const PredictionCard = styled.div<{ activityScore: number }>`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid ${(props) => {
    if (props.activityScore >= 75) return '#16a34a'
    if (props.activityScore >= 50) return '#f59e0b'
    return '#dc2626'
  }};

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
`

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`

const UserAvatar = styled.div<{ score: number }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => {
    if (props.score >= 75) return '#dcfce7'
    if (props.score >= 50) return '#fef3c7'
    return '#fee2e2'
  }};
  color: ${(props) => {
    if (props.score >= 75) return '#16a34a'
    if (props.score >= 50) return '#f59e0b'
    return '#dc2626'
  }};
`

const UserInfo = styled.div`
  flex: 1;
`

const UserName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

const UserId = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
`

const ScoreBar = styled.div`
  margin: 12px 0;
`

const ScoreLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
`

const ScoreLabelText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #374151;
`

const ScoreValue = styled.span<{ score: number }>`
  font-size: 12px;
  font-weight: 700;
  color: ${(props) => {
    if (props.score >= 75) return '#16a34a'
    if (props.score >= 50) return '#f59e0b'
    return '#dc2626'
  }};
`

const ScoreBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`

const ScoreBarFill = styled.div<{ score: number }>`
  height: 100%;
  width: ${(props) => props.score}%;
  background: ${(props) => {
    if (props.score >= 75) return '#16a34a'
    if (props.score >= 50) return '#f59e0b'
    return '#dc2626'
  }};
  transition: width 0.3s ease;
`

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 12px 0;
`

const MetricItem = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px;
  text-align: center;
`

const MetricLabel = styled.p`
  font-size: 11px;
  color: #6b7280;
  margin: 0 0 4px 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const MetricValue = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

const StatusBadge = styled.div<{ trend: 'increasing' | 'stable' | 'decreasing' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${(props) => {
    switch (props.trend) {
      case 'increasing': return '#dcfce7'
      case 'stable': return '#dbeafe'
      case 'decreasing': return '#fee2e2'
    }
  }};
  color: ${(props) => {
    switch (props.trend) {
      case 'increasing': return '#16a34a'
      case 'stable': return '#0369a1'
      case 'decreasing': return '#dc2626'
    }
  }};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  width: fit-content;
`

const RiskIndicator = styled.div<{ level: 'low' | 'medium' | 'high' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 6px;
  background: ${(props) => {
    switch (props.level) {
      case 'low': return '#dcfce7'
      case 'medium': return '#fef3c7'
      case 'high': return '#fee2e2'
    }
  }};
  color: ${(props) => {
    switch (props.level) {
      case 'low': return '#15803d'
      case 'medium': return '#92400e'
      case 'high': return '#991b1b'
    }
  }};
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 12px;
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  padding: 32px;
`

/**
 * ActivityPredictionCard Component
 * Displays predicted user activity patterns and engagement scores
 * 
 * @example
 * <ActivityPredictionCard
 *   predictions={userPredictions}
 *   title="User Activity Predictions"
 *   onUserClick={(userId) => navigateToUser(userId)}
 *   currencySymbol="$"
 * />
 */
export const ActivityPredictionCard: React.FC<ActivityPredictionCardProps> = ({
  predictions,
  title = 'User Activity Predictions',
  loading = false,
  onUserClick,
  currencySymbol = '$',
}) => {
  if (loading || !predictions || predictions.length === 0) {
    return (
      <Container>
        <Title>
          <Activity size={20} />
          {title}
        </Title>
        <LoadingMessage>
          {loading ? 'Loading predictions...' : 'No activity predictions available'}
        </LoadingMessage>
      </Container>
    )
  }

  const getPredictionLabel = (prediction: string) => {
    switch (prediction) {
      case 'high':
        return 'High Activity'
      case 'medium':
        return 'Medium Activity'
      case 'low':
        return 'Low Activity'
      default:
        return prediction
    }
  }

  const getTrendArrow = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return '↑'
      case 'decreasing':
        return '↓'
      case 'stable':
        return '→'
      default:
        return '→'
    }
  }

  return (
    <Container>
      <Title>
        <Activity size={20} />
        {title}
      </Title>
      <Subtitle>{predictions.length} user predictions calculated from behavioral patterns</Subtitle>

      <GridContainer>
        {predictions.map((pred) => (
          <PredictionCard
            key={pred.userId}
            activityScore={pred.activityScore}
            onClick={() => onUserClick?.(pred.userId)}
          >
            <UserHeader>
              <UserAvatar score={pred.activityScore}>
                <User size={20} />
              </UserAvatar>
              <UserInfo>
                <UserName>{pred.userName || `User ${pred.userId.slice(-4)}`}</UserName>
                <UserId>{pred.userId}</UserId>
              </UserInfo>
            </UserHeader>

            <StatusBadge trend={pred.engagementTrend}>
              {getTrendArrow(pred.engagementTrend)} {pred.engagementTrend}
            </StatusBadge>

            {pred.riskLevel !== 'low' && (
              <RiskIndicator level={pred.riskLevel}>
                <AlertCircle size={12} />
                {pred.riskLevel} churn risk
              </RiskIndicator>
            )}

            <ScoreBar>
              <ScoreLabel>
                <ScoreLabelText>Activity Score</ScoreLabelText>
                <ScoreValue score={pred.activityScore}>{pred.activityScore}%</ScoreValue>
              </ScoreLabel>
              <ScoreBarContainer>
                <ScoreBarFill score={pred.activityScore} />
              </ScoreBarContainer>
            </ScoreBar>

            <MetricsRow>
              <MetricItem>
                <MetricLabel>Prediction</MetricLabel>
                <MetricValue>{getPredictionLabel(pred.prediction)}</MetricValue>
              </MetricItem>
              <MetricItem>
                <MetricLabel>Days Inactive</MetricLabel>
                <MetricValue>{pred.lastActivityDays}</MetricValue>
              </MetricItem>
            </MetricsRow>

            {pred.estimatedValue && (
              <MetricItem>
                <MetricLabel>Estimated Value</MetricLabel>
                <MetricValue>
                  {currencySymbol}
                  {pred.estimatedValue.toFixed(0)}
                </MetricValue>
              </MetricItem>
            )}

            {pred.nextPredictedActivityDate && (
              <MetricItem>
                <MetricLabel>Expected Activity</MetricLabel>
                <MetricValue style={{ fontSize: '12px' }}>{pred.nextPredictedActivityDate}</MetricValue>
              </MetricItem>
            )}
          </PredictionCard>
        ))}
      </GridContainer>
    </Container>
  )
}

export default ActivityPredictionCard
