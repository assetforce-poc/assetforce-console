'use client';

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@assetforce/material';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

import { useCancelInvite, useInvites, useResendInvite } from '../../hooks';
import type { InviteItem } from '../../hooks/operations';

interface InviteListProps {
  tenantId: string;
  onInviteClick?: (invite: InviteItem) => void;
}

const STATUS_COLORS: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  PENDING: 'warning',
  ACCEPTED: 'success',
  EXPIRED: 'error',
  CANCELLED: 'default',
};

/**
 * List of tenant invites with actions.
 * Admin only.
 */
export const InviteList: FC<InviteListProps> = ({ tenantId, onInviteClick }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, loading, error, refetch } = useInvites({
    tenantId,
    limit: rowsPerPage,
    offset: page * rowsPerPage,
  });

  const { cancel, loading: cancelling } = useCancelInvite();
  const { resend, loading: resending } = useResendInvite();

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleCancel = useCallback(
    async (id: string) => {
      const result = await cancel(id);
      if (result.success) {
        refetch();
      }
    },
    [cancel, refetch]
  );

  const handleResend = useCallback(
    async (id: string) => {
      const result = await resend(id);
      if (result.success) {
        refetch();
      }
    },
    [resend, refetch]
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !data) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load invites: {error.message}
      </Alert>
    );
  }

  const invites = data?.items || [];
  const total = data?.total || 0;

  if (invites.length === 0 && page === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="textSecondary">No invites found</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Invited By</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invites.map((invite: InviteItem) => (
              <TableRow
                key={invite.id}
                hover
                onClick={() => onInviteClick?.(invite)}
                sx={{ cursor: onInviteClick ? 'pointer' : 'default' }}
              >
                <TableCell>{invite.invitedEmail}</TableCell>
                <TableCell>{invite.role || 'member'}</TableCell>
                <TableCell>
                  <Chip label={invite.status} color={STATUS_COLORS[invite.status] || 'default'} size="small" />
                </TableCell>
                <TableCell>{invite.inviterEmail || '-'}</TableCell>
                <TableCell>{formatDate(invite.expiresAt)}</TableCell>
                <TableCell>{formatDate(invite.createdAt)}</TableCell>
                <TableCell align="right">
                  {invite.status === 'PENDING' && (
                    <>
                      <Tooltip title="Resend invite">
                        <span>
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResend(invite.id);
                            }}
                            disabled={resending}
                          >
                            Resend
                          </Button>
                        </span>
                      </Tooltip>
                      <Tooltip title="Cancel invite">
                        <span>
                          <Button
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancel(invite.id);
                            }}
                            disabled={cancelling}
                          >
                            Cancel
                          </Button>
                        </span>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default InviteList;
