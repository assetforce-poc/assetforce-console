import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { Box, Breadcrumbs, Container, Typography } from '@assetforce/material';
import Link from 'next/link';

import { ContractsPageWrapper } from './ContractsPageWrapper';

type ContractsPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Service Contracts Page Route - Admin Console
 *
 * Displays and manages service contracts (PROVIDES/CONSUMES) for a service.
 */
export default async function Page({ params }: ContractsPageProps) {
  const { slug } = await params;

  return (
    <ApolloClientProvider endpoint="/api/graphql/sgc">
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link href="/services">Services</Link>
            <Link href={`/services/${slug}`}>{slug}</Link>
            <Typography component="span" color="text.primary">
              Contracts
            </Typography>
          </Breadcrumbs>

          {/* Page Title */}
          <Typography variant="h4" component="h1" gutterBottom>
            Service Contracts
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage contracts (PROVIDES/CONSUMES) for this service
          </Typography>

          {/* Contracts Content */}
          <ContractsPageWrapper slug={slug} />
        </Box>
      </Container>
    </ApolloClientProvider>
  );
}
