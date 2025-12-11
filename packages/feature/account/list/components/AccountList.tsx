'use client';

import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@assetforce/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAccounts } from '../hooks';
import type { AccountStatus } from '../types';
import { AccountStatusBadge } from './AccountStatusBadge';

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

/**
 * Format date for display in account list
 * Uses consistent YYYY/MM/DD format regardless of locale
 */
function formatAccountDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-CA'); // ISO-like format: YYYY-MM-DD
}

/**
 * Convert GraphQL error to user-friendly message
 */
function getErrorMessage(error: Error): string {
  const message = error.message.toLowerCase();

  if (message.includes('network') || message.includes('fetch')) {
    return 'Unable to connect to the server. Please check your connection.';
  }

  if (message.includes('unauthorized') || message.includes('forbidden')) {
    return 'You do not have permission to view accounts.';
  }

  if (message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Default fallback
  return 'Failed to load accounts. Please try again later.';
}

export interface AccountListProps {
  /** Filter by account status */
  status?: AccountStatus;
  /** Search by email or username */
  search?: string;
}

/**
 * AccountList - Display list of accounts with pagination
 *
 * @example
 * ```tsx
 * <AccountList status={AccountStatus.ACTIVE} />
 * ```
 */
export function AccountList({ status, search }: AccountListProps) {
  const router = useRouter();
  const [page, setPage] = useState(0); // MUI TablePagination uses 0-indexed
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);

  const { data, loading, error } = useAccounts({
    status,
    search,
    page: page + 1, // Backend uses 1-indexed
    size,
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (accountId: string) => {
    router.push(`/accounts/${accountId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" data-testid="account-list-error">
        {getErrorMessage(error)}
      </Alert>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary" data-testid="account-list-empty">
          No accounts found.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box data-testid="account-list">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Email Verified</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items.map((account) => (
              <TableRow
                key={account.id}
                data-testid={`account-row-${account.id}`}
                hover
                onClick={() => handleRowClick(account.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{account.username}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>
                  <AccountStatusBadge status={account.status} />
                </TableCell>
                <TableCell>{account.emailVerified ? 'Yes' : 'No'}</TableCell>
                <TableCell>{formatAccountDate(account.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={data.total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={size}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[...PAGE_SIZE_OPTIONS]}
        data-testid="account-list-pagination"
      />
    </Box>
  );
}
