'use client';

import { Box, Container, Typography } from '@assetforce/material';

export default function UsersPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Users
        </Typography>
        <Typography variant="body1" color="text.secondary">
          User management feature is being refactored. Coming soon...
        </Typography>
        {/* TODO: Re-implement user list after GQL-001 completion */}
      </Box>
    </Container>
  );
}
