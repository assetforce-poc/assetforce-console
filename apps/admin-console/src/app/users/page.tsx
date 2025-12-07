'use client';

import {
  Box,
  Button,
  Container,
  FormControl,
  Icons,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@assetforce/material';
import { UserList, useUsers } from '@assetforce/user';
import { useState } from 'react';

const DEFAULT_REALM_ID = 'assetforce-test';

export default function UsersPage() {
  const [realmId, setRealmId] = useState(DEFAULT_REALM_ID);
  const { users, loading, error, refetch } = useUsers({ realmId });

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Users
          </Typography>
          <Button variant="outlined" startIcon={<Icons.Refresh />} onClick={() => refetch()}>
            Refresh
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Realm</InputLabel>
            <Select value={realmId} label="Realm" onChange={(e) => setRealmId(e.target.value)}>
              <MenuItem value="assetforce-test">assetforce-test</MenuItem>
              <MenuItem value="assetforce-demo">assetforce-demo</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            Error: {error.message}
          </Typography>
        )}

        <UserList users={users} loading={loading} />
      </Box>
    </Container>
  );
}
