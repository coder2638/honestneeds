/**
 * ShareRewardsDashboard.tsx
 * Sharer dashboard to view earned rewards with 30-day hold countdown
 * 
 * Features:
 * - Total earned stats
 * - Verified rewards (available for payout)
 * - Pending rewards (30-day hold with countdown)
 * - Payout request button
 * - Real-time hold countdown
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle, Clock, CheckCircle2, TrendingUp, Loader2 } from 'lucide-react';

interface Reward {
  _id: string;
  reward_id: string;
  campaign_id: string;
  campaign_name?: string;
  amount_cents: number;
  status: 'pending_verification' | 'verified' | 'available_for_payout';
  hold_until_date: string;
  hold_days_remaining: number;
  verified_at?: string;
  earned_at: string;
}

interface RewardsData {
  sharer_id: string;
  summary: {
    total_earned_cents: number;
    verified_cents: number;
    pending_cents: number;
    total_reward_count: number;
    verified_count: number;
    pending_count: number;
    can_request_payout: boolean;
    total_available_for_payout: number;
  };
  rewards: Reward[];
  verified_rewards: Reward[];
  pending_rewards: Reward[];
}

export default function ShareRewardsDashboard() {
  const [selectedRewards, setSelectedRewards] = useState<string[]>([]);
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [displayedCountdowns, setDisplayedCountdowns] = useState<Record<string, number>>({});

  // Fetch rewards
  const {
    data: rewardsData,
    isLoading: isLoadingRewards,
    error: rewardsError,
    refetch: refetchRewards,
  } = useQuery<RewardsData>({
    queryKey: ['sharer-rewards'],
    queryFn: async () => {
      const response = await axios.get('/api/sharer/rewards');
      return response.data.data;
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Refetch every 1 minute
  });

  // Create payout request mutation
  const payoutMutation = useMutation({
    mutationFn: async (data: { amount_cents: number; payout_method: string }) => {
      const response = await axios.post('/api/sharer/payout-requests', data);
      return response.data.data;
    },
    onSuccess: () => {
      setShowPayoutModal(false);
      setSelectedRewards([]);
      setPayoutAmount(0);
      refetchRewards();
      // Show success notification
      alert('Payout request submitted! Awaiting admin approval.');
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    },
  });

  // Update countdowns every minute
  useEffect(() => {
    if (!rewardsData?.pending_rewards) return;

    const updateCountdowns = () => {
      const countdowns: Record<string, number> = {};
      rewardsData.pending_rewards.forEach((reward) => {
        const now = new Date().getTime();
        const holdUntil = new Date(reward.hold_until_date).getTime();
        const daysRemaining = Math.max(0, Math.ceil((holdUntil - now) / (1000 * 60 * 60 * 24)));
        countdowns[reward._id] = daysRemaining;
      });
      setDisplayedCountdowns(countdowns);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [rewardsData?.pending_rewards]);

  if (isLoadingRewards) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className="ml-2 text-gray-600">Loading rewards...</span>
      </div>
    );
  }

  if (rewardsError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <span>Error loading rewards. Please try again.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const summary = rewardsData?.summary || {};
  const verifiedRewards = rewardsData?.verified_rewards || [];
  const pendingRewards = rewardsData?.pending_rewards || [];

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleSelectReward = (rewardId: string, checked: boolean) => {
    if (checked) {
      setSelectedRewards([...selectedRewards, rewardId]);
    } else {
      setSelectedRewards(selectedRewards.filter((id) => id !== rewardId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRewards(verifiedRewards.map((r) => r._id));
    } else {
      setSelectedRewards([]);
    }
  };

  const totalSelected = selectedRewards.reduce((sum, rewardId) => {
    const reward = verifiedRewards.find((r) => r._id === rewardId);
    return sum + (reward?.amount_cents || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Share Rewards</h1>
        <p className="mt-2 text-gray-600">Track your earned rewards from sharing campaigns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Earned */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(summary.total_earned_cents)}
            </div>
            <p className="mt-1 text-xs text-gray-500">{summary.total_reward_count} rewards</p>
          </CardContent>
        </Card>

        {/* Verified (Available) */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-700">Available Payout</CardTitle>
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {formatCurrency(summary.verified_cents)}
            </div>
            <p className="mt-1 text-xs text-green-600">{summary.verified_count} verified rewards</p>
          </CardContent>
        </Card>

        {/* Pending (On Hold) */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-yellow-700">Pending Verification</CardTitle>
              <Clock className="text-yellow-600" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700">
              {formatCurrency(summary.pending_cents)}
            </div>
            <p className="mt-1 text-xs text-yellow-600">
              {summary.pending_count} rewards on 30-day hold
            </p>
          </CardContent>
        </Card>

        {/* Monthly Earnings */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(summary.verified_cents + summary.pending_cents)}
            </div>
            <p className="mt-1 text-xs text-gray-500">Total earned this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Verified Rewards (Available for Payout) */}
      {verifiedRewards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle2 size={20} />
              Available for Payout ({verifiedRewards.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRewards.length === verifiedRewards.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded"
                      />
                    </th>
                    <th className="pb-2 text-left font-semibold text-gray-700">Campaign</th>
                    <th className="pb-2 text-left font-semibold text-gray-700">Amount</th>
                    <th className="pb-2 text-left font-semibold text-gray-700">Earned Date</th>
                    <th className="pb-2 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {verifiedRewards.map((reward) => (
                    <tr key={reward._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedRewards.includes(reward._id)}
                          onChange={(e) => handleSelectReward(reward._id, e.target.checked)}
                          className="rounded"
                        />
                      </td>
                      <td className="py-3 text-left">{reward.campaign_name || 'Campaign'}</td>
                      <td className="py-3 font-semibold text-green-700">
                        {formatCurrency(reward.amount_cents)}
                      </td>
                      <td className="py-3 text-gray-600">
                        {new Date(reward.earned_at).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payout Selection Summary */}
            {verifiedRewards.length > 0 && (
              <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Selected for payout:</span>
                  <span className="text-lg font-semibold text-green-700">
                    {formatCurrency(totalSelected)} ({selectedRewards.length} rewards)
                  </span>
                </div>
                <Button
                  onClick={() => {
                    setPayoutAmount(totalSelected);
                    setShowPayoutModal(true);
                  }}
                  disabled={selectedRewards.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Request Payout ({formatCurrency(totalSelected)})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pending Rewards (30-Day Hold) */}
      {pendingRewards.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Clock size={20} />
              Pending Verification - 30-Day Hold ({pendingRewards.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-yellow-200">
                    <th className="pb-2 text-left font-semibold text-yellow-700">Campaign</th>
                    <th className="pb-2 text-left font-semibold text-yellow-700">Amount</th>
                    <th className="pb-2 text-left font-semibold text-yellow-700">Earned Date</th>
                    <th className="pb-2 text-left font-semibold text-yellow-700">Days Remaining</th>
                    <th className="pb-2 text-left font-semibold text-yellow-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRewards.map((reward) => {
                    const daysRemaining = displayedCountdowns[reward._id] ?? reward.hold_days_remaining;
                    const progressPercent = ((30 - daysRemaining) / 30) * 100;

                    return (
                      <tr key={reward._id} className="border-b border-yellow-100 hover:bg-yellow-100/30">
                        <td className="py-3 text-left">{reward.campaign_name || 'Campaign'}</td>
                        <td className="py-3 font-semibold text-yellow-700">
                          {formatCurrency(reward.amount_cents)}
                        </td>
                        <td className="py-3 text-gray-700">
                          {new Date(reward.earned_at).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <div className="space-y-1">
                            <div className="text-center font-semibold text-yellow-700">
                              {daysRemaining} days
                            </div>
                            <div className="w-24 overflow-hidden rounded-full bg-yellow-200">
                              <div
                                className="h-2 bg-yellow-600 transition-all"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge className="bg-yellow-100 text-yellow-800">On Hold</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-yellow-700">
              💡 These rewards are on a 30-day hold for fraud prevention. They will automatically become
              available after the hold period expires.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {summary.total_reward_count === 0 && (
        <Card className="border-gray-200 text-center">
          <CardContent className="py-12">
            <TrendingUp className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-900">No rewards yet</h3>
            <p className="mt-2 text-gray-600">
              Share campaigns to earn rewards! Start sharing and earn money from your network.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <PayoutRequestModal
          isOpen={showPayoutModal}
          onClose={() => setShowPayoutModal(false)}
          availableCents={summary.verified_cents}
          selectedRewards={selectedRewards}
          onSubmit={(data) => payoutMutation.mutate(data)}
          isLoading={payoutMutation.isPending}
        />
      )}
    </div>
  );
}

/**
 * PayoutRequestModal Component
 */
interface PayoutRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableCents: number;
  selectedRewards: string[];
  onSubmit: (data: { amount_cents: number; payout_method: string }) => void;
  isLoading: boolean;
}

function PayoutRequestModal({
  isOpen,
  onClose,
  availableCents,
  selectedRewards,
  onSubmit,
  isLoading,
}: PayoutRequestModalProps) {
  const [amount, setAmount] = useState((availableCents / 100).toFixed(2));
  const [method, setMethod] = useState('stripe');

  if (!isOpen) return null;

  const amountCents = Math.round(parseFloat(amount) * 100);
  const isValid = amountCents > 0 && amountCents <= availableCents && method;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Request Payout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Payout Amount</label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-gray-600">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.10"
                max={(availableCents / 100).toFixed(2)}
                step="0.01"
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Available: ${(availableCents / 100).toFixed(2)} • Min: $0.10
            </p>
          </div>

          {/* Payout Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Payout Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          {/* Summary */}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Total Payout:</span>
              <span className="font-semibold text-green-600">${amount}</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {selectedRewards.length} reward{selectedRewards.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => onSubmit({ amount_cents: amountCents, payout_method: method })}
              disabled={!isValid || isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Submitting...' : 'Submit Payout'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
