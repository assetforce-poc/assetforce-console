'use client';

import { Container, Typography, Box, Paper, Grid2 } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import BusinessIcon from '@mui/icons-material/Business';

const stats = [
  { title: 'Users', value: '—', icon: PeopleIcon },
  { title: 'Roles', value: '—', icon: SecurityIcon },
  { title: 'Tenants', value: '—', icon: BusinessIcon },
];

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AssetForce Admin Console
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage users, roles, and tenants
        </Typography>

        <Grid2 container spacing={3}>
          {stats.map((stat) => (
            <Grid2 size={{ xs: 12, sm: 4 }} key={stat.title}>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <stat.icon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h5">{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Paper>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Container>
  );
}
