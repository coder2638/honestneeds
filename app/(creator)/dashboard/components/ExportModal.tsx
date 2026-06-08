'use client';

import styled from 'styled-components';
import { X, Download, FileText, Sheet } from 'lucide-react';
import { useState } from 'react';
import { exportService } from '../services/exportService';
import { reportGenerator } from '../services/reportGenerator';

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
}

/**
 * Export Modal Component
 * Allows users to export campaign data in various formats
 */

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  selectedCampaignIds?: string[];
}

const Overlay = styled.div<{ isOpen?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transition: opacity 200ms;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  animation: slideUp 300ms ease-out;

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

  @media (max-width: 768px) {
    width: 95%;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`;

const Content = styled.div`
  padding: 24px;
  flex: 1;
`;

const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 16px 0;
`;

const ExportOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
`;

const ExportOption = styled.button<{ isSelected?: boolean }>`
  padding: 16px;
  border: 2px solid ${(props) => (props.isSelected ? '#3b82f6' : '#e5e7eb')};
  border-radius: 8px;
  background: ${(props) => (props.isSelected ? '#eff6ff' : 'white')};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 200ms;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  svg {
    color: #3b82f6;
    width: 24px;
    height: 24px;
  }

  span {
    font-size: 13px;
    font-weight: 600;
    color: ${(props) => (props.isSelected ? '#1e40af' : '#374151')};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #1f2937;

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #3b82f6;
  }

  &:hover {
    color: #3b82f6;
  }
`;

const DateRangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Footer = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${(props) =>
    props.$variant === 'primary'
      ? `
    background: #3b82f6;
    color: white;

    &:hover {
      background: #2563eb;
    }

    &:active {
      background: #1d4ed8;
    }
  `
      : `
    background: #e5e7eb;
    color: #1f2937;

    &:hover {
      background: #d1d5db;
    }

    &:active {
      background: #bfdbfe;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FileName = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #1f2937;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const InfoBox = styled.div`
  background: #f0fdf4;
  border-left: 4px solid #10b981;
  padding: 12px;
  border-radius: 4px;
  font-size: 13px;
  color: #065f46;
`;

export function ExportModal({
  isOpen,
  onClose,
  campaigns,
  selectedCampaignIds = [],
}: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [includeAnalytics, setIncludeAnalytics] = useState(false);
  const [fileName, setFileName] = useState(
    `campaigns-${new Date().toISOString().split('T')[0]}`
  );
  const [isExporting, setIsExporting] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filter campaigns based on selection and date range
  const campaignsToExport =
    selectedCampaignIds.length > 0
      ? campaigns.filter((c) => selectedCampaignIds.includes(c.id))
      : campaigns;

  const filteredCampaigns = campaignsToExport.filter((campaign) => {
    if (dateFrom && new Date(campaign.createdAt) < new Date(dateFrom)) return false;
    if (dateTo && new Date(campaign.createdAt) > new Date(dateTo)) return false;
    return true;
  });

  const validation = exportService.validateExportData(filteredCampaigns);

  const handleExport = async () => {
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setIsExporting(true);

    try {
      const fileNameWithExt = `${fileName}.${exportFormat}`;

      switch (exportFormat) {
        case 'csv':
          const csvContent = exportService.generateCSVContent(filteredCampaigns, includeAnalytics);
          exportService.downloadCSV(csvContent, fileNameWithExt);
          break;

        case 'json':
          const jsonData = exportService.prepareCampaignsForExport(filteredCampaigns, {
            format: 'csv',
            includeAnalytics,
          });
          exportService.downloadJSON(jsonData, fileNameWithExt);
          break;

        case 'pdf':
          const htmlReport = reportGenerator.generateHTMLReport({
            title: 'Campaign Export Report',
            campaigns: filteredCampaigns,
            includeCharts: true,
            includeRecommendations: true,
            includeSummary: true,
            creatorName: 'Campaign Creator',
          });
          reportGenerator.openReportForPrinting(htmlReport);
          break;
      }

      onClose();
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export campaigns. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <Download size={20} />
            Export Campaigns
          </Title>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </CloseButton>
        </Header>

        <Content>
          {/* Export Format */}
          <Section>
            <SectionTitle>Export Format</SectionTitle>
            <ExportOptionsGrid>
              <ExportOption
                isSelected={exportFormat === 'csv'}
                onClick={() => setExportFormat('csv')}
              >
                <Sheet size={24} />
                <span>CSV</span>
              </ExportOption>

              <ExportOption
                isSelected={exportFormat === 'json'}
                onClick={() => setExportFormat('json')}
              >
                <FileText size={24} />
                <span>JSON</span>
              </ExportOption>

              <ExportOption
                isSelected={exportFormat === 'pdf'}
                onClick={() => setExportFormat('pdf')}
              >
                <FileText size={24} />
                <span>PDF Report</span>
              </ExportOption>
            </ExportOptionsGrid>
          </Section>

          {/* File Name */}
          <Section>
            <SectionTitle>File Name</SectionTitle>
            <FileName
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="campaigns"
            />
            <InfoBox style={{ marginTop: '8px' }}>
              File will be saved as: <strong>{fileName}.{exportFormat}</strong>
            </InfoBox>
          </Section>

          {/* Options */}
          <Section>
            <SectionTitle>Options</SectionTitle>
            <CheckboxGroup>
              <CheckboxItem>
                <input
                  type="checkbox"
                  checked={includeAnalytics}
                  onChange={(e) => setIncludeAnalytics(e.target.checked)}
                />
                <span>Include analytics data</span>
              </CheckboxItem>
            </CheckboxGroup>
          </Section>

          {/* Date Range Filter */}
          <Section>
            <SectionTitle>Date Range (Optional)</SectionTitle>
            <DateRangeContainer>
              <DateInput
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From"
              />
              <DateInput
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To"
              />
            </DateRangeContainer>
          </Section>

          {/* Export Summary */}
          <Section>
            <SectionTitle>Export Summary</SectionTitle>
            <InfoBox>
              <strong>{filteredCampaigns.length}</strong> campaign{filteredCampaigns.length !== 1 ? 's' : ''}{' '}
              will be exported with{' '}
              <strong>
                {includeAnalytics
                  ? 'analytics data'
                  : 'basic information'}
              </strong>
            </InfoBox>
          </Section>
        </Content>

        <Footer>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            $variant="primary"
            onClick={handleExport}
            disabled={isExporting || !validation.isValid}
          >
            <Download size={16} />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
}
