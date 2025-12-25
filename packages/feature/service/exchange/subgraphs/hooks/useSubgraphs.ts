'use client';

import { useMutation, useQuery } from '@assetforce/graphql';

import {
  ActivateSubgraphDocument,
  DeactivateSubgraphDocument,
  GetExchangeHealthDocument,
  GetSubgraphDocument,
  ListSubgraphsDocument,
  RefreshSubgraphSchemaDocument,
  RegisterSubgraphDocument,
  RemoveSubgraphDocument,
  type SubgraphStatus,
  UpdateSubgraphDocument,
} from '../../../generated/graphql';
import type { Subgraph, SubgraphRegisterInput, SubgraphUpdateInput } from '../types';

/**
 * Hook for listing subgraphs with optional status filter
 */
export function useSubgraphList(status?: SubgraphStatus) {
  const { data, loading, error, refetch } = useQuery(ListSubgraphsDocument, {
    variables: { status },
  });

  return {
    subgraphs: (data?.exchange?.subgraph?.list?.items ?? []).filter((item): item is Subgraph => Boolean(item)),
    total: data?.exchange?.subgraph?.list?.total ?? 0,
    loading,
    error: error as Error | undefined,
    refetch: async () => {
      await refetch();
    },
  };
}

/**
 * Hook for getting a single subgraph by name
 */
export function useSubgraph(name: string) {
  const { data, loading, error, refetch } = useQuery(GetSubgraphDocument, {
    variables: { name },
    skip: !name,
  });

  return {
    subgraph: data?.exchange?.subgraph?.one as Subgraph | null | undefined,
    loading,
    error: error as Error | undefined,
    refetch: async () => {
      await refetch();
    },
  };
}

/**
 * Hook for exchange health status
 */
export function useExchangeHealth() {
  const { data, loading, error, refetch } = useQuery(GetExchangeHealthDocument);

  return {
    health: data?.exchange?.health,
    loading,
    error: error as Error | undefined,
    refetch: async () => {
      await refetch();
    },
  };
}

/**
 * Hook for subgraph mutations (register, update, activate, deactivate, remove, refresh)
 */
export function useSubgraphMutations(onSuccess?: () => void) {
  const [registerMutation, { loading: registering }] = useMutation(RegisterSubgraphDocument, {
    onCompleted: onSuccess,
  });

  const [updateMutation, { loading: updating }] = useMutation(UpdateSubgraphDocument, {
    onCompleted: onSuccess,
  });

  const [activateMutation, { loading: activating }] = useMutation(ActivateSubgraphDocument, {
    onCompleted: onSuccess,
  });

  const [deactivateMutation, { loading: deactivating }] = useMutation(DeactivateSubgraphDocument, {
    onCompleted: onSuccess,
  });

  const [removeMutation, { loading: removing }] = useMutation(RemoveSubgraphDocument, {
    onCompleted: onSuccess,
  });

  const [refreshMutation, { loading: refreshing }] = useMutation(RefreshSubgraphSchemaDocument, {
    onCompleted: onSuccess,
  });

  return {
    // Mutations
    register: (input: SubgraphRegisterInput) => registerMutation({ variables: { input } }),
    update: (input: SubgraphUpdateInput) => updateMutation({ variables: { input } }),
    activate: (name: string) => activateMutation({ variables: { name } }),
    deactivate: (name: string) => deactivateMutation({ variables: { name } }),
    remove: (name: string) => removeMutation({ variables: { name } }),
    refreshSchema: (name: string) => refreshMutation({ variables: { name } }),

    // Loading states
    registering,
    updating,
    activating,
    deactivating,
    removing,
    refreshing,
    mutating: registering || updating || activating || deactivating || removing || refreshing,
  };
}
