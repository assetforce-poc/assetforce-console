'use client';

import { Alert, Box, CircularProgress } from '@assetforce/material';
import { ContractsPage } from '@assetforce/service/contracts';
import { useServiceDetail } from '@assetforce/service/detail';

export type ContractsPageWrapperProps = {
  slug: string;
};

/**
 * ContractsPageWrapper - Fetch service ID and render ContractsPage
 *
 * This wrapper component fetches the service details to get the service ID,
 * which is required by ContractsPage.
 */
export function ContractsPageWrapper({ slug }: ContractsPageWrapperProps) {
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

  return <ContractsPage slug={slug} serviceId={service.id} />;
}
