'use client';

import {
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@assetforce/material';

import { ServiceStatusBadge } from '../../list/components/ServiceStatusBadge';
import type { Environment, HealthStatus, ProbeApprovalStatus } from '../types';

const ENV_COLORS: Record<string, 'success' | 'warning' | 'info' | 'default'> = {
  PRODUCTION: 'success',
  TESTING: 'warning',
  DEVELOPMENT: 'info',
};

const ZONE_COLORS: Record<string, 'primary' | 'secondary' | 'default'> = {
  cosmos: 'primary',
  galaxy: 'secondary',
  stellar: 'default',
};

/** Instance summary for display (subset of ServiceInstance fields) */
interface InstanceSummary {
  id: string;
  key: string;
  zone: string;
  environment: Environment;
  baseUrl: string;
  endpoint: {
    graphql?: { endpoint?: string | null; priority: number } | null;
    rest?: { basePath?: string | null; priority: number } | null;
    grpc?: { address?: string | null; priority: number } | null;
  };
  health: {
    enabled: boolean;
    lastStatus: HealthStatus;
    lastCheckedAt?: string | null;
    lastFailureReason?: string | null;
  };
  probeApprovalStatus: ProbeApprovalStatus;
}

export interface ServiceInstancesTableProps {
  instances: InstanceSummary[];
}

/**
 * ServiceInstancesTable - Display service instances
 */
export function ServiceInstancesTable({ instances }: ServiceInstancesTableProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Instances
        </Typography>

        {instances.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No instances registered
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Zone</TableCell>
                  <TableCell>Environment</TableCell>
                  <TableCell>Key</TableCell>
                  <TableCell>Base URL</TableCell>
                  <TableCell>Endpoints</TableCell>
                  <TableCell>Health</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {instances.map((instance) => (
                  <TableRow key={instance.id}>
                    <TableCell>
                      <Chip
                        label={instance.zone.toUpperCase()}
                        size="small"
                        color={ZONE_COLORS[instance.zone] ?? 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={instance.environment}
                        size="small"
                        color={ENV_COLORS[instance.environment] ?? 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {instance.key}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {instance.baseUrl}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        {instance.endpoint.graphql?.endpoint && (
                          <Chip
                            label={`GraphQL (P${instance.endpoint.graphql.priority})`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {instance.endpoint.rest?.basePath && (
                          <Chip
                            label={`REST (P${instance.endpoint.rest.priority})`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {instance.endpoint.grpc?.address && (
                          <Chip
                            label={`gRPC (P${instance.endpoint.grpc.priority})`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <ServiceStatusBadge status={instance.health.lastStatus} />
                    </TableCell>
                    <TableCell>
                      {!instance.health.enabled ? (
                        <Chip label="DISABLED" size="small" color="default" />
                      ) : instance.probeApprovalStatus === 'PENDING' ? (
                        <Chip label="PENDING" size="small" color="warning" />
                      ) : instance.probeApprovalStatus === 'APPROVED' ? (
                        <Chip label="ACTIVE" size="small" color="success" />
                      ) : (
                        <Chip label={instance.probeApprovalStatus} size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
