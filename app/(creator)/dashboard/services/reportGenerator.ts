/**
 * Report Generator Service
 * Generates formatted PDF reports with analytics and insights
 */

import { exportService } from './exportService';

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

export interface ReportConfig {
  title: string;
  campaigns: Campaign[];
  includeCharts?: boolean;
  includeRecommendations?: boolean;
  includeSummary?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  metrics?: string[];
  creatorName?: string;
  creatorEmail?: string;
}

export interface ReportSection {
  title: string;
  content: string;
  type: 'text' | 'table' | 'chart' | 'summary';
}

/**
 * Generate HTML report that can be printed to PDF
 */
export function generateHTMLReport(config: ReportConfig): string {
  const summary = exportService.getCampaignSummary(config.campaigns);
  const reportDate = new Date().toLocaleDateString();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${config.title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: #ffffff;
          padding: 40px;
        }

        .page-break {
          page-break-after: always;
          margin: 40px 0;
        }

        header {
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 40px;
        }

        .header-title {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .header-meta {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #6b7280;
        }

        section {
          margin-bottom: 40px;
        }

        section h2 {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e5e7eb;
        }

        section h3 {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin-top: 20px;
          margin-bottom: 12px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }

        .summary-card {
          border: 1px solid #e5e7eb;
          padding: 16px;
          border-radius: 8px;
          background: #f9fafb;
        }

        .summary-card-title {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .summary-card-value {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
        }

        .summary-card-meta {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 4px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }

        thead {
          background: #f3f4f6;
        }

        th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }

        td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
        }

        tr:hover {
          background: #f9fafb;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-draft {
          background: #f3f4f6;
          color: #374151;
        }

        .status-paused {
          background: #fef3c7;
          color: #92400e;
        }

        .status-completed {
          background: #dbeafe;
          color: #0c2d6b;
        }

        .progress-bar {
          display: block;
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 4px;
        }

        .progress-fill {
          height: 100%;
          background: #3b82f6;
          border-radius: 4px;
        }

        .insights {
          background: #f0fdf4;
          border-left: 4px solid #10b981;
          padding: 16px;
          margin-top: 16px;
          border-radius: 4px;
        }

        .insights strong {
          color: #065f46;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 16px;
        }

        .metric-item {
          border: 1px solid #e5e7eb;
          padding: 12px;
          border-radius: 6px;
        }

        .metric-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .metric-value {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
        }

        footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #9ca3af;
          text-align: center;
        }

        @media print {
          body {
            padding: 0;
            background: white;
          }
          .page-break {
            page-break-after: always;
          }
        }

        .recommendation-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          margin-bottom: 12px;
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
          border-radius: 4px;
        }

        .recommendation-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        .recommendation-text {
          flex: 1;
          font-size: 13px;
        }

        .recommendation-text strong {
          color: #1e40af;
        }
      </style>
    </head>
    <body>
      <header>
        <div class="header-title">${config.title}</div>
        <div class="header-meta">
          <div>Generated on ${reportDate}</div>
          ${config.creatorName ? `<div>${config.creatorName}</div>` : ''}
        </div>
      </header>

      ${generateExecutiveSummarySection(summary, config)}
      ${generateCampaignTableSection(config.campaigns)}
      ${generateMetricsSection(config.campaigns)}
      ${generateInsightsSection(config.campaigns)}
      ${generateRecommendationsSection(config.campaigns)}

      <footer>
        <p>This report was generated by HonestNeed Campaign Dashboard</p>
        <p>For more information, visit <strong>honestneed.com</strong></p>
      </footer>
    </body>
    </html>
  `;

  return htmlContent;
}

/**
 * Generate executive summary section
 */
function generateExecutiveSummarySection(summary: { totalRaised: number; totalGoal: number; totalDonors: number; totalCampaigns: number; activeCount: number; draftCount: number; completedCount: number; avgProgressPercentage: number; avgHealth: number }): string {
  return `
    <section>
      <h2>Executive Summary</h2>
      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-card-title">Total Raised</div>
          <div class="summary-card-value">$${(summary.totalRaised / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 0,
  })}</div>
          <div class="summary-card-meta">Across ${summary.totalCampaigns} campaigns</div>
        </div>

        <div class="summary-card">
          <div class="summary-card-title">Active Campaigns</div>
          <div class="summary-card-value">${summary.activeCount}</div>
          <div class="summary-card-meta">${summary.draftCount} drafts, ${summary.completedCount} completed</div>
        </div>

        <div class="summary-card">
          <div class="summary-card-title">Total Donors</div>
          <div class="summary-card-value">${summary.totalDonors.toLocaleString()}</div>
          <div class="summary-card-meta">Avg ${summary.totalCampaigns > 0 ? Math.round(summary.totalDonors / summary.totalCampaigns) : 0} per campaign</div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-card-title">Goal vs. Raised</div>
          <div class="summary-card-value">${Math.round((summary.totalRaised / summary.totalGoal) * 100)}%</div>
          <div class="summary-card-meta">$${(summary.totalGoal / 100).toLocaleString('en-US', {
    minimumFractionDigits: 0,
  })} total goal</div>
        </div>

        <div class="summary-card">
          <div class="summary-card-title">Avg Progress</div>
          <div class="summary-card-value">${summary.avgProgressPercentage}%</div>
          <div class="summary-card-meta">Across all campaigns</div>
        </div>

        <div class="summary-card">
          <div class="summary-card-title">Health Score</div>
          <div class="summary-card-value">${summary.avgHealth}/100</div>
          <div class="summary-card-meta">Overall campaign health</div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Generate campaign table section
 */
function generateCampaignTableSection(campaigns: Campaign[]): string {
  const rows = campaigns
    .map((campaign) => {
      const progress =
        campaign.goalAmount > 0
          ? Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)
          : 0;

      return `
        <tr>
          <td>${campaign.title}</td>
          <td><span class="status-badge status-${campaign.status.toLowerCase()}">${campaign.status}</span></td>
          <td>$${(campaign.raisedAmount / 100).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 0,
      })}</td>
          <td>$${(campaign.goalAmount / 100).toLocaleString('en-US', {
        minimumFractionDigits: 0,
      })}</td>
          <td>
            ${progress}%
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
          </td>
          <td>${campaign.donorCount || 0}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <section>
      <h2>Campaign Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Status</th>
            <th>Raised</th>
            <th>Goal</th>
            <th>Progress</th>
            <th>Donors</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </section>
  `;
}

/**
 * Generate metrics section
 */
function generateMetricsSection(campaigns: Campaign[]): string {
  const avgDonation =
    campaigns.reduce((sum, c) => sum + c.raisedAmount, 0) /
    Math.max(campaigns.reduce((sum, c) => sum + (c.donorCount || 0), 0), 1);

  const activeDuration =
    campaigns
      .filter((c) => c.status === 'active')
      .reduce(
        (sum, c) => sum + (Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24),
        0
      ) / Math.max(campaigns.filter((c) => c.status === 'active').length, 1);

  return `
    <section>
      <h2>Performance Metrics</h2>
      <div class="metrics-grid">
        <div class="metric-item">
          <div class="metric-label">Average Donation</div>
          <div class="metric-value">$${(avgDonation / 100).toFixed(2)}</div>
        </div>

        <div class="metric-item">
          <div class="metric-label">Days Active (Average)</div>
          <div class="metric-value">${Math.round(activeDuration)}</div>
        </div>

        <div class="metric-item">
          <div class="metric-label">Completion Rate</div>
          <div class="metric-value">
            ${campaigns.length > 0 ? ((campaigns.filter((c) => c.status === 'completed').length / campaigns.length) * 100).toFixed(1) : 0}%
          </div>
        </div>

        <div class="metric-item">
          <div class="metric-label">Total Supporters</div>
          <div class="metric-value">${campaigns.reduce((sum, c) => sum + (c.donorCount || 0), 0).toLocaleString()}</div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Generate insights section
 */
function generateInsightsSection(campaigns: Campaign[]): string {
  const completed = campaigns.filter((c) => c.status === 'completed').length;
  const active = campaigns.filter((c) => c.status === 'active').length;
  const highPerforming = campaigns.filter(
    (c) => c.goalAmount > 0 && (c.raisedAmount / c.goalAmount) * 100 >= 80
  ).length;

  const insights = [];
  if (highPerforming > 0) {
    insights.push(
      `You have <strong>${highPerforming}</strong> high-performing campaign${highPerforming !== 1 ? 's' : ''} (80%+ of goal).`
    );
  }
  if (active > 0) {
    insights.push(
      `Currently, <strong>${active}</strong> campaign${active !== 1 ? 's are' : ' is'} active and collecting donations.`
    );
  }
  if (completed > 0) {
    insights.push(
      `You've successfully completed <strong>${completed}</strong> campaign${completed !== 1 ? 's' : ''}.`
    );
  }

  return `
    <section>
      <h2>Key Insights</h2>
      ${insights.map((insight) => `<div class="insights">${insight}</div>`).join('')}
    </section>
  `;
}

/**
 * Generate recommendations section
 */
function generateRecommendationsSection(campaigns: Campaign[]): string {
  const recommendations = [];

  // Check for underperforming campaigns
  campaigns.forEach((campaign) => {
    if (
      campaign.status === 'active' &&
      campaign.goalAmount > 0 &&
      (campaign.raisedAmount / campaign.goalAmount) * 100 < 30
    ) {
      recommendations.push(
        `💡 "<strong>${campaign.title}</strong>" is underperforming. Consider sharing it on social media or adjusting your marketing strategy.`
      );
    }
  });

  // Check for campaigns nearing completion
  campaigns.forEach((campaign) => {
    if (
      campaign.status === 'active' &&
      campaign.goalAmount > 0 &&
      (campaign.raisedAmount / campaign.goalAmount) * 100 >= 90
    ) {
      recommendations.push(
        `🎉 "<strong>${campaign.title}</strong>" is almost complete! Prepare for completion and consider your next campaign.`
      );
    }
  });

  // Check for draft campaigns
  const drafts = campaigns.filter((c) => c.status === 'draft').length;
  if (drafts > 0) {
    recommendations.push(
      `📝 You have <strong>${drafts}</strong> draft campaign${drafts !== 1 ? 's' : ''}. Don't forget to activate them to start collecting donations!`
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(`✨ All campaigns are performing well! Keep up the great work.`);
  }

  return `
    <section>
      <h2>Recommendations</h2>
      ${recommendations
        .map(
          (rec) =>
            `<div class="recommendation-item"><div class="recommendation-text">${rec}</div></div>`
        )
        .join('')}
    </section>
  `;
}

/**
 * Download report as HTML file (can be printed to PDF)
 */
export function downloadHTMLReport(html: string, filename: string = 'campaign-report.html'): void {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
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
 * Open report in new window for printing
 */
export function openReportForPrinting(html: string): Window | null {
  const reportWindow = window.open('', '_blank');
  if (reportWindow) {
    reportWindow.document.write(html);
    reportWindow.document.close();
  }
  return reportWindow;
}

/**
 * Report generator public API
 */
export const reportGenerator = {
  generateHTMLReport,
  downloadHTMLReport,
  openReportForPrinting,
};
