import { CreateUserForm } from '@assetforce/account/create';
import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { Box, Breadcrumbs, Container, Typography } from '@assetforce/material';
import Link from 'next/link';

/**
 * Create User Page Route - Admin Console
 *
 * Allows admins to create new user accounts with two provisioning methods:
 * - EMAIL: Send activation email (user sets own password)
 * - TEMPORARY: Set temporary password (user must change on first login)
 */
export default function CreateUserPage() {
  return (
    <ApolloClientProvider endpoint="/api/graphql/aac">
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link href="/accounts">Accounts</Link>
            <Typography component="span" color="text.primary">
              Create User
            </Typography>
          </Breadcrumbs>

          {/* Page Title */}
          <Typography variant="h4" component="h1" gutterBottom>
            Create New User
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create a new user account with activation email or temporary password
          </Typography>

          {/* Create User Form */}
          <CreateUserForm />
        </Box>
      </Container>
    </ApolloClientProvider>
  );
}
