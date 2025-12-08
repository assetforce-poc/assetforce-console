'use client';

import { Box, Button, Container, Grid, Icons, Paper, Typography } from '@assetforce/material';
import Link from 'next/link';

export default function Home() {
  // TODO: Re-enable user stats after feature/user module is properly implemented
  const stats = [
    { title: 'Total Users', value: '-', icon: Icons.People, href: '/users' },
    { title: 'Active', value: '-', icon: Icons.CheckCircle, href: '/users' },
    { title: 'Pending Verification', value: '-', icon: Icons.HourglassEmpty, href: '/users' },
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
                  <Typography variant="h5">{stat.value}</Typography>
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
