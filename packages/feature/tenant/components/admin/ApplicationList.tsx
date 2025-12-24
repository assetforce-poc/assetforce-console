'use client';

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import { useCallback } from 'react';

import { useApplications, useApproveApplication, useRejectApplication } from '../../hooks';
import type { ApplicationItem } from '../../hooks/operations';

interface ApplicationListProps {
  tenantId: string;
  onApplicationClick?: (application: ApplicationItem) => void;
}

const STATUS_COLORS: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
};

/**
 * List of tenant applications with actions.
 * Admin only.
 */
export const ApplicationList: FC<ApplicationListProps> = ({ tenantId, onApplicationClick }) => {
  const { data, loading, error, refetch } = useApplications({
    tenantId,
  });

  const { approve, loading: approving } = useApproveApplication();
  const { reject, loading: rejecting } = useRejectApplication();

  const handleApprove = useCallback(
    async (id: string) => {
      const result = await approve(id);
      if (result.success) {
        refetch();
      }
    },
    [approve, refetch]
  );

  const handleReject = useCallback(
    async (id: string) => {
      const result = await reject(id);
      if (result.success) {
        refetch();
      }
    },
    [reject, refetch]
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

  const formatApplicant = (application: ApplicationItem) => {
    // Display applicant name or email if available, otherwise show truncated subject
    if (application.applicant?.name) {
      return application.applicant.name;
    }
    if (application.applicant?.email) {
      return application.applicant.email;
    }
    return application.subject.substring(0, 8) + '...';
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
        Failed to load applications: {error.message}
      </Alert>
    );
  }

  const applications = data || [];

  if (applications.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="textSecondary">No applications found</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Applicant</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Applied At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application: ApplicationItem) => (
              <TableRow
                key={application.id}
                hover
                onClick={() => onApplicationClick?.(application)}
                sx={{ cursor: onApplicationClick ? 'pointer' : 'default' }}
              >
                <TableCell>
                  <Tooltip title={application.applicant?.email || application.subject}>
                    <span>{formatApplicant(application)}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    label={application.status}
                    color={STATUS_COLORS[application.status] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{application.message || '-'}</TableCell>
                <TableCell>{formatDate(application.createdAt)}</TableCell>
                <TableCell align="right">
                  {application.status === 'PENDING' && (
                    <>
                      <Tooltip title="Approve application">
                        <span>
                          <Button
                            size="small"
                            color="success"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(application.id);
                            }}
                            disabled={approving}
                          >
                            Approve
                          </Button>
                        </span>
                      </Tooltip>
                      <Tooltip title="Reject application">
                        <span>
                          <Button
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(application.id);
                            }}
                            disabled={rejecting}
                            sx={{ ml: 1 }}
                          >
                            Reject
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
    </Paper>
  );
};

export default ApplicationList;
