/**
 * Analytics Export Modal
 * 
 * Allows users to export campaign analytics in multiple formats
 * (CSV, JSON, PDF)
 */

import React, { useState } from 'react';
import styled from 'styled-components';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${(p) => (p.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  padding: 2rem;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #1f2937;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #1f2937;
  transition: all 0.2s ease;

  &:hover {
    border-color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const DateRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FormatButton = styled.button<{ $selected: boolean }>`
  padding: 1rem;
  border: 2px solid ${(p) => (p.$selected ? '#3b82f6' : '#d1d5db')};
  background: ${(p) => (p.$selected ? '#eff6ff' : 'white')};
  color: ${(p) => (p.$selected ? '#3b82f6' : '#1f2937')};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  .icon {
    font-size: 1.5rem;
  }

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #3b82f6;
  }
`;

const MetricsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #4b5563;

  input[type='checkbox'] {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: #1f2937;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SecondaryButton = styled(PrimaryButton)`
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;

  &:hover {
    background: #eff6ff;
    transform: translateY(-2px);
  }
`;

const InfoBox = styled.div`
  background: #f0fdf4;
  border-left: 4px solid #10b981;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #166534;

  .icon {
    margin-right: 0.5rem;
  }

  strong {
    display: block;
    margin-bottom: 0.25rem;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 16px;
  height: 16px;
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

export interface AnalyticsExportModalProps {
  isOpen: boolean;
  campaignId: string;
  campaignName?: string;
  onClose: () => void;
  onExport: (
    format: 'csv' | 'json' | 'pdf',
    startDate?: string,
    endDate?: string,
    metrics?: string[]
  ) => Promise<void>;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const AnalyticsExportModal: React.FC<AnalyticsExportModalProps> = ({
  isOpen,
  campaignId,
  campaignName = 'Campaign',
  onClose,
  onExport,
}) => {
  const [format, setFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [period, setPeriod] = useState<'all' | 'custom'>('all');

  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(formatDate(thirtyDaysAgo));
  const [endDate, setEndDate] = useState(formatDate(today));

  const [selectedMetrics, setSelectedMetrics] = useState<Record<string, boolean>>({
    donations: true,
    shares: true,
    engagement: true,
    trends: true,
    conversions: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const metrics = Object.keys(selectedMetrics).filter((m) => selectedMetrics[m]);
      const start = period === 'custom' ? startDate : undefined;
      const end = period === 'custom' ? endDate : undefined;

      await onExport(format, start, end, metrics);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export analytics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Export Analytics</h2>
          <CloseButton onClick={onClose} title="Close modal">
            ✕
          </CloseButton>
        </ModalHeader>

        <InfoBox>
          <strong>📋 {campaignName}</strong>
          Export detailed analytics data for reporting and analysis
        </InfoBox>

        {/* Format Selection */}
        <FormSection>
          <Label>Export Format</Label>
          <FormatGrid>
            <FormatButton
              $selected={format === 'csv'}
              onClick={() => setFormat('csv')}
              title="Export as CSV (spreadsheet format)"
            >
              <span className="icon">📊</span>
              CSV
            </FormatButton>
            <FormatButton
              $selected={format === 'json'}
              onClick={() => setFormat('json')}
              title="Export as JSON (structured data)"
            >
              <span className="icon">{ }</span>
              JSON
            </FormatButton>
            <FormatButton
              $selected={format === 'pdf'}
              onClick={() => setFormat('pdf')}
              title="Export as PDF (formatted report)"
            >
              <span className="icon">📄</span>
              PDF
            </FormatButton>
          </FormatGrid>
        </FormSection>

        {/* Period Selection */}
        <FormSection>
          <Label>Time Period</Label>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'all' | 'custom')}
          >
            <option value="all">All Time</option>
            <option value="custom">Custom Range</option>
          </Select>
        </FormSection>

        {/* Date Range */}
        {period === 'custom' && (
          <FormSection>
            <Label>Date Range</Label>
            <DateRow>
              <div>
                <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                  From
                </Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate}
                />
              </div>
              <div>
                <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                  To
                </Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
              </div>
            </DateRow>
          </FormSection>
        )}

        {/* Metrics Selection */}
        <FormSection>
          <Label>Include Metrics</Label>
          <MetricsGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={selectedMetrics.donations}
                onChange={() => handleMetricToggle('donations')}
              />
              Donation Data
            </CheckboxLabel>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={selectedMetrics.shares}
                onChange={() => handleMetricToggle('shares')}
              />
              Share Metrics
            </CheckboxLabel>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={selectedMetrics.engagement}
                onChange={() => handleMetricToggle('engagement')}
              />
              Engagement Stats
            </CheckboxLabel>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={selectedMetrics.trends}
                onChange={() => handleMetricToggle('trends')}
              />
              Trend Analysis
            </CheckboxLabel>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={selectedMetrics.conversions}
                onChange={() => handleMetricToggle('conversions')}
              />
              Conversion Metrics
            </CheckboxLabel>
          </MetricsGroup>
        </FormSection>

        {/* Buttons */}
        <ButtonGroup>
          <SecondaryButton onClick={onClose} disabled={isLoading}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={handleExport} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner /> Exporting...
              </>
            ) : (
              <>
                <span>⬇️</span>
                Export Analytics
              </>
            )}
          </PrimaryButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AnalyticsExportModal;
