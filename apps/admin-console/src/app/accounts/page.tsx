'use client';

import { AccountList } from '@assetforce/account/list';
import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { Box, Container, Typography } from '@assetforce/material';

/**
 * Accounts Page - Admin Console
 *
 * Display and manage user accounts (authentication identities).
 * Note: This is AAC Account management, not IMC Business User management.
 */
export default function AccountsPage() {
  return (
    <ApolloClientProvider endpoint="/api/graphql/aac">
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Accounts
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage user authentication accounts
          </Typography>

          <AccountList />
        </Box>
      </Container>
    </ApolloClientProvider>
  );
}
