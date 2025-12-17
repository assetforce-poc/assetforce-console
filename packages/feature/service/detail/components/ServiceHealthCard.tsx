'use client';

import { Box, Card, CardContent, Stack, Typography } from '@assetforce/material';

import { ServiceStatusBadge } from '../../list/components/ServiceStatusBadge';
import type { ServiceHealthSummary } from '../types';

/**
 * Format date for display
 */
function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString();
}

/**
 * Calculate time ago string
 */
function timeAgo(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export interface ServiceHealthCardProps {
  health: ServiceHealthSummary;
}

/**
 * ServiceHealthCard - Display health status information
 */
export function ServiceHealthCard({ health }: ServiceHealthCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Health Status
        </Typography>

        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <ServiceStatusBadge status={health.status} size="medium" />
            {health.lastCheckedAt && (
              <Typography variant="body2" color="text.secondary">
                {timeAgo(health.lastCheckedAt)}
              </Typography>
            )}
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Last Checked
            </Typography>
            <Typography variant="body2">{formatDateTime(health.lastCheckedAt)}</Typography>
          </Box>

          {health.lastSuccessAt && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Last Success
              </Typography>
              <Typography variant="body2">{formatDateTime(health.lastSuccessAt)}</Typography>
            </Box>
          )}

          {health.lastFailureAt && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Last Failure
              </Typography>
              <Typography variant="body2">{formatDateTime(health.lastFailureAt)}</Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
