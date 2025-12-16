'use client';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  type PaperProps,
} from '@assetforce/material';
import { useState } from 'react';

import type { CooldownStatus, Tenant } from '../../hooks/tenant/types';
import { TenantCard } from './TenantCard';

export interface TenantSearchFormProps extends Omit<PaperProps, 'children'> {
  /** Title of the section */
  title?: string;
  /** Search input value */
  search: string;
  /** Search input change handler */
  onSearchChange: (value: string) => void;
  /** List of available tenants */
  tenants: Tenant[];
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string | null;
  /** Global cooldown status */
  globalCooldown?: CooldownStatus | null;
  /** Per-tenant cooldown status */
  cooldownByTenantId?: Record<string, CooldownStatus>;
  /** Apply handler */
  onApply: (tenantId: string, message?: string) => void;
  /** Whether apply is in progress */
  applyLoading?: boolean;
  /** Whether there are more results */
  hasMore?: boolean;
  /** Load more handler */
  onLoadMore?: () => void;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Empty search message */
  emptySearchMessage?: string;
  /** No results message */
  noResultsMessage?: string;
  /** Apply button label */
  applyLabel?: string;
  /** Load more button label */
  loadMoreLabel?: string;
  /** Dialog title */
  dialogTitle?: string;
  /** Dialog message label */
  dialogMessageLabel?: string;
  /** Dialog cancel label */
  dialogCancelLabel?: string;
  /** Dialog submit label */
  dialogSubmitLabel?: string;
}

/**
 * TenantSearchForm - Search and apply to join tenants
 *
 * Features:
 * - Debounced search input
 * - Per-tenant cooldown display
 * - Apply dialog with optional message
 * - Load more pagination
 *
 * @example
 * <TenantSearchForm
 *   search={search}
 *   onSearchChange={setSearch}
 *   tenants={availableTenants}
 *   loading={isLoading}
 *   onApply={(id, msg) => handleApply(id, msg)}
 *   hasMore={hasMore}
 *   onLoadMore={loadMore}
 * />
 */
export function TenantSearchForm({
  title = 'Join Other Organizations',
  search,
  onSearchChange,
  tenants,
  loading = false,
  error,
  globalCooldown,
  cooldownByTenantId = {},
  onApply,
  applyLoading = false,
  hasMore = false,
  onLoadMore,
  searchPlaceholder = 'Type to search...',
  emptySearchMessage = 'Type a name to search.',
  noResultsMessage = 'No organizations found.',
  applyLabel = 'Apply',
  loadMoreLabel = 'Load more',
  dialogTitle = 'Apply to join',
  dialogMessageLabel = 'Message (optional)',
  dialogCancelLabel = 'Cancel',
  dialogSubmitLabel = 'Submit',
  sx,
  ...props
}: TenantSearchFormProps) {
  const [applyTenant, setApplyTenant] = useState<Tenant | null>(null);
  const [applyMessage, setApplyMessage] = useState('');

  const handleApply = () => {
    if (!applyTenant) return;
    onApply(applyTenant.id, applyMessage || undefined);
    setApplyTenant(null);
    setApplyMessage('');
  };

  const handleClose = () => {
    setApplyTenant(null);
    setApplyMessage('');
  };

  const isGlobalCooldownActive = globalCooldown && !globalCooldown.canApply;
  const isSearchEmpty = search.trim().length === 0;

  return (
    <>
      <Paper variant="outlined" sx={{ p: 3, ...sx }} {...props}>
        <Typography variant="h6">{title}</Typography>
        <Divider sx={{ my: 2 }} />

        <TextField
          fullWidth
          label="Search organizations"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
        />

        <Box sx={{ mt: 2 }}>
          {isSearchEmpty && (
            <Typography variant="body2" color="text.secondary">
              {emptySearchMessage}
            </Typography>
          )}

          {loading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Searching...
              </Typography>
            </Stack>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {!isSearchEmpty && !loading && tenants.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              {noResultsMessage}
            </Typography>
          )}

          <Stack spacing={1} sx={{ mt: 2 }}>
            {tenants.map((tenant) => {
              const tenantCooldown = cooldownByTenantId[tenant.id];
              const canApplyTenant = tenantCooldown ? tenantCooldown.canApply : true;
              const isDisabled = applyLoading || isGlobalCooldownActive || !canApplyTenant;

              return (
                <TenantCard
                  key={tenant.id}
                  tenant={tenant}
                  actionLabel={applyLabel}
                  actionVariant="contained"
                  onAction={() => setApplyTenant(tenant)}
                  actionDisabled={isDisabled}
                  subtitle={
                    tenantCooldown && !tenantCooldown.canApply ? (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block' }}
                      >
                        {tenantCooldown.reason}
                        {tenantCooldown.until ? ` (until ${tenantCooldown.until})` : null}
                      </Typography>
                    ) : null
                  }
                />
              );
            })}

            {hasMore && onLoadMore && (
              <Button variant="outlined" disabled={loading} onClick={onLoadMore}>
                {loadMoreLabel}
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      <Dialog open={Boolean(applyTenant)} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {applyTenant ? applyTenant.displayName || applyTenant.name : null}
          </Typography>
          <TextField
            fullWidth
            label={dialogMessageLabel}
            value={applyMessage}
            onChange={(e) => setApplyMessage(e.target.value)}
            multiline
            minRows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={applyLoading}>
            {dialogCancelLabel}
          </Button>
          <Button variant="contained" onClick={handleApply} disabled={applyLoading}>
            {dialogSubmitLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
