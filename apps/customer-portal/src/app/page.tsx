'use client';

import { Box, Button, Container, Paper,Typography } from '@assetforce/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            AssetForce Customer Portal
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Welcome to the AssetForce Customer Portal
          </Typography>
          <Button component={Link} href="/auth/login" variant="contained" fullWidth size="large">
            Sign In
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
