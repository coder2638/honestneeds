/**
 * Advanced Search Hook
 * Supports advanced search syntax for campaign queries
 * Examples: "status:active goal:>1000", "type:fundraising raised:<5000"
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
  donorCount?: number;
  healthScore?: number;
  engagementScore?: number;
  conversionRate?: number;
  performanceTrend?: string;
  lastActivityAt?: string;
  tags?: string[];
  campaignType?: string;
}

export interface SearchTokens {
  status?: ('draft' | 'active' | 'paused' | 'completed')[];
  type?: ('fundraising' | 'sharing')[];
  goalRange?: { min?: number; max?: number };
  raisedRange?: { min?: number; max?: number };
  donorRange?: { min?: number; max?: number };
  dateRange?: { from?: Date; to?: Date };
  tags?: string[];
  text?: string;
}

export interface SearchResult {
  query: string;
  tokens: SearchTokens;
  isValid: boolean;
  error?: string;
}

/**
 * Parse advanced search query
 * Supports syntax like:
 * - status:active status:paused
 * - goal:>1000 goal:<5000
 * - raised:>=5000
 * - donors:>100
 * - type:fundraising
 * - created:>2026-01-01 created:<2026-04-11
 * - "text search" for multi-word terms
 */
export function parseAdvancedSearchQuery(query: string): SearchResult {
  const tokens: SearchTokens = {};
  const textTerms: string[] = [];
  let error: string | undefined;

  if (!query || query.trim() === '') {
    return { query, tokens, isValid: true };
  }

  try {
    // Split query while preserving quoted strings
    const parts = query.match(/"[^"]*"|[^\s]+/g) || [];

    parts.forEach((part) => {
      // Handle quoted text
      if (part.startsWith('"') && part.endsWith('"')) {
        textTerms.push(part.slice(1, -1));
        return;
      }

      // Parse token:value syntax
      if (part.includes(':')) {
        const [key, value] = part.split(':');

        switch (key.toLowerCase()) {
          case 'status':
            if (!tokens.status) tokens.status = [];
            if (
              ['draft', 'active', 'paused', 'completed'].includes(value.toLowerCase())
            ) {
              tokens.status.push(value.toLowerCase() as 'draft' | 'active' | 'paused' | 'completed');
            } else {
              error = `Invalid status: ${value}`;
            }
            break;

          case 'type':
            if (!tokens.type) tokens.type = [];
            if (['fundraising', 'sharing'].includes(value.toLowerCase())) {
              tokens.type.push(value.toLowerCase() as 'fundraising' | 'sharing');
            } else {
              error = `Invalid type: ${value}`;
            }
            break;

          case 'goal':
            tokens.goalRange = parseRangeToken(value);
            break;

          case 'raised':
            tokens.raisedRange = parseRangeToken(value);
            break;

          case 'donors':
            tokens.donorRange = parseRangeToken(value);
            break;

          case 'created':
            if (!tokens.dateRange) tokens.dateRange = {};
            if (value.startsWith('>')) {
              const date = new Date(value.slice(1));
              if (!isNaN(date.getTime())) {
                tokens.dateRange.from = date;
              } else {
                error = `Invalid date: ${value}`;
              }
            } else if (value.startsWith('<')) {
              const date = new Date(value.slice(1));
              if (!isNaN(date.getTime())) {
                tokens.dateRange.to = date;
              } else {
                error = `Invalid date: ${value}`;
              }
            }
            break;

          case 'tag':
            if (!tokens.tags) tokens.tags = [];
            tokens.tags.push(value);
            break;

          default:
            textTerms.push(part);
        }
      } else {
        // Regular text term
        textTerms.push(part);
      }
    });

    if (textTerms.length > 0) {
      tokens.text = textTerms.join(' ');
    }

    return {
      query,
      tokens,
      isValid: !error,
      error,
    };
  } catch (e) {
    return {
      query,
      tokens: {},
      isValid: false,
      error: `Failed to parse search query: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

/**
 * Parse range token (e.g., ">1000" or "<5000" or ">=1000")
 */
function parseRangeToken(value: string): { min?: number; max?: number } {
  const range: { min?: number; max?: number } = {};

  if (value.startsWith('>=')) {
    range.min = parseInt(value.slice(2));
  } else if (value.startsWith('>')) {
    range.min = parseInt(value.slice(1));
  } else if (value.startsWith('<=')) {
    range.max = parseInt(value.slice(2));
  } else if (value.startsWith('<')) {
    range.max = parseInt(value.slice(1));
  } else if (value.includes('-')) {
    const [min, max] = value.split('-');
    range.min = parseInt(min);
    range.max = parseInt(max);
  } else {
    range.min = parseInt(value);
    range.max = parseInt(value);
  }

  return range;
}

/**
 * Filter campaigns based on parsed search tokens
 */
export function filterCampaignsByTokens(campaigns: Campaign[], tokens: SearchTokens): Campaign[] {
  return campaigns.filter((campaign) => {
    // Filter by status
    if (tokens.status && tokens.status.length > 0) {
      if (!tokens.status.includes(campaign.status as 'draft' | 'active' | 'paused' | 'completed')) {
        return false;
      }
    }

    // Filter by type
    if (tokens.type && tokens.type.length > 0) {
      if (!tokens.type.includes(campaign.campaignType as 'fundraising' | 'sharing')) {
        return false;
      }
    }

    // Filter by goal range
    if (tokens.goalRange) {
      const goalAmount = campaign.goalAmount / 100; // Convert from cents
      if (tokens.goalRange.min !== undefined && goalAmount < tokens.goalRange.min) {
        return false;
      }
      if (tokens.goalRange.max !== undefined && goalAmount > tokens.goalRange.max) {
        return false;
      }
    }

    // Filter by raised range
    if (tokens.raisedRange) {
      const raisedAmount = campaign.raisedAmount / 100; // Convert from cents
      if (tokens.raisedRange.min !== undefined && raisedAmount < tokens.raisedRange.min) {
        return false;
      }
      if (tokens.raisedRange.max !== undefined && raisedAmount > tokens.raisedRange.max) {
        return false;
      }
    }

    // Filter by donor range
    if (tokens.donorRange) {
      const donors = campaign.donorCount || 0;
      if (tokens.donorRange.min !== undefined && donors < tokens.donorRange.min) {
        return false;
      }
      if (tokens.donorRange.max !== undefined && donors > tokens.donorRange.max) {
        return false;
      }
    }

    // Filter by date range
    if (tokens.dateRange) {
      const createdDate = new Date(campaign.createdAt);
      if (tokens.dateRange.from && createdDate < tokens.dateRange.from) {
        return false;
      }
      if (tokens.dateRange.to && createdDate > tokens.dateRange.to) {
        return false;
      }
    }

    // Filter by text
    if (tokens.text) {
      const searchText = tokens.text.toLowerCase();
      const campaignText = `${campaign.title} ${campaign.description}`.toLowerCase();
      if (!campaignText.includes(searchText)) {
        return false;
      }
    }

    // Filter by tags
    if (tokens.tags && tokens.tags.length > 0) {
      const campaignTags = campaign.tags || [];
      const hasAllTags = tokens.tags.every((tag) =>
        campaignTags.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
      if (!hasAllTags) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Advanced search hook
 */
export function useAdvancedSearch(campaigns: Campaign[], query: string) {
  const searchResult = parseAdvancedSearchQuery(query);
  const filteredCampaigns = filterCampaignsByTokens(campaigns, searchResult.tokens);

  return {
    query,
    tokens: searchResult.tokens,
    results: filteredCampaigns,
    totalResults: filteredCampaigns.length,
    isValid: searchResult.isValid,
    error: searchResult.error,
    highlightText: searchResult.tokens.text,
  };
}

/**
 * Get search examples for help/documentation
 */
export function getSearchExamples(): Array<{ query: string; description: string }> {
  return [
    {
      query: 'status:active',
      description: 'Find all active campaigns',
    },
    {
      query: 'status:active status:paused',
      description: 'Find active or paused campaigns',
    },
    {
      query: 'type:fundraising goal:>5000',
      description: 'Find fundraising campaigns with goal > $5,000',
    },
    {
      query: 'raised:>1000 raised:<10000',
      description: 'Find campaigns that raised between $1,000 and $10,000',
    },
    {
      query: 'donors:>100',
      description: 'Find campaigns with more than 100 donors',
    },
    {
      query: 'created:>2026-03-01',
      description: 'Find campaigns created after March 1, 2026',
    },
    {
      query: '"emergency fund"',
      description: 'Find campaigns with "emergency fund" in title or description',
    },
    {
      query: 'status:active goal:>1000 donors:>50',
      description: 'Complex query combining multiple filters',
    },
  ];
}

/**
 * Format search query for display
 */
export function formatSearchQuery(tokens: SearchTokens): string[] {
  const parts: string[] = [];

  if (tokens.status && tokens.status.length > 0) {
    parts.push(`Status: ${tokens.status.join(', ')}`);
  }

  if (tokens.type && tokens.type.length > 0) {
    parts.push(`Type: ${tokens.type.join(', ')}`);
  }

  if (tokens.goalRange) {
    if (tokens.goalRange.min && tokens.goalRange.max) {
      parts.push(`Goal: $${tokens.goalRange.min} - $${tokens.goalRange.max}`);
    } else if (tokens.goalRange.min) {
      parts.push(`Goal: > $${tokens.goalRange.min}`);
    } else if (tokens.goalRange.max) {
      parts.push(`Goal: < $${tokens.goalRange.max}`);
    }
  }

  if (tokens.raisedRange) {
    if (tokens.raisedRange.min && tokens.raisedRange.max) {
      parts.push(`Raised: $${tokens.raisedRange.min} - $${tokens.raisedRange.max}`);
    } else if (tokens.raisedRange.min) {
      parts.push(`Raised: > $${tokens.raisedRange.min}`);
    } else if (tokens.raisedRange.max) {
      parts.push(`Raised: < $${tokens.raisedRange.max}`);
    }
  }

  if (tokens.donorRange) {
    if (tokens.donorRange.min && tokens.donorRange.max) {
      parts.push(`Donors: ${tokens.donorRange.min} - ${tokens.donorRange.max}`);
    } else if (tokens.donorRange.min) {
      parts.push(`Donors: > ${tokens.donorRange.min}`);
    } else if (tokens.donorRange.max) {
      parts.push(`Donors: < ${tokens.donorRange.max}`);
    }
  }

  if (tokens.text) {
    parts.push(`Text: "${tokens.text}"`);
  }

  return parts;
}
