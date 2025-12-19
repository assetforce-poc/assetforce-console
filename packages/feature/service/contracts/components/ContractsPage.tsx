'use client';

import { Box, CircularProgress, Typography } from '@assetforce/material';

import { useContracts } from '../hooks/useContracts';
import { ContractList } from './ContractList';

export interface ContractsPageProps {
  /** Service slug */
  slug: string;

  /** Service ID */
  serviceId: string;
}

/**
 * ContractsPage - Main page for managing service contracts
 *
 * @example
 * ```tsx
 * <ContractsPage slug="aac" serviceId="aac-service-id" />
 * ```
 */
export function ContractsPage({ slug, serviceId }: ContractsPageProps) {
  const { contracts, total, loading, error, upsertGraphQL, deprecate, deleteContract } = useContracts({
    serviceId,
  });

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="error">
          Error loading contracts
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message}
        </Typography>
      </Box>
    );
  }

  if (loading && contracts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <ContractList
        contracts={contracts}
        loading={loading}
        serviceId={serviceId}
        onUpsert={upsertGraphQL}
        onDeprecate={deprecate}
        onDelete={deleteContract}
      />

      {total > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Total: {total} contracts
          </Typography>
        </Box>
      )}
    </Box>
  );
}
