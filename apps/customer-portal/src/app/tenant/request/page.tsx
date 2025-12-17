'use client';

import { withAuth } from '@assetforce/auth';
import {
  TenantApplicationList,
  TenantMembershipList,
  TenantSearchForm,
  useTenantMembership,
} from '@assetforce/auth-ui';
import { ApolloClientProvider } from '@assetforce/graphql/provider';
import { Alert, Container, Stack, Typography } from '@assetforce/material';

function TenantRequestPageContent() {
  const {
    // Data
    myTenants,
    pendingApplications,
    availableTenants,
    globalCooldown,
    cooldownByTenantId,
    // Loading states
    isLoadingMine,
    isLoadingApplications,
    isLoadingAvailable,
    isApplying,
    isCancelling,
    isLeaving,
    // Error
    error,
    // Search
    search,
    setSearch,
    hasMore,
    loadMore,
    // Actions
    apply,
    cancel,
    leave,
  } = useTenantMembership();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Organization Management
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {globalCooldown && !globalCooldown.canApply && (
          <Alert severity="warning">
            Cooldown active: {globalCooldown.reason}
            {globalCooldown.until ? ` (until ${globalCooldown.until})` : null}
          </Alert>
        )}

        <TenantMembershipList tenants={myTenants} loading={isLoadingMine} onLeave={leave} leaveDisabled={isLeaving} />

        <TenantApplicationList
          applications={pendingApplications}
          loading={isLoadingApplications}
          onCancel={cancel}
          cancelDisabled={isCancelling}
        />

        <TenantSearchForm
          search={search}
          onSearchChange={setSearch}
          tenants={availableTenants}
          loading={isLoadingAvailable}
          globalCooldown={globalCooldown}
          cooldownByTenantId={cooldownByTenantId}
          onApply={apply}
          applyLoading={isApplying}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
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
export default withAuth(TenantRequestPage) as typeof TenantRequestPage;
