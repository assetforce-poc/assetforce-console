'use client';

import { useAuth } from '@assetforce/auth/react';
import { Box, Button, Chip, Container, Grid, Icons, Paper, Typography } from '@assetforce/material';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, isLoading, user, tenant, signOut } = useAuth();

  // TODO: Re-enable user stats after feature/user module is properly implemented
  const stats = [
    { title: 'Total Users', value: '-', icon: Icons.People, href: '/users' },
    { title: 'Accounts', value: '-', icon: Icons.ManageAccounts, href: '/accounts' },
    { title: 'Services', value: '-', icon: Icons.Hub, href: '/services' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Auth Status Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              AssetForce Admin Console
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage users, roles, and tenants
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isLoading ? (
              <Typography variant="body2" color="text.secondary">
                Loading...
              </Typography>
            ) : isAuthenticated ? (
              <>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2">{user?.name || user?.email || user?.id}</Typography>
                  {tenant && <Chip label={tenant.name || tenant.id} size="small" sx={{ mt: 0.5 }} />}
                </Box>
                <Button variant="outlined" size="small" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button component={Link} href="/login" variant="contained" size="small">
                Sign In
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {stats.map((stat) => (
            <Grid size={{ xs: 12, sm: 4 }} key={stat.title}>
              <Paper
                component={Link}
                href={stat.href}
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  textDecoration: 'none',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <stat.icon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h5">{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button component={Link} href="/users" variant="contained" startIcon={<Icons.People />}>
            Manage Users
          </Button>
          <Button component={Link} href="/accounts" variant="outlined" startIcon={<Icons.ManageAccounts />}>
            Manage Accounts
          </Button>
          <Button component={Link} href="/services" variant="outlined" startIcon={<Icons.Hub />}>
            View Services
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
