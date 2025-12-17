'use client';

import {
  Card,
  CardContent,
  Chip,
  Paper,
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

/** Instance summary for display (subset of ServiceInstance fields) */
interface InstanceSummary {
  id: string;
  key: string;
  environment: Environment;
  baseUrl: string;
  enabled: boolean;
  probeApprovalStatus: ProbeApprovalStatus;
  lastStatus: HealthStatus;
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
                  <TableCell>Environment</TableCell>
                  <TableCell>Key</TableCell>
                  <TableCell>Base URL</TableCell>
                  <TableCell>Health</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {instances.map((instance) => (
                  <TableRow key={instance.id}>
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
                      <ServiceStatusBadge status={instance.lastStatus} />
                    </TableCell>
                    <TableCell>
                      {!instance.enabled ? (
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
