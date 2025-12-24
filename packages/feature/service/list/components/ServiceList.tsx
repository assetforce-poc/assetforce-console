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
  TablePagination,
  TableRow,
  Typography,
} from '@assetforce/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useServices } from '../hooks';
import type { ServiceLifecycle, ServiceType } from '../types';
import { ServiceStatusBadge } from './ServiceStatusBadge';

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

const LIFECYCLE_COLORS: Record<string, 'success' | 'warning' | 'info' | 'default' | 'error'> = {
  PRODUCTION: 'success',
  TESTING: 'warning',
  DEVELOPMENT: 'info',
  DEPRECATED: 'error',
};

/**
 * Format date for display
 */
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-CA');
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
    return 'You do not have permission to view services.';
  }

  if (message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  return 'Failed to load services. Please try again later.';
}

export interface ServiceListProps {
  /** Filter by service type */
  type?: ServiceType;
  /** Filter by lifecycle stage */
  lifecycle?: ServiceLifecycle;
  /** Search by slug or displayName */
  search?: string;
}

/**
 * ServiceList - Display list of services with pagination
 *
 * @example
 * ```tsx
 * <ServiceList type="CORE" lifecycle="PRODUCTION" />
 * ```
 */
export function ServiceList({ type, lifecycle, search }: ServiceListProps) {
  const router = useRouter();
  const [page, setPage] = useState(0); // MUI TablePagination uses 0-indexed
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);

  const { services, loading, error, total } = useServices({
    type,
    lifecycle,
    search,
    limit: size,
    offset: page * size,
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (slug: string) => {
    router.push(`/services/${slug}`);
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
      <Alert severity="error" data-testid="service-list-error">
        {getErrorMessage(error)}
      </Alert>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary" data-testid="service-list-empty">
          No services found.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box data-testid="service-list">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Lifecycle</TableCell>
              <TableCell>Health</TableCell>
              <TableCell>Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow
                key={service.id}
                data-testid={`service-row-${service.slug}`}
                hover
                onClick={() => handleRowClick(service.slug)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{service.displayName}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {service.slug}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={service.type} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  {service.lifecycle && (
                    <Chip
                      label={service.lifecycle}
                      size="small"
                      color={LIFECYCLE_COLORS[service.lifecycle] ?? 'default'}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {service.health ? (
                    <ServiceStatusBadge status={service.health.status} />
                  ) : (
                    <ServiceStatusBadge status="UNKNOWN" />
                  )}
                </TableCell>
                <TableCell>{formatDate(service.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={size}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[...PAGE_SIZE_OPTIONS]}
        data-testid="service-list-pagination"
      />
    </Box>
  );
}
