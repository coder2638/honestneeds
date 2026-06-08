'use client';

import styled from 'styled-components';
import { Clock, X, Save } from 'lucide-react';
import { useState } from 'react';

/**
 * Report Scheduler Component
 * Allows users to schedule automated email reports
 */

interface ScheduledReport {
  id: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  dayOfMonth?: number;
  time: string; // HH:mm format
  metrics: string[];
  recipients: string[];
  includeCharts?: boolean;
  isActive: boolean;
  createdAt?: Date;
}

interface ReportSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  reports?: ScheduledReport[];
  onSave?: (report: ScheduledReport) => Promise<void>;
  onDelete?: (reportId: string) => Promise<void>;
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
  max-width: 700px;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #1f2937;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #1f2937;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 150px;
  overflow-y: auto;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #1f2937;

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #3b82f6;
  }

  &:hover {
    color: #3b82f6;
  }
`;

const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  min-height: 36px;
  background: white;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #eff6ff;
  border-radius: 4px;
  font-size: 12px;
  color: #1e40af;

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1e40af;

    &:hover {
      background: #dbeafe;
      border-radius: 2px;
    }
  }
`;

const ReportsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 250px;
  overflow-y: auto;
`;

const ReportItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f9fafb;
`;

const ReportItemContent = styled.div`
  flex: 1;
`;

const ReportItemTitle = styled.div`
  font-weight: 600;
  font-size: 13px;
  color: #1f2937;
  margin-bottom: 4px;
`;

const ReportItemDetail = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const ReportItemActions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background: #e5e7eb;
    color: #1f2937;
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
`;

const InfoBox = styled.div`
  background: #f0fdf4;
  border-left: 4px solid #10b981;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #065f46;
  line-height: 1.5;
`;

export function ReportScheduler({
  isOpen,
  onClose,
  reports = [],
  onSave,
  onDelete,
}: ReportSchedulerProps) {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [dayOfWeek, setDayOfWeek] = useState('monday');
  const [dayOfMonth, setDayOfMonth] = useState('1');
  const [time, setTime] = useState('09:00');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'donors', 'progress']);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const metrics = [
    { id: 'revenue', label: 'Total Revenue' },
    { id: 'donors', label: 'Donor Count' },
    { id: 'progress', label: 'Progress Percentage' },
    { id: 'health', label: 'Health Score' },
    { id: 'engagement', label: 'Engagement Metrics' },
    { id: 'conversion', label: 'Conversion Rate' },
  ];

  const handleAddRecipient = () => {
    if (recipientInput && recipientInput.includes('@')) {
      setRecipients([...recipients, recipientInput]);
      setRecipientInput('');
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  const handleToggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId) ? prev.filter((m) => m !== metricId) : [...prev, metricId]
    );
  };

  const handleSaveReport = async () => {
    if (recipients.length === 0) {
      alert('Please add at least one recipient email');
      return;
    }

    if (selectedMetrics.length === 0) {
      alert('Please select at least one metric');
      return;
    }

    setIsSaving(true);

    try {
      const newReport: ScheduledReport = {
        id: Math.random().toString(36).substr(2, 9),
        frequency,
        dayOfWeek: frequency === 'weekly' ? (dayOfWeek as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday') : undefined,
        dayOfMonth: frequency === 'monthly' ? parseInt(dayOfMonth) : undefined,
        time,
        metrics: selectedMetrics,
        recipients,
        includeCharts,
        isActive: true,
        createdAt: new Date(),
      };

      if (onSave) {
        await onSave(newReport);
      }

      // Reset form
      setRecipients([]);
      setRecipientInput('');
      setSelectedMetrics(['revenue', 'donors', 'progress']);

      onClose();
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Failed to save report schedule. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (onDelete) {
      try {
        await onDelete(reportId);
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report. Please try again.');
      }
    }
  };

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <Clock size={20} />
            Schedule Reports
          </Title>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </CloseButton>
        </Header>

        <Content>
          {/* Scheduled Reports List */}
          {reports.length > 0 && (
            <Section>
              <SectionTitle>Active Schedules</SectionTitle>
              <ReportsList>
                {reports.map((report) => (
                  <ReportItem key={report.id}>
                    <ReportItemContent>
                      <ReportItemTitle>
                        {report.frequency.charAt(0).toUpperCase() + report.frequency.slice(1)} at{' '}
                        {report.time}
                      </ReportItemTitle>
                      <ReportItemDetail>
                        {report.recipients.join(', ')}
                      </ReportItemDetail>
                      <ReportItemDetail>
                        Metrics: {report.metrics.join(', ')}
                      </ReportItemDetail>
                    </ReportItemContent>
                    <ReportItemActions>
                      <IconButton
                        onClick={() => handleDeleteReport(report.id)}
                        title="Delete"
                      >
                        <X size={16} />
                      </IconButton>
                    </ReportItemActions>
                  </ReportItem>
                ))}
              </ReportsList>
            </Section>
          )}

          {/* Create New Schedule */}
          <Section>
            <SectionTitle>Create New Schedule</SectionTitle>

            <FormGrid>
              <FormGroup>
                <Label>Frequency</Label>
                <Select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Select>
              </FormGroup>

              {frequency === 'weekly' && (
                <FormGroup>
                  <Label>Day of Week</Label>
                  <Select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </Select>
                </FormGroup>
              )}

              {frequency === 'monthly' && (
                <FormGroup>
                  <Label>Day of Month</Label>
                  <Select value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)}>
                    {Array.from({ length: 28 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              )}

              <FormGroup>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </FormGroup>
            </FormGrid>
          </Section>

          {/* Metrics Selection */}
          <Section>
            <SectionTitle>Include Metrics</SectionTitle>
            <CheckboxGroup>
              {metrics.map((metric) => (
                <CheckboxItem key={metric.id}>
                  <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric.id)}
                    onChange={() => handleToggleMetric(metric.id)}
                  />
                  <span>{metric.label}</span>
                </CheckboxItem>
              ))}
            </CheckboxGroup>

            <CheckboxItem style={{ marginTop: '12px' }}>
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
              />
              <span>Include charts and visualizations</span>
            </CheckboxItem>
          </Section>

          {/* Recipients */}
          <Section>
            <SectionTitle>Email Recipients</SectionTitle>
            <FormGroup>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddRecipient();
                    }
                  }}
                />
                <Button onClick={handleAddRecipient}>Add</Button>
              </div>
            </FormGroup>

            {recipients.length > 0 && (
              <TagInput>
                {recipients.map((email) => (
                  <Tag key={email}>
                    {email}
                    <button onClick={() => handleRemoveRecipient(email)}>
                      <X size={12} />
                    </button>
                  </Tag>
                ))}
              </TagInput>
            )}

            <InfoBox style={{ marginTop: '12px' }}>
              ✓ Reports will be sent to all listed recipients on the specified schedule
            </InfoBox>
          </Section>
        </Content>

        <Footer>
          <Button onClick={onClose}>Cancel</Button>
          <Button $variant="primary" onClick={handleSaveReport} disabled={isSaving}>
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Schedule'}
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
}
