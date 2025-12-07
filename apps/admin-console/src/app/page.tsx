'use client';

import { Box, Button, CircularProgress, Container, Grid, Icons, Paper, Typography } from '@assetforce/material';
import { useUsers } from '@assetforce/user';
import Link from 'next/link';

const DEFAULT_REALM_ID = 'assetforce-test';

export default function Home() {
  const { users, loading } = useUsers({ realmId: DEFAULT_REALM_ID });

  const activeUsers = users.filter((u) => u.status === 'ACTIVE').length;
  const pendingUsers = users.filter((u) => !u.isVerified).length;

  const stats = [
    { title: 'Total Users', value: loading ? null : users.length, icon: Icons.People, href: '/users' },
    { title: 'Active', value: loading ? null : activeUsers, icon: Icons.CheckCircle, href: '/users' },
    { title: 'Pending Verification', value: loading ? null : pendingUsers, icon: Icons.HourglassEmpty, href: '/users' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AssetForce Admin Console
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage users, roles, and tenants
        </Typography>

        <Grid container spacing={3}>
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
                  <Typography variant="h5">
                    {stat.value === null ? <CircularProgress size={24} /> : stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Button component={Link} href="/users" variant="contained" startIcon={<Icons.People />}>
            Manage Users
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
