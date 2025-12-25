'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  Icons,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@assetforce/material';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

import { useDeprecationNotifications } from '../hooks/useDeprecationNotifications';
import { DeprecationNotificationList } from './DeprecationNotificationList';

interface DeprecationNotificationsPageProps {
  serviceId: string;
  serviceName?: string;
}

type AcknowledgedFilter = 'all' | 'unacknowledged' | 'acknowledged';

/**
 * Statistics card component
 */
const StatCard: FC<{ label: string; value: number; color?: string }> = ({ label, value, color = 'text.primary' }) => (
  <Card variant="outlined">
    <CardContent sx={{ textAlign: 'center', py: 2, '&:last-child': { pb: 2 } }}>
      <Typography variant="h4" color={color} fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </CardContent>
  </Card>
);

/**
 * Deprecation notifications page for a service
 */
export const DeprecationNotificationsPage: FC<DeprecationNotificationsPageProps> = ({ serviceId, serviceName }) => {
  const [acknowledgedFilter, setAcknowledgedFilter] = useState<AcknowledgedFilter>('all');

  // Build filter options
  const acknowledged = acknowledgedFilter === 'all' ? undefined : acknowledgedFilter === 'acknowledged';

  const {
    notifications,
    total,
    loading,
    error,
    refetch,
    acknowledge,
    acknowledgeAll,
    acknowledging,
    unacknowledgedCount,
    urgentDeprecations,
  } = useDeprecationNotifications({
    target: serviceId,
    acknowledged,
  });

  const handleAcknowledge = useCallback(
    async (ids: string[]) => {
      await acknowledge(ids);
    },
    [acknowledge]
  );

  if (loading && notifications.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load deprecation notifications: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Contract Deprecation Notifications {serviceName && `- ${serviceName}`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={() => refetch()}>
              <Icons.Refresh />
            </IconButton>
          </Tooltip>
          {unacknowledgedCount > 0 && (
            <Button
              variant="contained"
              onClick={acknowledgeAll}
              disabled={acknowledging}
              startIcon={<Icons.DoneAll />}
            >
              Acknowledge All
            </Button>
          )}
        </Box>
      </Box>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Total" value={total} color="primary.main" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Unacknowledged" value={unacknowledgedCount} color="warning.main" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Urgent (Removal Planned)" value={urgentDeprecations.length} color="error.main" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard
            label="Acknowledged"
            value={notifications.filter((n) => n.acknowledged).length}
            color="success.main"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={acknowledgedFilter}
            label="Status"
            onChange={(e) => setAcknowledgedFilter(e.target.value as AcknowledgedFilter)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="unacknowledged">Unacknowledged</MenuItem>
            <MenuItem value="acknowledged">Acknowledged</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Deprecation Notification List */}
      <DeprecationNotificationList
        notifications={notifications}
        loading={loading}
        onAcknowledge={handleAcknowledge}
        acknowledging={acknowledging}
      />
    </Box>
  );
};
