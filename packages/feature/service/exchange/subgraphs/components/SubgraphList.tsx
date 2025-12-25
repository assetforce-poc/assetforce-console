'use client';

import {
  Box,
  Button,
  IconButton,
  Icons,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@assetforce/material';
import type { FC } from 'react';

import type { Subgraph } from '../types';
import { SubgraphStatusBadge } from './SubgraphStatusBadge';

interface SubgraphListProps {
  subgraphs: Subgraph[];
  loading?: boolean;
  onActivate?: (name: string) => void;
  onDeactivate?: (name: string) => void;
  onRefreshSchema?: (name: string) => void;
  onRemove?: (name: string) => void;
  onViewDetail?: (name: string) => void;
  onRegister?: () => void;
}

/**
 * Format date for display
 */
function formatDate(date: string | null | undefined): string {
  if (!date) return '-';
  return new Date(date).toLocaleString();
}

/**
 * Table component for displaying subgraphs
 */
export const SubgraphList: FC<SubgraphListProps> = ({
  subgraphs,
  loading,
  onActivate,
  onDeactivate,
  onRefreshSchema,
  onRemove,
  onViewDetail,
  onRegister,
}) => {
  if (subgraphs.length === 0 && !loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Subgraphs Registered
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Register a subgraph to start routing GraphQL traffic through the Service Exchange Portal.
        </Typography>
        {onRegister && (
          <Button variant="contained" onClick={onRegister} startIcon={<Icons.Add />}>
            Register Subgraph
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Display Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Endpoint</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Last Healthy</TableCell>
            <TableCell>Failures</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subgraphs.map((subgraph) => (
            <TableRow
              key={subgraph.id}
              hover
              sx={{ cursor: onViewDetail ? 'pointer' : 'default' }}
              onClick={() => onViewDetail?.(subgraph.name)}
            >
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {subgraph.name}
                </Typography>
              </TableCell>
              <TableCell>{subgraph.displayName || '-'}</TableCell>
              <TableCell>
                <SubgraphStatusBadge status={subgraph.status} />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {subgraph.graphqlUrl}
                </Typography>
              </TableCell>
              <TableCell>{subgraph.priority}</TableCell>
              <TableCell>{formatDate(subgraph.lastHealthyAt)}</TableCell>
              <TableCell>
                <Typography color={subgraph.failureCount > 0 ? 'error' : 'text.secondary'}>
                  {subgraph.failureCount}
                </Typography>
              </TableCell>
              <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                  {subgraph.status === 'ACTIVE' ? (
                    <Tooltip title="Deactivate">
                      <IconButton size="small" color="warning" onClick={() => onDeactivate?.(subgraph.name)}>
                        <Icons.Pause />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Activate">
                      <IconButton size="small" color="success" onClick={() => onActivate?.(subgraph.name)}>
                        <Icons.PlayArrow />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Refresh Schema">
                    <IconButton size="small" onClick={() => onRefreshSchema?.(subgraph.name)}>
                      <Icons.Refresh />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove">
                    <IconButton size="small" color="error" onClick={() => onRemove?.(subgraph.name)}>
                      <Icons.Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
