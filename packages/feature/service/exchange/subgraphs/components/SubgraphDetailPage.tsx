'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Icons,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@assetforce/material';
import type { FC, SyntheticEvent } from 'react';
import { useCallback, useState } from 'react';

import { useSubgraph, useSubgraphMutations } from '../hooks/useSubgraphs';
import { SubgraphStatusBadge } from './SubgraphStatusBadge';

interface SubgraphDetailPageProps {
  name: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Info row component
 */
const InfoRow: FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <Box sx={{ display: 'flex', py: 1.5 }}>
    <Typography variant="body2" color="text.secondary" sx={{ width: 160, flexShrink: 0 }}>
      {label}
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

/**
 * Format date for display
 */
function formatDate(date: string | null | undefined): string {
  if (!date) return '-';
  return new Date(date).toLocaleString();
}

/**
 * Subgraph detail page with tabs
 */
export const SubgraphDetailPage: FC<SubgraphDetailPageProps> = ({ name }) => {
  const [tabValue, setTabValue] = useState(0);
  const { subgraph, loading, error, refetch } = useSubgraph(name);
  const { activate, deactivate, refreshSchema, activating, deactivating, refreshing, mutating } = useSubgraphMutations(
    refetch
  );

  const handleTabChange = useCallback((_event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
        Failed to load subgraph: {error.message}
      </Alert>
    );
  }

  if (!subgraph) {
    return <Alert severity="warning">Subgraph not found.</Alert>;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h5" component="h2">
              {subgraph.displayName || subgraph.name}
            </Typography>
            <SubgraphStatusBadge status={subgraph.status} size="medium" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {subgraph.graphqlUrl}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={() => refetch()} disabled={mutating}>
              <Icons.Refresh />
            </IconButton>
          </Tooltip>
          {subgraph.status === 'ACTIVE' ? (
            <Button
              variant="outlined"
              color="warning"
              startIcon={<Icons.Pause />}
              onClick={() => deactivate(name)}
              disabled={deactivating}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              startIcon={<Icons.PlayArrow />}
              onClick={() => activate(name)}
              disabled={activating}
            >
              Activate
            </Button>
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Schema" />
          <Tab label="Schema History" />
        </Tabs>
      </Paper>

      {/* Tab: Overview */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Basic Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <InfoRow label="Name" value={subgraph.name} />
                <InfoRow label="Display Name" value={subgraph.displayName || '-'} />
                <InfoRow label="GraphQL URL" value={subgraph.graphqlUrl} />
                <InfoRow label="Priority" value={subgraph.priority} />
              </CardContent>
            </Card>
          </Grid>

          {/* Health Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Health Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <InfoRow label="Status" value={<SubgraphStatusBadge status={subgraph.status} />} />
                <InfoRow label="Last Healthy" value={formatDate(subgraph.lastHealthyAt)} />
                <InfoRow
                  label="Failure Count"
                  value={
                    <Typography color={subgraph.failureCount > 0 ? 'error' : 'text.primary'}>
                      {subgraph.failureCount}
                    </Typography>
                  }
                />
                <InfoRow label="Schema Hash" value={subgraph.schemaHash || '-'} />
              </CardContent>
            </Card>
          </Grid>

          {/* Timestamps */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Timestamps
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoRow label="Created At" value={formatDate(subgraph.createdAt)} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoRow label="Updated At" value={formatDate(subgraph.updatedAt)} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab: Schema */}
      <TabPanel value={tabValue} index={1}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Current Schema</Typography>
              <Button
                variant="outlined"
                startIcon={<Icons.Refresh />}
                onClick={() => refreshSchema(name)}
                disabled={refreshing}
              >
                {refreshing ? 'Refreshing...' : 'Refresh Schema'}
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {subgraph.schemaHash ? (
              <>
                <InfoRow label="Schema Hash" value={subgraph.schemaHash} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Schema SDL is fetched on-demand. Click "Refresh Schema" to introspect the current schema.
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No schema has been fetched yet. Click "Refresh Schema" to introspect the subgraph.
              </Typography>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* Tab: Schema History */}
      <TabPanel value={tabValue} index={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Schema Change History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Schema change history is tracked automatically when schemas are refreshed. Use the Schema Notifications
              feature to view breaking changes and their impact on consumers.
            </Typography>
            {/* TODO: Integrate with schema.changes() API */}
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
};
