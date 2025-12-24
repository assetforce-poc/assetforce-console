'use client';

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Icons,
  Paper,
  Tooltip,
  Typography,
} from '@assetforce/material';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useCallback } from 'react';

import { useDependencies } from '../hooks/useDependencies';
import type { GraphEdge, GraphNode } from '../types';
import { DependencyGraph } from './DependencyGraph';

interface DependenciesPageProps {
  serviceId: string;
  serviceName?: string;
}

/**
 * Statistics card component
 */
const StatCard: FC<{ label: string; value: number; color?: string }> = ({ label, value, color = 'text.primary' }) => (
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
 * Dependencies page component
 * Shows the dependency graph for a service with statistics
 */
export const DependenciesPage: FC<DependenciesPageProps> = ({ serviceId, serviceName }) => {
  const router = useRouter();
  const { graphData, providesCount, consumesCount, totalNodes, loading, error, refetch } = useDependencies({
    serviceId,
  });

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      // Navigate to the clicked service's detail page
      if (node.slug && node.type !== 'current') {
        router.push(`/services/${node.slug}`);
      }
    },
    [router]
  );

  const handleEdgeClick = useCallback((edge: GraphEdge) => {
    // Could navigate to contract detail or show a dialog
    console.log('Edge clicked:', edge);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load dependency graph: {error.message}
      </Alert>
    );
  }

  const hasNoDependencies = providesCount === 0 && consumesCount === 0;

  return (
    <Box>
      {/* Header with refresh button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Dependency Graph {serviceName && `- ${serviceName}`}
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={() => refetch()} size="small">
            <Icons.Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Provides" value={providesCount} color="success.main" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Consumes" value={consumesCount} color="warning.main" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Connected Services" value={Math.max(0, totalNodes - 1)} color="primary.main" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Total Contracts" value={graphData.edges.length} color="info.main" />
        </Grid>
      </Grid>

      {/* Graph visualization */}
      <Paper sx={{ p: 2 }}>
        {hasNoDependencies ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Dependencies Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This service has no declared contracts (PROVIDES or CONSUMES).
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Add contracts in the Contracts tab to see dependency relationships.
            </Typography>
          </Box>
        ) : (
          <>
            <DependencyGraph data={graphData} onNodeClick={handleNodeClick} onEdgeClick={handleEdgeClick} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
              Click on a service node to navigate to its detail page
            </Typography>
          </>
        )}
      </Paper>

      {/* Legend explanation */}
      {!hasNoDependencies && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>PROVIDES</strong>: Contracts this service provides that other services consume (green arrows
            pointing outward)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>CONSUMES</strong>: Contracts this service consumes from other providers (orange arrows pointing
            inward)
          </Typography>
        </Box>
      )}
    </Box>
  );
};
