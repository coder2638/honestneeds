/**
 * Sponsorship Tiers — Client-side Configuration
 * Mirror of backend config for UI rendering.
 * Keep in sync with src/config/sponsorshipTiers.js on the backend.
 */

export const SPONSORSHIP_TIERS = [
  {
    id: 'supporter',
    name: 'Supporter',
    price: 25,
    recurring: false,
    benefits: ['Name listed on Sponsor Wall', 'Thank-you email from James'],
    color: '#6B7280',
    icon: '🤝',
  },
  {
    id: 'bronze',
    name: 'Bronze Sponsor',
    price: 50,
    recurring: false,
    benefits: ['All Supporter benefits', 'Social media shoutout'],
    color: '#92400E',
    icon: '🥉',
  },
  {
    id: 'silver',
    name: 'Silver Sponsor',
    price: 100,
    recurring: false,
    benefits: ['All Bronze benefits', 'Website mention', 'Dedicated social post'],
    color: '#6B7280',
    icon: '🥈',
  },
  {
    id: 'gold',
    name: 'Gold Sponsor',
    price: 250,
    recurring: false,
    popular: true,
    benefits: ['All Silver benefits', 'Featured logo placement on Sponsor Wall'],
    color: '#D97706',
    icon: '🥇',
  },
  {
    id: 'platinum',
    name: 'Platinum Sponsor',
    price: 500,
    recurring: false,
    benefits: ['All Gold benefits', 'Featured in email campaign', 'Homepage placement (30 days)'],
    color: '#7C3AED',
    icon: '💎',
  },
  {
    id: 'champion',
    name: 'Community Champion',
    price: 1000,
    recurring: true,
    benefits: ['All Platinum benefits', 'Video shoutout', 'Priority campaign listing'],
    color: '#1D4ED8',
    icon: '🏆',
  },
  {
    id: 'growth_partner',
    name: 'Growth Partner',
    price: 2500,
    recurring: true,
    benefits: ['All Champion benefits', 'Featured campaign promotion for 60 days'],
    color: '#065F46',
    icon: '📈',
  },
  {
    id: 'silver_sponsor_org',
    name: 'Silver Sponsorship',
    price: 5000,
    recurring: false,
    repayment: 6000,
    interestRate: 0.20,
    minMonthlyPayment: 500,
    partnershipYears: 1,
    benefits: [
      '1-Year Marketing Partnership',
      'Sponsor recognition across all campaigns',
      'Press mention',
      'Larger ad placement',
    ],
    color: '#0F172A',
    icon: '🌐',
  },
  {
    id: 'gold_sponsor_org',
    name: 'Gold Sponsorship',
    price: 10000,
    recurring: false,
    repayment: 12000,
    interestRate: 0.20,
    minMonthlyPayment: 500,
    partnershipYears: 3,
    benefits: [
      '3-Year Marketing Partnership',
      'Expanded promotional opportunities',
      'Homepage banner placement',
      'VIP partnership call',
    ],
    color: '#7C2D12',
    icon: '👑',
  },
  {
    id: 'platinum_national',
    name: 'Platinum / National Sponsor',
    price: 20000,
    recurring: false,
    repayment: 24000,
    interestRate: 0.20,
    minMonthlyPayment: 500,
    partnershipYears: 7,
    benefits: [
      '7-Year National Partnership',
      'Homepage banner (permanent)',
      'Press & media features',
      'Custom Enterprise terms',
    ],
    color: '#1E1B4B',
    icon: '🌟',
  },
];

export function findTierById(tierId) {
  return SPONSORSHIP_TIERS.find((t) => t.id === tierId);
}

/**
 * Client-side fee calculation (mirrors backend feeEngine)
 */
export function calculateSponsorshipFees(grossAmount) {
  const platformFee = parseFloat((grossAmount * 0.20).toFixed(2));
  const netAmount = parseFloat((grossAmount - platformFee).toFixed(2));
  return { platformFee, netAmount };
}
