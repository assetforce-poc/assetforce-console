'use client';

import { Alert, Box, CircularProgress } from '@assetforce/material';
import { DependenciesPage } from '@assetforce/service/dependencies';
import { useServiceDetail } from '@assetforce/service/detail';

export type DependenciesPageWrapperProps = {
  slug: string;
};

/**
 * DependenciesPageWrapper - Fetch service ID and render DependenciesPage
 *
 * This wrapper component fetches the service details to get the service ID,
 * which is required by DependenciesPage.
 */
export function DependenciesPageWrapper({ slug }: DependenciesPageWrapperProps) {
  const { service, loading, error } = useServiceDetail(slug);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load service details: {error.message}</Alert>;
  }

  if (!service) {
    return <Alert severity="warning">Service not found.</Alert>;
  }

  return <DependenciesPage serviceId={service.id} serviceName={service.displayName || slug} />;
}
