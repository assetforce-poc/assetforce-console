import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { Box, Breadcrumbs, Container, Typography } from '@assetforce/material';
import { SubgraphDetailPage } from '@assetforce/service/exchange/subgraphs';
import Link from 'next/link';

type SubgraphDetailPageProps = {
  params: Promise<{ name: string }>;
};

/**
 * Subgraph Detail Page - Admin Console
 *
 * Displays detailed information about a specific subgraph.
 */
export default async function Page({ params }: SubgraphDetailPageProps) {
  const { name } = await params;

  return (
    <ApolloClientProvider endpoint="/api/graphql/sgc">
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link href="/">Home</Link>
            <Link href="/exchange">Exchange</Link>
            <Link href="/exchange/subgraphs">Subgraphs</Link>
            <Typography component="span" color="text.primary">
              {name}
            </Typography>
          </Breadcrumbs>

          {/* Subgraph Detail Content */}
          <SubgraphDetailPage name={name} />
        </Box>
      </Container>
    </ApolloClientProvider>
  );
}
