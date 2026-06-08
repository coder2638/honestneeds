/**
 * Payout Request Modal Component
 * Form for requesting payouts
 */

'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosConfig';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
} from '@mui/material';

export default function PayoutRequestModal({
  open,
  onClose,
  availableBalance,
  onSuccess,
}) {
  const [amount, setAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('stripe');
  const [errors, setErrors] = useState({});

  const createPayoutMutation = useMutation({
    mutationFn: async (data) => {
      const timestamp = new Date().toISOString();
      
      console.log(`[${timestamp}] [PayoutRequestModal] 📤 About to send payout request`);
      console.log(`[${timestamp}] [PayoutRequestModal] Payload:`, data);
      
      // Check auth store before making request
      const authStore = require('../../store/authStore').useAuthStore.getState();
      console.log(`[${timestamp}] [PayoutRequestModal] Auth Store Status:`, {
        isAuthenticated: authStore.isAuthenticated,
        user: authStore.user?.email,
        hasToken: !!authStore.token,
        tokenLength: authStore.token ? authStore.token.length : 0,
      });
      
      try {
        console.log(`[${timestamp}] [PayoutRequestModal] 🌐 Calling axiosInstance.post('/creator/payout-requests')`);
        const response = await axiosInstance.post('/creator/payout-requests', data);
        console.log(`[${timestamp}] [PayoutRequestModal] ✅ Success response:`, response.data);
        return response.data;
      } catch (error) {
        console.error(`[${timestamp}] [PayoutRequestModal] ❌ Error response:`, error.response?.data);
        console.error(`[${timestamp}] [PayoutRequestModal] Status:`, error.response?.status);
        console.error(`[${timestamp}] [PayoutRequestModal] Headers sent:`, error.response?.config?.headers);
        throw error;
      }
    },
    onSuccess: () => {
      setAmount('');
      setErrors({});
      onSuccess?.();
    },
    onError: (error) => {
      setErrors({
        submit: error.response?.data?.message || 'Failed to create payout request',
      });
    },
  });

  const handleSubmit = () => {
    const newErrors = {};

    const amountCents = Math.round(parseFloat(amount) * 100);

    if (!amount || isNaN(amountCents) || amountCents < 5000) {
      newErrors.amount = 'Minimum payout is $50';
    }

    if (amountCents > availableBalance) {
      newErrors.amount = `Cannot exceed available balance: $${(availableBalance / 100).toFixed(2)}`;
    }

    if (!payoutMethod) {
      newErrors.method = 'Payout method required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createPayoutMutation.mutate({
      amount_cents: amountCents,
      payout_method: payoutMethod,
      destination: {
        stripe_account_id: payoutMethod === 'stripe' ? 'acct_creator' : null,
      },
    });
  };

  const amountCents = amount ? Math.round(parseFloat(amount) * 100) : 0;
  const isValid = amountCents >= 5000 && amountCents <= availableBalance;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Request Payout</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Available Balance */}
          <Box>
            <Typography variant="body2" color="textSecondary">
              Available Balance
            </Typography>
            <Typography variant="h6">
              ${(availableBalance / 100).toFixed(2)}
            </Typography>
          </Box>

          {/* Amount Input */}
          <TextField
            fullWidth
            label="Payout Amount"
            type="number"
            inputProps={{
              step: '0.01',
              min: '50',
              max: (availableBalance / 100).toFixed(2),
            }}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrors({ ...errors, amount: null });
            }}
            error={!!errors.amount}
            helperText={errors.amount || 'Minimum: $50'}
            startAdornment={<Typography variant="body1">$</Typography>}
          />

          {/* Payout Method */}
          <Box>
            <Typography variant="body2" gutterBottom>
              Payout Method
            </Typography>
            <RadioGroup
              value={payoutMethod}
              onChange={(e) => {
                setPayoutMethod(e.target.value);
                setErrors({ ...errors, method: null });
              }}
            >
              <FormControlLabel
                value="stripe"
                control={<Radio />}
                label="Stripe (Fastest)"
              />
              <FormControlLabel
                value="paypal"
                control={<Radio />}
                label="PayPal"
              />
              <FormControlLabel
                value="bank_transfer"
                control={<Radio />}
                label="Bank Transfer"
              />
            </RadioGroup>
            {errors.method && (
              <Typography variant="caption" color="error">
                {errors.method}
              </Typography>
            )}
          </Box>

          {/* Fee Information */}
          <Alert severity="info">
            No fees! Platform covers all transfer costs.
          </Alert>

          {/* Processing Time */}
          <Box>
            <Typography variant="caption" color="textSecondary">
              <strong>Processing Time:</strong> Typically 1-2 business days after admin approval
            </Typography>
          </Box>

          {/* Error Message */}
          {errors.submit && (
            <Alert severity="error">{errors.submit}</Alert>
          )}

          {/* Summary */}
          {isValid && (
            <Box sx={{
              p: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <Typography variant="body2">You will receive:</Typography>
              <Typography variant="body2" fontWeight="bold">
                ${(amountCents / 100).toFixed(2)}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isValid || createPayoutMutation.isPending}
        >
          {createPayoutMutation.isPending ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Submitting...
            </>
          ) : (
            'Submit Request'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
