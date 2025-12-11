'use client';

import { Card, CardContent, CardHeader, Chip, DataGrid, type GridColDef, Typography } from '@assetforce/material';

import type { AccountSession } from '../types';

type SessionInfo = AccountSession;

/**
 * Format timestamp for display
 * Uses YYYY/MM/DD HH:mm format
 */
function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  return date
    .toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(',', '');
}

export interface SessionHistoryCardProps {
  sessions: AccountSession[];
}

/**
 * SessionHistoryCard - Display account session history using DataGrid
 *
 * Shows all active and past sessions with IP address, user agent, and timestamps.
 *
 * @example
 * ```tsx
 * <SessionHistoryCard sessions={account.sessions} />
 * ```
 */
export function SessionHistoryCard({ sessions }: SessionHistoryCardProps) {
  const columns: GridColDef<SessionInfo>[] = [
    {
      field: 'start',
      headerName: 'Start Time',
      width: 160,
      valueGetter: (value) => (value ? formatTimestamp(value) : 'N/A'),
    },
    {
      field: 'lastAccess',
      headerName: 'Last Access',
      width: 160,
      valueGetter: (value) => formatTimestamp(value),
    },
    {
      field: 'ipAddress',
      headerName: 'IP Address',
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.value || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'userAgent',
      headerName: 'User Agent',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={params.value || 'N/A'}
        >
          {params.value || 'N/A'}
        </Typography>
      ),
    },
  ];

  if (sessions.length === 0) {
    return (
      <Card data-testid="session-history-card">
        <CardHeader title="Session History" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No sessions found for this account.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="session-history-card">
      <CardHeader title="Session History" subheader={`${sessions.length} session${sessions.length === 1 ? '' : 's'}`} />
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <DataGrid
          rows={sessions}
          columns={columns}
          autoHeight
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
            sorting: {
              sortModel: [{ field: 'lastAccess', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
