'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Icons,
  Tooltip,
  Typography,
} from '@assetforce/material';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

import { useExchangeHealth, useSubgraphList, useSubgraphMutations } from '../hooks/useSubgraphs';
import { SubgraphList } from './SubgraphList';
import { SubgraphRegisterDialog } from './SubgraphRegisterDialog';

/**
 * Statistics card component
 */
const StatCard: FC<{ label: string; value: number | string; color?: string }> = ({
  label,
  value,
  color = 'text.primary',
}) => (
  <Card variant="outlined">
    <CardContent sx={{ textAlign: 'center', py: 2, '&:last-child': { pb: 2 } }}>
      <Typography variant="h4" color={color} fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </CardContent>
  </Card>
);

/**
 * Main page for managing subgraphs
 */
export const SubgraphsPage: FC = () => {
  const router = useRouter();
  const [registerOpen, setRegisterOpen] = useState(false);

  const { subgraphs, total, loading, error, refetch } = useSubgraphList();
  const { health, loading: healthLoading } = useExchangeHealth();
  const { register, activate, deactivate, remove, refreshSchema, registering, mutating } = useSubgraphMutations(
    refetch
  );

  const handleViewDetail = useCallback(
    (name: string) => {
      router.push(`/exchange/subgraphs/${name}`);
    },
    [router]
  );

  const handleRegister = useCallback(async (input: Parameters<typeof register>[0]) => {
    await register(input);
    setRegisterOpen(false);
  }, [register]);

  const handleRemove = useCallback(
    async (name: string) => {
      if (window.confirm(`Are you sure you want to remove subgraph "${name}"? This action cannot be undone.`)) {
        await remove(name);
      }
    },
    [remove]
  );

  if (loading && subgraphs.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load subgraphs: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Subgraphs
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={() => refetch()} disabled={mutating}>
              <Icons.Refresh />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<Icons.Add />} onClick={() => setRegisterOpen(true)}>
            Register
          </Button>
        </Box>
      </Box>

      {/* Health Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard
            label="Gateway Status"
            value={healthLoading ? '...' : health?.status || 'Unknown'}
            color={health?.status === 'OK' ? 'success.main' : 'warning.main'}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Active" value={health?.activeSubgraphs ?? 0} color="success.main" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Total" value={health?.totalSubgraphs ?? total} color="primary.main" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard
            label="Unhealthy"
            value={health?.unhealthySubgraphs?.length ?? 0}
            color={health?.unhealthySubgraphs?.length ? 'error.main' : 'text.secondary'}
          />
        </Grid>
      </Grid>

      {/* Unhealthy warning */}
      {health?.unhealthySubgraphs && health.unhealthySubgraphs.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Unhealthy subgraphs: {health.unhealthySubgraphs.join(', ')}
        </Alert>
      )}

      {/* Subgraph List */}
      <SubgraphList
        subgraphs={subgraphs}
        loading={loading || mutating}
        onActivate={activate}
        onDeactivate={deactivate}
        onRefreshSchema={refreshSchema}
        onRemove={handleRemove}
        onViewDetail={handleViewDetail}
        onRegister={() => setRegisterOpen(true)}
      />

      {/* Register Dialog */}
      <SubgraphRegisterDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSubmit={handleRegister}
        loading={registering}
      />
    </Box>
  );
};
