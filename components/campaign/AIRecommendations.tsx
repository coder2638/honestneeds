/**
 * AI Recommendations Component
 * 
 * Displays AI-generated insights, predictions, and actionable recommendations
 * powered by the backend PredictiveAnalyticsService
 */

import React from 'react';
import styled from 'styled-components';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const RecommendationsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin: 2rem 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const PredictionCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -50%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;
`;

const PredictionTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .icon {
    font-size: 1.75rem;
  }
`;

const SuccessProbability = styled.div`
  margin-bottom: 2rem;
`;

const ProbabilityLabel = styled.p`
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  opacity: 0.9;
`;

const ProbabilityBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

interface ProbabilityFillProps {
  $percentage: number;
}

const ProbabilityFill = styled.div<ProbabilityFillProps>`
  width: ${(p) => p.$percentage}%;
  height: 100%;
  background: linear-gradient(90deg, #10b981, #06b6d4);
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const ProbabilityValue = styled.p`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
`;

const BudgetInfo = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-left: 4px solid rgba(255, 255, 255, 0.5);
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1.5rem;
`;

const BudgetLabel = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  opacity: 0.9;
`;

const BudgetValue = styled.p`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
`;

const RecommendationsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RecommendationsTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .icon {
    font-size: 1.5rem;
  }
`;

const RecommendationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

interface RecommendationItemProps {
  type: 'success' | 'warning' | 'critical' | 'info';
}

const RecommendationItem = styled.div<RecommendationItemProps>`
  background: white;
  border-left: 4px solid
    ${(p) => {
      switch (p.type) {
        case 'success':
          return '#10b981';
        case 'warning':
          return '#f59e0b';
        case 'critical':
          return '#ef4444';
        default:
          return '#3b82f6';
      }
    }};
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const RecommendationContent = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`;

const RecommendationIcon = styled.div<{ type: 'success' | 'warning' | 'critical' | 'info' }>`
  font-size: 1.25rem;
  flex-shrink: 0;
  color: ${(p) => {
    switch (p.type) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  }};
`;

const RecommendationText = styled.div`
  flex: 1;
`;

const RecommendationLabel = styled.p`
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => {
    switch ((p as any).type) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  }};
`;

const RecommendationDescription = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: #4b5563;
  line-height: 1.5;
`;

const ActionButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 2rem;

  .icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    margin: 0;
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;

  color: #9ca3af;
`;

const Spinner = styled.div`
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// ============================================================================
// TYPES
// ============================================================================

export interface AIRecommendationsProps {
  successProbability?: number;
  recommendations?: string[];
  budgetDepletionDays?: number | null;
  estimatedFinalValue?: number;
  isLoading?: boolean;
  onAction?: (actionType: string) => void;
}

// ============================================================================
// RECOMMENDATION PARSERS
// ============================================================================

interface ParsedRecommendation {
  text: string;
  type: 'success' | 'warning' | 'critical' | 'info';
  icon: string;
  actionable?: boolean;
}

function parseRecommendation(text: string): ParsedRecommendation {
  // Determine type and icon based on content
  if (text.includes('✅') || text.includes('on track') || text.includes('performing well')) {
    return {
      text: text.replace('✅', '').trim(),
      type: 'success',
      icon: '✅',
    };
  }

  if (text.includes('❌') || text.includes('critical') || text.includes('needs attention')) {
    return {
      text: text.replace('❌', '').trim(),
      type: 'critical',
      icon: '⚠️',
    };
  }

  if (text.includes('⚠️') || text.includes('consider') || text.includes('boost')) {
    return {
      text: text.replace('⚠️', '').trim(),
      type: 'warning',
      icon: '💡',
      actionable: true,
    };
  }

  if (text.includes('📊') || text.includes('📢') || text.includes('budget')) {
    return {
      text: text.replace('📊', '').replace('📢', '').trim(),
      type: 'info',
      icon: 'ℹ️',
      actionable: true,
    };
  }

  return {
    text: text.trim(),
    type: 'info',
    icon: 'ℹ️',
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  successProbability = 0,
  recommendations = [],
  budgetDepletionDays,
  estimatedFinalValue = 0,
  isLoading = false,
  onAction,
}) => {
  if (isLoading) {
    return (
      <RecommendationsContainer>
        <PredictionCard>
          <CardContent>
            <LoadingState>
              <Spinner />
              <span>Analyzing performance...</span>
            </LoadingState>
          </CardContent>
        </PredictionCard>
      </RecommendationsContainer>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <RecommendationsContainer>
        <PredictionCard>
          <CardContent>
            <EmptyState>
              <div className="icon">🤖</div>
              <p>No insights available yet. Check back as your campaign gets more data.</p>
            </EmptyState>
          </CardContent>
        </PredictionCard>
      </RecommendationsContainer>
    );
  }

  const parsedRecommendations = recommendations.map(parseRecommendation);
  const hasBudgetWarning = budgetDepletionDays && budgetDepletionDays < 30;

  return (
    <RecommendationsContainer>
      {/* Prediction Card */}
      <PredictionCard>
        <CardContent>
          <PredictionTitle>
            <span className="icon">🤖</span>
            AI Insights
          </PredictionTitle>

          <SuccessProbability>
            <ProbabilityLabel>Success Probability</ProbabilityLabel>
            <ProbabilityBar>
              <ProbabilityFill $percentage={successProbability * 100} />
            </ProbabilityBar>
            <ProbabilityValue>{(successProbability * 100).toFixed(0)}%</ProbabilityValue>
          </SuccessProbability>

          {hasBudgetWarning && budgetDepletionDays && (
            <BudgetInfo>
              <BudgetLabel>Budget Depletion Timeline</BudgetLabel>
              <BudgetValue>{budgetDepletionDays} days remaining</BudgetValue>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', opacity: 0.9 }}>
                At current spending rate
              </p>
            </BudgetInfo>
          )}

          {estimatedFinalValue > 0 && (
            <BudgetInfo>
              <BudgetLabel>Estimated Final Value</BudgetLabel>
              <BudgetValue>${(estimatedFinalValue / 100).toFixed(2)}</BudgetValue>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', opacity: 0.9 }}>
                Based on current trajectory
              </p>
            </BudgetInfo>
          )}
        </CardContent>
      </PredictionCard>

      {/* Recommendations List */}
      <RecommendationsSection>
        <RecommendationsTitle>
          <span className="icon">💡</span>
          Recommended Actions
        </RecommendationsTitle>

        <RecommendationsList>
          {parsedRecommendations.map((rec, index) => (
            <RecommendationItem key={index} type={rec.type}>
              <RecommendationContent>
                <RecommendationIcon type={rec.type}>{rec.icon}</RecommendationIcon>
                <RecommendationText>
                  <RecommendationLabel type={rec.type}>
                    {rec.type === 'success' && 'Keep It Up'}
                    {rec.type === 'warning' && 'Opportunity'}
                    {rec.type === 'critical' && 'Action Required'}
                    {rec.type === 'info' && 'Insight'}
                  </RecommendationLabel>
                  <RecommendationDescription>{rec.text}</RecommendationDescription>
                  {rec.actionable && (
                    <ActionButton
                      onClick={() => onAction?.(rec.text)}
                      title="Take action on this recommendation"
                    >
                      Learn More →
                    </ActionButton>
                  )}
                </RecommendationText>
              </RecommendationContent>
            </RecommendationItem>
          ))}
        </RecommendationsList>

        {/* Tips Section */}
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#f3f4f6',
            borderRadius: '8px',
          }}
        >
          <h4 style={{ margin: '0 0 1rem 0', color: '#1f2937' }}>💬 Pro Tips</h4>
          <ul
            style={{
              margin: 0,
              paddingLeft: '1.5rem',
              color: '#6b7280',
            }}
          >
            <li style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>
              Monitor success probability daily and adjust strategy if it drops below 50%
            </li>
            <li style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>
              Early engagement is key - focus on the first 7 days of your campaign
            </li>
            <li style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>
              Share on multiple platforms to reach a wider audience
            </li>
            <li style={{ lineHeight: '1.5' }}>
              Consider boosting after you have 20+ shares or $1,000 raised
            </li>
          </ul>
        </div>
      </RecommendationsSection>
    </RecommendationsContainer>
  );
};

export default AIRecommendations;
