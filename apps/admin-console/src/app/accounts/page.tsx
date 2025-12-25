'use client';

import { AccountList } from '@assetforce/account/list';
import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { Box, Button, Container, Stack, Typography } from '@assetforce/material';
import Link from 'next/link';

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
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Accounts
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage user authentication accounts
              </Typography>
            </Box>
            <Button variant="contained" color="primary" component={Link} href="/accounts/new">
              Create User
            </Button>
          </Stack>

          <AccountList />
        </Box>
      </Container>
    </ApolloClientProvider>
  );
}
