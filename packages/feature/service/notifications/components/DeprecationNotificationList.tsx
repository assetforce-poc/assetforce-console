'use client';

import {
  Box,
  Button,
  Checkbox,
  Chip,
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

import type { ContractDeprecationNotification } from '../deprecation-types';

interface DeprecationNotificationListProps {
  notifications: ContractDeprecationNotification[];
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
 * Table component for displaying deprecation notifications
 */
export const DeprecationNotificationList: FC<DeprecationNotificationListProps> = ({
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
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Icons.CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No Deprecation Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You have no contract deprecation notifications at this time.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Action Bar */}
      {unacknowledged.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {selectedIds.size > 0 ? `${selectedIds.size} selected` : `${unacknowledged.length} unacknowledged`}
          </Typography>

          <Button
            variant="contained"
            size="small"
            disabled={selectedIds.size === 0 || acknowledging}
            onClick={handleAcknowledgeSelected}
            startIcon={acknowledging ? <Icons.HourglassEmpty /> : <Icons.Check />}
          >
            {acknowledging ? 'Acknowledging...' : 'Acknowledge Selected'}
          </Button>
        </Box>
      )}

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedIds.size > 0 && selectedIds.size < notifications.length}
                  checked={selectedIds.size === notifications.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Contract</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Since</TableCell>
              <TableCell>Alternative</TableCell>
              <TableCell>Removal</TableCell>
              <TableCell>Received</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow
                key={notification.id}
                sx={{
                  '&:hover': { bgcolor: 'action.hover' },
                  bgcolor: notification.acknowledged ? 'action.selected' : 'inherit',
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={selectedIds.has(notification.id)} onChange={() => handleSelect(notification.id)} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {notification.acknowledged ? (
                      <Tooltip
                        title={`Acknowledged by ${notification.acknowledgedBy || 'Unknown'} at ${formatDate(notification.acknowledgedAt)}`}
                      >
                        <Chip label="ACKNOWLEDGED" size="small" color="success" icon={<Icons.CheckCircle />} />
                      </Tooltip>
                    ) : (
                      <Chip label="NEW" size="small" color="warning" icon={<Icons.Notifications />} />
                    )}
                    {notification.removalVersion && (
                      <Tooltip title={`Will be removed in ${notification.removalVersion}`}>
                        <Chip label="URGENT" size="small" color="error" icon={<Icons.Warning />} />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title={notification.contractIdentifier}>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      <Box component="span" sx={{ fontFamily: 'monospace' }}>
                        {notification.contractIdentifier}
                      </Box>
                    </Typography>
                  </Tooltip>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Contract ID: {notification.contractId.substring(0, 8)}...
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title={notification.reason || 'No reason provided'}>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {notification.reason || '-'}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip label={notification.sinceVersion || 'Unknown'} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  {notification.alternative ? (
                    <Tooltip title={`Recommended: ${notification.alternative}`}>
                      <Chip
                        label={notification.alternative}
                        size="small"
                        color="info"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    </Tooltip>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {notification.removalVersion ? (
                    <Chip label={notification.removalVersion} size="small" color="error" variant="outlined" />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No planned removal
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title={formatDate(notification.createdAt)}>
                    <Typography variant="body2">{formatTimeAgo(notification.createdAt)}</Typography>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
