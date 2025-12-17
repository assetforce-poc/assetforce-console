'use client';

import { Card, CardContent, Chip, Link as MuiLink, Stack, Typography } from '@assetforce/material';
import Link from 'next/link';

import type { ServiceDependency } from '../types';

export interface ServiceDependenciesCardProps {
  dependencies: ServiceDependency[];
}

/**
 * ServiceDependenciesCard - Display service dependencies
 */
export function ServiceDependenciesCard({ dependencies }: ServiceDependenciesCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Dependencies
        </Typography>

        {dependencies.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No dependencies declared
          </Typography>
        ) : (
          <Stack spacing={1}>
            {dependencies.map((dep) => (
              <Stack key={dep.target.id} direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2">→</Typography>
                <MuiLink component={Link} href={`/services/${dep.target.slug}`} underline="hover">
                  {dep.target.displayName}
                </MuiLink>
                {dep.critical && <Chip label="CRITICAL" size="small" color="error" />}
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
