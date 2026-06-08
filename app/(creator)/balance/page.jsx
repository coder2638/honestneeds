/**
 * PHASE 2: Creator Balance Page
 * Main creator dashboard showing balances and payout requests
 * 
 * Features:
 * - Display available balance (green card)
 * - Display pending/held balance (yellow card)
 * - Display total earned (info card)
 * - Display total paid out (success card)
 * - Request payout button
 * - Payout history table
 * - Real-time balance updates
 */

'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosConfig';
import { debugAuthState } from '../../../utils/debugAuth';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
  Button,
  Alert,
  Skeleton,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import PayoutRequestModal from '../../../components/creator/PayoutRequestModal';
import PayoutHistory from '../../../components/creator/PayoutHistory';

// ============================================================================
// HOOKS
// ============================================================================

const useCreatorBalance = () => {
  return useQuery({
    queryKey: ['creator', 'balance'],
    queryFn: async () => {
      const response = await axiosInstance.get('/creator/balance');
      return response.data.balance;
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Balance Card Component
 */
function BalanceCard({ title, amount, icon: Icon, color, subtitle }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" component="div">
              ${(amount / 100).toFixed(2)}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: `${color}20`,
              color: color,
            }}
          >
            <Icon sx={{ fontSize: 32 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * Hold Information Component
 */
function HoldInfo({ pending, holdUntil, daysRemaining }) {
  if (pending === 0 || !holdUntil) {
    return null;
  }

  return (
    <Alert severity="warning" sx={{ mb: 3 }}>
      <Typography variant="body2">
        <strong>Share rewards on 30-day hold:</strong> ${(pending / 100).toFixed(2)}
        {daysRemaining > 0 && ` • ${daysRemaining} days remaining`}
      </Typography>
    </Alert>
  );
}

/**
 * Main Creator Balance Page
 */
export default function CreatorBalancePage() {
  const [openPayoutModal, setOpenPayoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const queryClient = useQueryClient();

  const {
    data: balance,
    isLoading,
    error,
  } = useCreatorBalance();

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load balance. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Balance & Payouts
        </Typography>
        <Typography color="textSecondary">
          Manage your earnings and request payouts
        </Typography>
      </Box>

      {/* Hold Information Alert */}
      {balance && (
        <HoldInfo
          pending={balance.pending_cents}
          holdUntil={balance.pending_details?.hold_until}
          daysRemaining={balance.pending_details?.days_remaining}
        />
      )}

      {/* Balance Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Available Balance Card */}
        <Grid item xs={12} sm={6} md={3}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={180} />
          ) : (
            <BalanceCard
              title="Available"
              amount={balance?.available_cents || 0}
              icon={WalletIcon}
              color="#4caf50"
              subtitle="Ready to withdraw"
            />
          )}
        </Grid>

        {/* Pending Balance Card */}
        <Grid item xs={12} sm={6} md={3}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={180} />
          ) : (
            <BalanceCard
              title="Pending"
              amount={balance?.pending_cents || 0}
              icon={ScheduleIcon}
              color="#ff9800"
              subtitle={
                balance?.pending_details?.days_remaining
                  ? `${balance.pending_details.days_remaining} days remaining`
                  : null
              }
            />
          )}
        </Grid>

        {/* Total Earned Card */}
        <Grid item xs={12} sm={6} md={3}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={180} />
          ) : (
            <BalanceCard
              title="Total Earned"
              amount={balance?.total_earned_cents || 0}
              icon={TrendingIcon}
              color="#2196f3"
              subtitle={`${balance?.donation_count || 0} donations`}
            />
          )}
        </Grid>

        {/* Total Paid Out Card */}
        <Grid item xs={12} sm={6} md={3}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={180} />
          ) : (
            <BalanceCard
              title="Total Paid Out"
              amount={balance?.total_paid_out_cents || 0}
              icon={CheckIcon}
              color="#9c27b0"
              subtitle="Lifetime payouts"
            />
          )}
        </Grid>
      </Grid>

      {/* Request Payout Button */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {
            const timestamp = new Date().toISOString();
            console.log(`\n${'='.repeat(80)}`);
            console.log(`[${timestamp}] 🎯 REQUEST PAYOUT BUTTON CLICKED`);
            console.log(`${'='.repeat(80)}\n`);
            
            // Run comprehensive auth debug
            debugAuthState();
            
            // Additional info
            console.log(`[${timestamp}] Opening Payout Modal...`);
            
            setOpenPayoutModal(true);
          }}
          disabled={!balance?.can_request_payout || isLoading}
        >
          Request Payout
        </Button>
        {!balance?.can_request_payout && balance && (
          <Typography variant="body2" sx={{ alignSelf: 'center', color: 'textSecondary' }}>
            Minimum payout: ${(balance.minimum_payout_cents / 100).toFixed(2)}
          </Typography>
        )}
      </Box>

      {/* Breakdown Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Breakdown" />
          <Tab label="Last Payout" />
          <Tab label="Statistics" />
        </Tabs>

        {/* Breakdown Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    From Direct Donations
                  </Typography>
                  <Typography variant="h6">
                    ${(balance?.available_detailed?.from_direct_donations / 100).toFixed(2) || '0.00'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    From Verified Rewards
                  </Typography>
                  <Typography variant="h6">
                    ${(balance?.available_detailed?.from_verified_rewards / 100).toFixed(2) || '0.00'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Last Payout Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {balance?.last_payout ? (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Amount
                  </Typography>
                  <Typography variant="h6">
                    ${(balance.last_payout.amount_cents / 100).toFixed(2)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(balance.last_payout.paid_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography color="textSecondary">No payouts yet</Typography>
            )}
          </Box>
        )}

        {/* Statistics Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Total Donations
                  </Typography>
                  <Typography variant="h6">
                    {balance?.donation_count || 0}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Average Donation
                  </Typography>
                  <Typography variant="h6">
                    ${(balance?.avg_donation_cents / 100).toFixed(2) || '0.00'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Payout History */}
      <PayoutHistory />

      {/* Payout Request Modal */}
      <PayoutRequestModal
        open={openPayoutModal}
        onClose={() => setOpenPayoutModal(false)}
        availableBalance={balance?.available_cents || 0}
        onSuccess={() => {
          setOpenPayoutModal(false);
          queryClient.invalidateQueries({ queryKey: ['creator', 'balance'] })
        }}
      />
    </Container>
  );
}
