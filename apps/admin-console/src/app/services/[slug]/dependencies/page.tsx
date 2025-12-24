import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { Box, Breadcrumbs, Container, Typography } from '@assetforce/material';
import Link from 'next/link';

import { DependenciesPageWrapper } from './DependenciesPageWrapper';

type DependenciesPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Service Dependencies Page Route - Admin Console
 *
 * Displays the dependency graph for a service showing:
 * - Contracts this service PROVIDES and who CONSUMES them
 * - Contracts this service CONSUMES and who PROVIDES them
 */
export default async function Page({ params }: DependenciesPageProps) {
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
              Dependencies
            </Typography>
          </Breadcrumbs>

          {/* Page Title */}
          <Typography variant="h4" component="h1" gutterBottom>
            Service Dependencies
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            View contract-based dependency relationships for this service
          </Typography>

          {/* Dependencies Content */}
          <DependenciesPageWrapper slug={slug} />
        </Box>
      </Container>
    </ApolloClientProvider>
  );
}
