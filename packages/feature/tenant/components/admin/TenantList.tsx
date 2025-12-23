'use client';

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@assetforce/material';
import type { FC } from 'react';

import { useTenants } from '../../hooks';
import type { TenantItem } from '../../hooks/operations';

interface TenantListProps {
  onTenantClick?: (tenant: TenantItem) => void;
}

const TYPE_COLORS: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  PRODUCTION: 'success',
  TRIAL: 'warning',
  DEMO: 'primary',
  SANDBOX: 'default',
};

/**
 * List of tenants.
 * Admin only.
 */
export const TenantList: FC<TenantListProps> = ({ onTenantClick }) => {
  const { tenants, loading, error } = useTenants();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load tenants: {error.message}
      </Alert>
    );
  }

  if (tenants.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="textSecondary">No tenants found</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant: TenantItem) => (
              <TableRow
                key={tenant.id}
                hover
                onClick={() => onTenantClick?.(tenant)}
                sx={{ cursor: onTenantClick ? 'pointer' : 'default' }}
              >
                <TableCell>{tenant.name}</TableCell>
                <TableCell>{tenant.displayName || '-'}</TableCell>
                <TableCell>
                  <Chip label={tenant.type} color={TYPE_COLORS[tenant.type] || 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={tenant.isActive ? 'Active' : 'Inactive'}
                    color={tenant.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{tenant.description || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TenantList;
