'use client';

import { Alert, Box, CircularProgress } from '@assetforce/material';
import { useServiceDetail } from '@assetforce/service/detail';
import { NotificationsPage } from '@assetforce/service/notifications';

export type NotificationsPageWrapperProps = {
  slug: string;
};

/**
 * NotificationsPageWrapper - Fetch service ID and render NotificationsPage
 *
 * This wrapper component fetches the service details to get the service ID,
 * which is required by NotificationsPage.
 */
export function NotificationsPageWrapper({ slug }: NotificationsPageWrapperProps) {
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

  return <NotificationsPage serviceId={service.id} serviceName={service.displayName || slug} />;
}
