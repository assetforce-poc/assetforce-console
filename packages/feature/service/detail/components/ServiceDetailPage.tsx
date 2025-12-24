'use client';

import { Alert, Box, CircularProgress, Grid, Stack } from '@assetforce/material';

import { useServiceDetail } from '../hooks';
import { ServiceDependenciesCard } from './ServiceDependenciesCard';
import { ServiceHealthCard } from './ServiceHealthCard';
import { ServiceInfoCard } from './ServiceInfoCard';
import { ServiceInstancesTable } from './ServiceInstancesTable';

/**
 * Convert GraphQL error to user-friendly message
 */
function getErrorMessage(error: Error): string {
  const message = error.message.toLowerCase();

  if (message.includes('network') || message.includes('fetch')) {
    return 'Unable to connect to the server. Please check your connection.';
  }

  if (message.includes('not found')) {
    return 'Service not found.';
  }

  if (message.includes('unauthorized') || message.includes('forbidden')) {
    return 'You do not have permission to view this service.';
  }

  return 'Failed to load service details. Please try again later.';
}

export interface ServiceDetailPageProps {
  /** Service slug */
  slug: string;
}

/**
 * ServiceDetailPage - Display full service details
 *
 * @example
 * ```tsx
 * <ServiceDetailPage slug="aac-service" />
 * ```
 */
export function ServiceDetailPage({ slug }: ServiceDetailPageProps) {
  const { service, loading, error } = useServiceDetail(slug);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" data-testid="service-detail-error">
        {getErrorMessage(error)}
      </Alert>
    );
  }

  if (!service) {
    return (
      <Alert severity="warning" data-testid="service-detail-not-found">
        Service not found.
      </Alert>
    );
  }

  return (
    <Stack spacing={3} data-testid="service-detail">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ServiceInfoCard service={service} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {service.health && <ServiceHealthCard health={service.health} />}
            <ServiceDependenciesCard dependencies={service.dependencies} />
          </Stack>
        </Grid>
      </Grid>

      <ServiceInstancesTable instances={service.instances} />
    </Stack>
  );
}
