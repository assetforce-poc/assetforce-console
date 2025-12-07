'use client';

import { Box, Typography } from '@assetforce/material';
import { DataGrid, type GridColDef } from '@assetforce/material';
import type { User } from '../types';
import { UserStatusChip } from './UserStatusChip';

interface UserListProps {
  users: User[];
  loading?: boolean;
}

const columns: GridColDef<User>[] = [
  {
    field: 'displayName',
    headerName: 'Name',
    flex: 1,
    minWidth: 150,
    valueGetter: (_, row) => row.profile.displayName,
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    minWidth: 200,
    valueGetter: (_, row) => row.profile.email,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => <UserStatusChip status={params.value} />,
  },
  {
    field: 'isVerified',
    headerName: 'Verified',
    width: 100,
    renderCell: (params) => (
      <Typography variant="body2" color={params.value ? 'success.main' : 'text.secondary'}>
        {params.value ? 'Yes' : 'No'}
      </Typography>
    ),
  },
  {
    field: 'userType',
    headerName: 'Type',
    width: 120,
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    width: 180,
    valueFormatter: (value: string) => new Date(value).toLocaleString(),
  },
];

export const UserList = ({ users, loading = false }: UserListProps) => {
  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={users}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.userId}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        disableRowSelectionOnClick
      />
    </Box>
  );
};
