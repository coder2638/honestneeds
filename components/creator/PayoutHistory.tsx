/**
 * Payout History Component
 * Displays table of creator's payout requests and history
 */

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosConfig';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Typography,
  Box,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  CheckCircle as PaidIcon,
  Schedule as PendingIcon,
  Error as FailedIcon,
  Cancel as RejectedIcon,
} from '@mui/icons-material';

// Status colors and icons
const STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    color: 'warning',
    icon: PendingIcon,
  },
  approved: {
    label: 'Approved',
    color: 'info',
    icon: PendingIcon,
  },
  processing: {
    label: 'Processing',
    color: 'info',
    icon: PendingIcon,
  },
  paid: {
    label: 'Paid',
    color: 'success',
    icon: PaidIcon,
  },
  failed: {
    label: 'Failed',
    color: 'error',
    icon: FailedIcon,
  },
  rejected: {
    label: 'Rejected',
    color: 'error',
    icon: RejectedIcon,
  },
};

// Hook for fetching payout history
const usePayoutHistory = (page, rowsPerPage) => {
  return useQuery({
    queryKey: ['creator', 'payouts', page, rowsPerPage],
    queryFn: async () => {
      const response = await axiosInstance.get('/creator/payouts', {
        params: { page: page + 1, limit: rowsPerPage },
      });
      return response.data;
    },
  });
};

/**
 * Payout History Component
 */
export default function PayoutHistory() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, error } = usePayoutHistory(page, rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const payouts = data?.payouts || [];
  const pagination = data?.pagination || { total: 0 };

  return (
    <Card>
      <CardHeader
        title="Payout History"
        subheader="View all your payout requests and status"
      />
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load payout history
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Skeleton height={40} />
            <Skeleton height={40} />
            <Skeleton height={40} />
            <Skeleton height={40} />
          </Box>
        ) : payouts.length === 0 ? (
          <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
            No payout requests yet
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payouts.map((payout) => {
                    const statusConfig = STATUS_CONFIG[payout.status] || {
                      label: payout.status,
                      color: 'default',
                    };

                    return (
                      <TableRow key={payout.id}>
                        <TableCell>
                          {new Date(payout.requested_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ${(payout.amount_cents / 100).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                          {payout.payout_method}
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="textSecondary">
                            {payout.status === 'paid' && payout.paid_at
                              ? `Paid ${new Date(payout.paid_at).toLocaleDateString()}`
                              : payout.status === 'rejected' && payout.rejected_reason
                              ? `Rejected: ${payout.rejected_reason}`
                              : payout.status === 'approved'
                              ? 'Awaiting processing'
                              : 'Pending review'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={pagination.total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
