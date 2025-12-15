'use client';

import { withAuth } from '@assetforce/auth';
import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { gql, useLazyQuery, useMutation, useQuery } from '@assetforce/graphql';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@assetforce/material';
import { useEffect, useMemo, useState } from 'react';

type Tenant = {
  id: string;
  name: string;
  displayName?: string | null;
};

type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

type Application = {
  id: string;
  tenant: Tenant;
  status: ApplicationStatus;
  message?: string | null;
  createdAt: string;
  updatedAt: string;
};

type TenantConnection = {
  items: Tenant[];
  total: number;
  hasMore: boolean;
};

type CooldownStatus = {
  canApply: boolean;
  until?: string | null;
  reason?: string | null;
};

const TENANT_MINE = gql`
  query TenantMine {
    tenant {
      mine {
        id
        name
        displayName
      }
    }
  }
`;

const TENANT_APPLICATIONS = gql`
  query TenantApplications {
    tenant {
      applications {
        id
        status
        message
        createdAt
        updatedAt
        tenant {
          id
          name
          displayName
        }
      }
    }
  }
`;

const TENANT_AVAILABLE = gql`
  query TenantAvailable($input: TenantAvailableInput!) {
    tenant {
      available(input: $input) {
        items {
          id
          name
          displayName
        }
        total
        hasMore
      }
    }
  }
`;

const TENANT_COOLDOWN = gql`
  query TenantCooldown($input: TenantCooldownInput) {
    tenant {
      cooldown(input: $input) {
        canApply
        until
        reason
      }
    }
  }
`;

const TENANT_APPLY = gql`
  mutation TenantApply($input: TenantApplyInput!) {
    tenant {
      users {
        apply(input: $input) {
          success
          message
          application {
            id
            status
            tenant {
              id
              name
              displayName
            }
          }
        }
      }
    }
  }
`;

const TENANT_CANCEL = gql`
  mutation TenantCancel($input: TenantCancelInput!) {
    tenant {
      users {
        cancel(input: $input) {
          success
          message
        }
      }
    }
  }
`;

const TENANT_LEAVE = gql`
  mutation TenantLeave($input: TenantLeaveInput!) {
    tenant {
      users {
        leave(input: $input) {
          success
          message
        }
      }
    }
  }
`;

function TenantRequestPageContent() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [applyTenant, setApplyTenant] = useState<Tenant | null>(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [cooldownByTenantId, setCooldownByTenantId] = useState<Record<string, CooldownStatus>>({});

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(handle);
  }, [search]);

  const mineQuery = useQuery<{ tenant: { mine: Tenant[] } }>(TENANT_MINE);
  const appsQuery = useQuery<{ tenant: { applications: Application[] } }>(TENANT_APPLICATIONS);
  const cooldownQuery = useQuery<{ tenant: { cooldown: CooldownStatus } }>(TENANT_COOLDOWN, {
    variables: { input: null },
  });

  const limit = 20;
  const availableQueryVariables = useMemo(
    () => ({
      input: {
        search: debouncedSearch || null,
        limit,
        offset: 0,
      },
    }),
    [debouncedSearch]
  );

  const availableQuery = useQuery<{ tenant: { available: TenantConnection } }, { input: { search?: string | null; limit: number; offset: number } }>(
    TENANT_AVAILABLE,
    {
      variables: availableQueryVariables,
      skip: debouncedSearch.length === 0,
    }
  );

  const pendingApplications = (appsQuery.data?.tenant.applications ?? []).filter((a) => a.status === 'PENDING');
  const cooldown = cooldownQuery.data?.tenant.cooldown;
  const availableItems = availableQuery.data?.tenant.available.items ?? [];

  const [fetchTenantCooldown] = useLazyQuery<{ tenant: { cooldown: CooldownStatus } }, { input: { tenantId: string } }>(
    TENANT_COOLDOWN
  );

  useEffect(() => {
    if (availableItems.length === 0) return;

    const missing = availableItems.filter((t) => cooldownByTenantId[t.id] === undefined);
    if (missing.length === 0) return;

    missing.forEach((t) => {
      fetchTenantCooldown({ variables: { input: { tenantId: t.id } } })
        .then((result) => {
          const status = result.data?.tenant.cooldown ?? { canApply: true };
          setCooldownByTenantId((prev) => ({ ...prev, [t.id]: status }));
        })
        .catch(() => {
          setCooldownByTenantId((prev) => ({ ...prev, [t.id]: { canApply: true } }));
        });
    });
  }, [availableItems, cooldownByTenantId, fetchTenantCooldown]);

  const [applyMutation, applyMutationState] = useMutation<
    { tenant: { users: { apply: { success: boolean; message?: string | null } } } },
    { input: { tenantId: string; message?: string | null } }
  >(TENANT_APPLY);

  const [cancelMutation, cancelMutationState] = useMutation<
    { tenant: { users: { cancel: { success: boolean; message?: string | null } } } },
    { input: { id: string } }
  >(TENANT_CANCEL);

  const [leaveMutation, leaveMutationState] = useMutation<
    { tenant: { users: { leave: { success: boolean; message?: string | null } } } },
    { input: { tenantId: string } }
  >(TENANT_LEAVE);

  const refetchAll = async () => {
    await Promise.all([mineQuery.refetch(), appsQuery.refetch(), cooldownQuery.refetch()]);
    if (debouncedSearch.length > 0) {
      await availableQuery.refetch();
    }
  };

  const onApply = async () => {
    if (!applyTenant) return;
    setActionError(null);

    const result = await applyMutation({
      variables: { input: { tenantId: applyTenant.id, message: applyMessage || null } },
    });

    const apply = result.data?.tenant.users.apply;
    if (!apply?.success) {
      setActionError(apply?.message || 'Apply failed');
      return;
    }

    setApplyTenant(null);
    setApplyMessage('');
    await refetchAll();
  };

  const onCancel = async (applicationId: string) => {
    setActionError(null);
    const result = await cancelMutation({ variables: { input: { id: applicationId } } });
    const cancel = result.data?.tenant.users.cancel;
    if (!cancel?.success) {
      setActionError(cancel?.message || 'Cancel failed');
      return;
    }
    await refetchAll();
  };

  const onLeave = async (tenantId: string) => {
    setActionError(null);
    const result = await leaveMutation({ variables: { input: { tenantId } } });
    const leave = result.data?.tenant.users.leave;
    if (!leave?.success) {
      setActionError(leave?.message || 'Leave failed');
      return;
    }
    await refetchAll();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Organization Management
        </Typography>

        {actionError ? <Alert severity="error">{actionError}</Alert> : null}

        {cooldown && !cooldown.canApply ? (
          <Alert severity="warning">
            Cooldown active: {cooldown.reason}
            {cooldown.until ? ` (until ${cooldown.until})` : null}
          </Alert>
        ) : null}

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6">My Organizations</Typography>
          <Divider sx={{ my: 2 }} />

          {mineQuery.loading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Loading...
              </Typography>
            </Stack>
          ) : null}

          {mineQuery.error ? <Alert severity="error">Failed to load organizations.</Alert> : null}

          <Stack spacing={1}>
            {(mineQuery.data?.tenant.mine ?? []).length === 0 && !mineQuery.loading ? (
              <Typography variant="body2" color="text.secondary">
                No organizations yet.
              </Typography>
            ) : null}

            {(mineQuery.data?.tenant.mine ?? []).map((t) => (
              <Paper key={t.id} variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="subtitle1">{t.displayName || t.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t.id}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => onLeave(t.id)}
                    disabled={leaveMutationState.loading}
                  >
                    Leave
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6">Pending Applications</Typography>
          <Divider sx={{ my: 2 }} />

          {appsQuery.loading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Loading...
              </Typography>
            </Stack>
          ) : null}

          {appsQuery.error ? <Alert severity="error">Failed to load applications.</Alert> : null}

          <Stack spacing={1}>
            {pendingApplications.length === 0 && !appsQuery.loading ? (
              <Typography variant="body2" color="text.secondary">
                No pending applications.
              </Typography>
            ) : null}

            {pendingApplications.map((a) => (
              <Paper key={a.id} variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="subtitle1">{a.tenant.displayName || a.tenant.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Submitted at {a.createdAt}
                    </Typography>
                    {a.message ? (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Message: {a.message}
                      </Typography>
                    ) : null}
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => onCancel(a.id)}
                    disabled={cancelMutationState.loading}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6">Join Other Organizations</Typography>
          <Divider sx={{ my: 2 }} />

          <TextField
            fullWidth
            label="Search organizations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to search..."
          />

          <Box sx={{ mt: 2 }}>
            {debouncedSearch.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Type a name to search.
              </Typography>
            ) : null}

            {availableQuery.loading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={18} />
                <Typography variant="body2" color="text.secondary">
                  Searching...
                </Typography>
              </Stack>
            ) : null}

            {availableQuery.error ? <Alert severity="error">Search failed.</Alert> : null}

            <Stack spacing={1} sx={{ mt: 2 }}>
              {availableItems.map((t) => {
                const tenantCooldown = cooldownByTenantId[t.id];
                const canApplyTenant = tenantCooldown ? tenantCooldown.canApply : true;

                return (
                <Paper key={t.id} variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Box>
                      <Typography variant="subtitle1">{t.displayName || t.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t.id}
                      </Typography>
                      {tenantCooldown && !tenantCooldown.canApply ? (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {tenantCooldown.reason}
                          {tenantCooldown.until ? ` (until ${tenantCooldown.until})` : null}
                        </Typography>
                      ) : null}
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => setApplyTenant(t)}
                      disabled={applyMutationState.loading || (cooldown ? !cooldown.canApply : false) || !canApplyTenant}
                    >
                      Apply
                    </Button>
                  </Stack>
                </Paper>
                );
              })}

              {availableQuery.data?.tenant.available.hasMore ? (
                <Button
                  variant="outlined"
                  disabled={availableQuery.loading}
                  onClick={() =>
                    availableQuery.fetchMore({
                      variables: {
                        input: {
                          search: debouncedSearch || null,
                          limit,
                          offset: (availableQuery.data?.tenant.available.items ?? []).length,
                        },
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        return {
                          tenant: {
                            ...prev.tenant,
                            available: {
                              ...fetchMoreResult.tenant.available,
                              items: [
                                ...prev.tenant.available.items,
                                ...fetchMoreResult.tenant.available.items,
                              ],
                            },
                          },
                        };
                      },
                    })
                  }
                >
                  Load more
                </Button>
              ) : null}
            </Stack>
          </Box>
        </Paper>

        <Dialog open={Boolean(applyTenant)} onClose={() => setApplyTenant(null)} fullWidth maxWidth="sm">
          <DialogTitle>Apply to join</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {applyTenant ? applyTenant.displayName || applyTenant.name : null}
            </Typography>
            <TextField
              fullWidth
              label="Message (optional)"
              value={applyMessage}
              onChange={(e) => setApplyMessage(e.target.value)}
              multiline
              minRows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApplyTenant(null)} disabled={applyMutationState.loading}>
              Cancel
            </Button>
            <Button variant="contained" onClick={onApply} disabled={applyMutationState.loading}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
}

function TenantRequestPage() {
  return (
    <ApolloClientProvider endpoint="/api/graphql/imc">
      <TenantRequestPageContent />
    </ApolloClientProvider>
  );
}

// Only needs auth guard (not tenant guard - this is the target page for no-tenant users)
// Type assertion to satisfy Next.js App Router page config
export default withAuth(TenantRequestPage) as typeof TenantRequestPage;
