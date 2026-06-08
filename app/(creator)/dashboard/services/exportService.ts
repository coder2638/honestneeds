/**
 * Export Service
 * Handles CSV and PDF export of campaign data
 */

// Campaign type
interface Campaign {
  id: string;
  title: string;
  description: string;
  createdAt: string | Date;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  campaignType?: string;
  donorCount?: number;
  healthScore?: number;
  engagementScore?: number;
  conversionRate?: number;
  performanceTrend?: string;
  lastActivityAt?: string;
}

export interface ExportOptions {
  format: 'csv' | 'pdf';
  includeAnalytics?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
  metrics?: string[];
}

export interface ExportedCampaignData {
  id: string;
  title: string;
  type?: string;
  status: string;
  createdAt: string | Date;
  goalAmount: number;
  raisedAmount: number;
  progressPercentage: number;
  donorCount: number;
  daysActive: number;
  description: string;
  analytics?: {
    engagementScore: number;
    conversionRate: number;
    healthScore: number;
    lastActivityAt?: string;
    performanceTrend?: string;
  };
}

export interface ExportProgress {
  percentage: number;
  message: string;
}

/**
 * Generate CSV content from campaigns
 */
export function generateCSVContent(
  campaigns: Campaign[],
  includeAnalytics: boolean = false
): string {
  // Headers
  const baseHeaders = [
    'Campaign ID',
    'Title',
    'Type',
    'Status',
    'Created Date',
    'Goal Amount',
    'Raised Amount',
    'Progress %',
    'Donor Count',
    'Duration (days)',
  ];

  const analyticsHeaders = includeAnalytics
    ? [
        'Engagement Score',
        'Conversion Rate',
        'Health Score',
        'Last Activity',
        'Performance Trend',
      ]
    : [];

  const headers = [...baseHeaders, ...analyticsHeaders];
  const csvRows = [headers.map((h) => `"${h}"`).join(',')];

  // Data rows
  campaigns.forEach((campaign) => {
    const daysActive = Math.floor(
      (Date.now() - new Date(campaign.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    const progress =
      campaign.goalAmount > 0
        ? Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)
        : 0;

    const baseValues = [
      campaign.id,
      campaign.title,
      campaign.campaignType || 'fundraising',
      campaign.status,
      new Date(campaign.createdAt).toLocaleDateString(),
      (campaign.goalAmount / 100).toFixed(2),
      (campaign.raisedAmount / 100).toFixed(2),
      progress,
      campaign.donorCount || 0,
      daysActive,
    ];

    const analyticsValues = includeAnalytics
      ? [
          (campaign.engagementScore || 0).toFixed(1),
          ((campaign.conversionRate || 0) * 100).toFixed(2) + '%',
          (campaign.healthScore || 0),
          campaign.lastActivityAt
            ? new Date(campaign.lastActivityAt).toLocaleDateString()
            : 'N/A',
          campaign.performanceTrend || 'stable',
        ]
      : [];

    const values = [...baseValues, ...analyticsValues];
    csvRows.push(values.map((v) => `"${v}"`).join(','));
  });

  return csvRows.join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string = 'campaigns.csv'): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Download JSON file (for backup/data portability)
 */
export function downloadJSON(
  data: Record<string, unknown>,
  filename: string = 'campaigns-backup.json'
): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Format currency for display
 */
export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Get campaign summary statistics
 */
export function getCampaignSummary(campaigns: Campaign[]) {
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raisedAmount, 0);
  const totalGoal = campaigns.reduce((sum, c) => sum + c.goalAmount, 0);
  const totalDonors = campaigns.reduce((sum, c) => sum + (c.donorCount || 0), 0);

  const activeCount = campaigns.filter((c) => c.status === 'active').length;
  const completedCount = campaigns.filter((c) => c.status === 'completed').length;
  const draftCount = campaigns.filter((c) => c.status === 'draft').length;

  const avgProgressPercentage =
    campaigns.length > 0
      ? Math.round(
          campaigns.reduce((sum, c) => {
            const progress = c.goalAmount > 0 ? (c.raisedAmount / c.goalAmount) * 100 : 0;
            return sum + progress;
          }, 0) / campaigns.length
        )
      : 0;

  const avgHealth =
    campaigns.length > 0
      ? Math.round(
          campaigns.reduce((sum, c) => sum + (c.healthScore || 0), 0) / campaigns.length
        )
      : 0;

  return {
    totalRaised,
    totalGoal,
    totalDonors,
    activeCount,
    completedCount,
    draftCount,
    avgProgressPercentage,
    avgHealth,
    totalCampaigns: campaigns.length,
  };
}

/**
 * Validate export data before generating file
 */
export function validateExportData(campaigns: Campaign[]): {
  isValid: boolean;
  error?: string;
} {
  if (!campaigns || campaigns.length === 0) {
    return { isValid: false, error: 'No campaigns selected for export' };
  }

  if (campaigns.length > 10000) {
    return { isValid: false, error: 'Too many campaigns selected (max 10,000)' };
  }

  return { isValid: true };
}

/**
 * Get export filename with timestamp
 */
export function getExportFilename(
  format: 'csv' | 'json' | 'pdf',
  prefix: string = 'campaigns'
): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}-${timestamp}.${format}`;
}

/**
 * Prepare campaigns data for various export formats
 */
export function prepareCampaignsForExport(
  campaigns: Campaign[],
  options: ExportOptions
): ExportedCampaignData[] {
  return campaigns.map((campaign) => {
    const daysActive = Math.floor(
      (Date.now() - new Date(campaign.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    const progress =
      campaign.goalAmount > 0
        ? Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)
        : 0;

    const data: ExportedCampaignData = {
      id: campaign.id,
      title: campaign.title,
      type: campaign.campaignType || 'fundraising',
      status: campaign.status,
      createdAt: campaign.createdAt,
      goalAmount: campaign.goalAmount / 100,
      raisedAmount: campaign.raisedAmount / 100,
      progressPercentage: progress,
      donorCount: campaign.donorCount || 0,
      daysActive,
      description: campaign.description,
    };

    if (options.includeAnalytics) {
      data.analytics = {
        engagementScore: campaign.engagementScore || 0,
        conversionRate: campaign.conversionRate || 0,
        healthScore: campaign.healthScore || 0,
        lastActivityAt: campaign.lastActivityAt,
        performanceTrend: campaign.performanceTrend || 'stable',
      };
    }

    return data;
  });
}

/**
 * Export service public API
 */
export const exportService = {
  generateCSVContent,
  downloadCSV,
  downloadJSON,
  formatCurrency,
  getCampaignSummary,
  validateExportData,
  getExportFilename,
  prepareCampaignsForExport,
};
