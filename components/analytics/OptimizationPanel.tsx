'use client'

import React from 'react'
import styled from 'styled-components'
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'

interface Recommendation {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  priority: 'critical' | 'major' | 'minor'
  action?: string
  expectedImprovement?: number
  category: 'reward' | 'budget' | 'timing' | 'platform' | 'audience'
}

interface OptimizationPanelProps {
  recommendations: Recommendation[]
  title?: string
  loading?: boolean
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

const RecommendationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const RecommendationCard = styled.div<{ priority: 'critical' | 'major' | 'minor' }>`
  border-left: 4px solid ${(props) => {
    switch (props.priority) {
      case 'critical': return '#dc2626'
      case 'major': return '#f59e0b'
      default: return '#10b981'
    }
  }};
  background: ${(props) => {
    switch (props.priority) {
      case 'critical': return '#fef2f2'
      case 'major': return '#fffbeb'
      default: return '#f0fdf4'
    }
  }};
  border: 1px solid #e5e7eb;
  border-left: 4px solid ${(props) => {
    switch (props.priority) {
      case 'critical': return '#dc2626'
      case 'major': return '#f59e0b'
      default: return '#10b981'
    }
  }};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  gap: 12px;
`

const RecommendationIcon = styled.div<{ priority: 'critical' | 'major' | 'minor' }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => {
    switch (props.priority) {
      case 'critical': return '#fee2e2'
      case 'major': return '#fef3c7'
      default: return '#dcfce7'
    }
  }};
  color: ${(props) => {
    switch (props.priority) {
      case 'critical': return '#dc2626'
      case 'major': return '#f59e0b'
      default: return '#16a34a'
    }
  }};
`

const RecommendationContent = styled.div`
  flex: 1;
`

const RecommendationTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
`

const RecommendationDescription = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 8px 0;
`

const RecommendationMeta = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`

const MetaBadge = styled.span<{ type: 'impact' | 'category' }>`
  font-size: 11px;
  font-weight: 600;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const ImprovementText = styled.span`
  font-size: 12px;
  color: #16a34a;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`

const ActionButton = styled.button`
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #6b7280;
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  padding: 32px;
`

/**
 * OptimizationPanel Component
 * Displays AI-generated recommendations for campaign optimization
 * 
 * @example
 * <OptimizationPanel
 *   recommendations={optimizationRecommendations}
 *   title="Campaign Optimization Recommendations"
 * />
 */
export const OptimizationPanel: React.FC<OptimizationPanelProps> = ({
  recommendations,
  title = 'Optimization Recommendations',
  loading = false,
}) => {
  if (loading) {
    return (
      <Container>
        <Title>
          <Lightbulb size={20} />
          {title}
        </Title>
        <LoadingMessage>Loading recommendations...</LoadingMessage>
      </Container>
    )
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Container>
        <Title>
          <Lightbulb size={20} />
          {title}
        </Title>
        <EmptyState>
          <CheckCircle2 size={40} style={{ margin: '0 auto 12px', color: '#10b981' }} />
          <p>No optimization recommendations at this time. Your campaign is performing well!</p>
        </EmptyState>
      </Container>
    )
  }

  // Sort by priority
  const priorityOrder = { critical: 0, major: 1, minor: 2 }
  const sortedRecommendations = [...recommendations].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  const getIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle size={20} />
      case 'major':
        return <TrendingUp size={20} />
      case 'minor':
        return <Lightbulb size={20} />
      default:
        return <Lightbulb size={20} />
    }
  }

  return (
    <Container>
      <Title>
        <Lightbulb size={20} />
        {title}
      </Title>
      <Subtitle>
        {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''} to improve campaign performance
      </Subtitle>

      <RecommendationsList>
        {sortedRecommendations.map((rec) => (
          <RecommendationCard key={rec.id} priority={rec.priority}>
            <RecommendationIcon priority={rec.priority}>
              {getIcon(rec.priority)}
            </RecommendationIcon>

            <RecommendationContent>
              <RecommendationTitle>{rec.title}</RecommendationTitle>
              <RecommendationDescription>{rec.description}</RecommendationDescription>

              <RecommendationMeta>
                <MetaBadge type="impact">Impact: {rec.impact}</MetaBadge>
                <MetaBadge type="category">{rec.category}</MetaBadge>
                {rec.expectedImprovement && (
                  <ImprovementText>
                    <TrendingUp size={14} />
                    +{rec.expectedImprovement}% improvement
                  </ImprovementText>
                )}
              </RecommendationMeta>
            </RecommendationContent>

            {rec.action && <ActionButton>{rec.action}</ActionButton>}
          </RecommendationCard>
        ))}
      </RecommendationsList>
    </Container>
  )
}

export default OptimizationPanel
