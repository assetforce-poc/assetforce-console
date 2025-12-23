'use client';

import { TenantList } from '@assetforce/tenant';
import type { TenantItem } from '@assetforce/tenant';
import { Box, Container, Typography } from '@assetforce/material';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Tenants Page - Admin Console
 *
 * Display and manage tenants.
 */
export default function TenantsPage() {
  const router = useRouter();

  const handleTenantClick = useCallback(
    (tenant: TenantItem) => {
      router.push(`/tenants/${tenant.id}`);
    },
    [router]
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tenants
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage tenants and their members
        </Typography>

        <TenantList onTenantClick={handleTenantClick} />
      </Box>
    </Container>
  );
}
