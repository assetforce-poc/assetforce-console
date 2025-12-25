'use client';

import { Alert, Box, CircularProgress } from '@assetforce/material';
import { useServiceDetail } from '@assetforce/service/detail';
import { DeprecationNotificationsPage } from '@assetforce/service/notifications';

export type DeprecationNotificationsPageWrapperProps = {
  slug: string;
};

/**
 * DeprecationNotificationsPageWrapper - Fetch service ID and render DeprecationNotificationsPage
 *
 * This wrapper component fetches the service details to get the service ID,
 * which is required by DeprecationNotificationsPage.
 */
export function DeprecationNotificationsPageWrapper({ slug }: DeprecationNotificationsPageWrapperProps) {
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

  return <DeprecationNotificationsPage serviceId={service.id} serviceName={service.displayName || slug} />;
}
