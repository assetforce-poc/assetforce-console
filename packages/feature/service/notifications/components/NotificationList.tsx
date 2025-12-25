'use client';

import {
  Box,
  Button,
  Checkbox,
  Chip,
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
import { useCallback, useState } from 'react';

import type { SchemaChangeNotification } from '../types';
import { SeverityBadge } from './SeverityBadge';

interface NotificationListProps {
  notifications: SchemaChangeNotification[];
  loading?: boolean;
  onAcknowledge?: (ids: string[]) => Promise<void>;
  acknowledging?: boolean;
}

/**
 * Format date for display
 */
function formatDate(date: string | null | undefined): string {
  if (!date) return '-';
  return new Date(date).toLocaleString();
}

/**
 * Format time ago
 */
function formatTimeAgo(date: string | null | undefined): string {
  if (!date) return '-';
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

/**
 * Table component for displaying notifications
 */
export const NotificationList: FC<NotificationListProps> = ({
  notifications,
  loading,
  onAcknowledge,
  acknowledging,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === notifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(notifications.map((n) => n.id)));
    }
  }, [notifications, selectedIds]);

  const handleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleAcknowledgeSelected = useCallback(async () => {
    if (onAcknowledge && selectedIds.size > 0) {
      await onAcknowledge(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  }, [onAcknowledge, selectedIds]);

  const unacknowledged = notifications.filter((n) => !n.acknowledged);

  if (notifications.length === 0 && !loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Icons.CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This service has no schema change notifications. You're all caught up!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Bulk actions */}
      {unacknowledged.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {unacknowledged.length} unacknowledged notification{unacknowledged.length !== 1 ? 's' : ''}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {selectedIds.size > 0 && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleAcknowledgeSelected}
                disabled={acknowledging}
                startIcon={<Icons.Check />}
              >
                Acknowledge Selected ({selectedIds.size})
              </Button>
            )}
          </Box>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedIds.size > 0 && selectedIds.size < notifications.length}
                  checked={selectedIds.size === notifications.length && notifications.length > 0}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Summary</TableCell>
              <TableCell>Contract</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Detected</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow
                key={notification.id}
                hover
                sx={{
                  opacity: notification.acknowledged ? 0.6 : 1,
                  bgcolor: notification.acknowledged ? 'action.hover' : 'inherit',
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.has(notification.id)}
                    onChange={() => handleSelect(notification.id)}
                    disabled={notification.acknowledged}
                  />
                </TableCell>
                <TableCell>
                  <SeverityBadge severity={notification.schemaChange?.severity || 'PATCH'} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 300 }}>
                    {notification.summary}
                  </Typography>
                  {notification.schemaChange?.diffSummary && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {notification.schemaChange.diffSummary}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {notification.contract}
                  </Typography>
                </TableCell>
                <TableCell>{notification.source}</TableCell>
                <TableCell>
                  <Tooltip title={formatDate(notification.detectedAt)}>
                    <Typography variant="body2">{formatTimeAgo(notification.detectedAt)}</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {notification.acknowledged ? (
                    <Chip label="Acknowledged" size="small" color="default" />
                  ) : (
                    <Chip label="New" size="small" color="primary" />
                  )}
                </TableCell>
                <TableCell align="right">
                  {!notification.acknowledged && onAcknowledge && (
                    <Tooltip title="Acknowledge">
                      <IconButton
                        size="small"
                        onClick={() => onAcknowledge([notification.id])}
                        disabled={acknowledging}
                      >
                        <Icons.Check />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
