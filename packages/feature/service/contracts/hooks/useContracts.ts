'use client';

import { useMutation, useQuery } from '@assetforce/graphql';

import {
  DeleteContractDocument,
  DeprecateContractDocument,
  ListContractsDocument,
  UpsertGraphQlContractDocument,
} from '../../generated/graphql';
import type { ContractDeprecateInput, ContractListInput, GraphQLContractUpsertInput, ServiceContract } from '../types';

/**
 * Hook for querying and managing service contracts
 *
 * @example
 * ```tsx
 * const { contracts, total, loading, upsertGraphQL } = useContracts({ serviceId: 'aac' });
 * ```
 */
export function useContracts(input: ContractListInput) {
  // Query contracts list
  const { data, loading, error, refetch } = useQuery(ListContractsDocument, {
    variables: { input },
    skip: !input.serviceId,
  });

  // Upsert GraphQL contract mutation
  const [upsertGraphQLMutation, { loading: upserting }] = useMutation(UpsertGraphQlContractDocument, {
    onCompleted: () => refetch(),
  });

  // Deprecate contract mutation
  const [deprecateMutation, { loading: deprecating }] = useMutation(DeprecateContractDocument, {
    onCompleted: () => refetch(),
  });

  // Delete contract mutation
  const [deleteContractMutation, { loading: deleting }] = useMutation(DeleteContractDocument, {
    onCompleted: () => refetch(),
  });

  return {
    // Query data
    contracts: (data?.service?.contract?.list?.items ?? []).filter((item): item is ServiceContract => Boolean(item)),
    total: data?.service?.contract?.list?.total || 0,
    limit: data?.service?.contract?.list?.limit || 0,
    offset: data?.service?.contract?.list?.offset || 0,
    loading,
    error: error as Error | undefined,
    refetch: async () => {
      await refetch();
    },

    // Mutations
    upsertGraphQL: (input: GraphQLContractUpsertInput) => upsertGraphQLMutation({ variables: { input } }),
    deprecate: (input: ContractDeprecateInput) => deprecateMutation({ variables: { input } }),
    deleteContract: (id: string) => deleteContractMutation({ variables: { id } }),

    // Loading states
    upserting,
    deprecating,
    deleting,
  };
}
