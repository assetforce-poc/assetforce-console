import { AccountDetailPage } from '@assetforce/account/detail/components';
import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { Box, Breadcrumbs, Container, Typography } from '@assetforce/material';
import Link from 'next/link';

type AccountDetailPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Account Detail Page Route - Admin Console
 *
 * This is just the page router entry point.
 * All actual content is in @assetforce/account/detail/components
 */
export default async function Page({ params }: AccountDetailPageProps) {
  const { id } = await params;

  return (
    <ApolloClientProvider endpoint="/api/graphql/aac">
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link href="/accounts">Accounts</Link>
            <Typography component="span" color="text.primary">
              Account Detail
            </Typography>
          </Breadcrumbs>

          {/* Page Title */}
          <Typography variant="h4" component="h1" gutterBottom>
            Account Detail
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            View and manage account information
          </Typography>

          {/* Account Detail Content from Feature Package */}
          <AccountDetailPage accountId={id} />
        </Box>
      </Container>
    </ApolloClientProvider>
  );
}
