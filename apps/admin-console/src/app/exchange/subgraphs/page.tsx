import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { Box, Breadcrumbs, Container, Typography } from '@assetforce/material';
import { SubgraphsPage } from '@assetforce/service/exchange/subgraphs';
import Link from 'next/link';

/**
 * Subgraphs List Page - Admin Console
 *
 * Displays and manages subgraphs registered with Service Exchange Portal.
 */
export default function Page() {
  return (
    <ApolloClientProvider endpoint="/api/graphql/sgc">
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link href="/">Home</Link>
            <Link href="/exchange">Exchange</Link>
            <Typography component="span" color="text.primary">
              Subgraphs
            </Typography>
          </Breadcrumbs>

          {/* Page Title */}
          <Typography variant="h4" component="h1" gutterBottom>
            Service Exchange Portal
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage subgraphs registered with the GraphQL federation gateway
          </Typography>

          {/* Subgraphs Content */}
          <SubgraphsPage />
        </Box>
      </Container>
    </ApolloClientProvider>
  );
}
