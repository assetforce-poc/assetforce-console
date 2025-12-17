'use client';

import { Box, Card, CardContent, Chip, Link, Stack, Typography } from '@assetforce/material';

import type { Service } from '../types';

const LIFECYCLE_COLORS: Record<string, 'success' | 'warning' | 'info' | 'default' | 'error'> = {
  PRODUCTION: 'success',
  TESTING: 'warning',
  DEVELOPMENT: 'info',
  DEPRECATED: 'error',
};

export interface ServiceInfoCardProps {
  service: Pick<Service, 'displayName' | 'slug' | 'type' | 'lifecycle' | 'repoUrl' | 'docsUrl' | 'tags'>;
}

/**
 * ServiceInfoCard - Display basic service information
 */
export function ServiceInfoCard({ service }: ServiceInfoCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Service Info
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Display Name
            </Typography>
            <Typography variant="body1">{service.displayName}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Slug
            </Typography>
            <Typography variant="body1" fontFamily="monospace">
              {service.slug}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Type
            </Typography>
            <Box mt={0.5}>
              <Chip label={service.type} size="small" variant="outlined" />
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Lifecycle
            </Typography>
            <Box mt={0.5}>
              {service.lifecycle && (
                <Chip
                  label={service.lifecycle}
                  size="small"
                  color={LIFECYCLE_COLORS[service.lifecycle] ?? 'default'}
                />
              )}
            </Box>
          </Box>

          {service.repoUrl && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Repository
              </Typography>
              <Typography variant="body2">
                <Link href={service.repoUrl} target="_blank" rel="noopener noreferrer">
                  {service.repoUrl}
                </Link>
              </Typography>
            </Box>
          )}

          {service.docsUrl && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Documentation
              </Typography>
              <Typography variant="body2">
                <Link href={service.docsUrl} target="_blank" rel="noopener noreferrer">
                  {service.docsUrl}
                </Link>
              </Typography>
            </Box>
          )}

          {service.tags && service.tags.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Tags
              </Typography>
              <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap" useFlexGap>
                {service.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
