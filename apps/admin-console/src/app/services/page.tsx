'use client';

import { ServiceList } from '@assetforce/service/list';
import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { Box, Container, Typography } from '@assetforce/material';

/**
 * Services Page - Admin Console
 *
 * Display and manage registered services in the platform.
 * SGC (Service Governance Center) provides service registry and health monitoring.
 */
export default function ServicesPage() {
  return (
    <ApolloClientProvider endpoint="/api/graphql/sgc">
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Services
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage registered services in the platform
          </Typography>

          <ServiceList />
        </Box>
      </Container>
    </ApolloClientProvider>
  );
}
