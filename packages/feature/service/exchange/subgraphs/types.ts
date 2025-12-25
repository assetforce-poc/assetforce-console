/**
 * Exchange Subgraph Types
 *
 * Re-exported from GraphQL codegen to avoid hand-maintained duplicates.
 */

import type { DeepOmit } from '@assetforce/graphql';

import type {
  ExchangeHealthStatus as ExchangeHealthStatusGql,
  Subgraph as SubgraphGql,
  SubgraphRegisterInput as SubgraphRegisterInputGql,
  SubgraphSchema as SubgraphSchemaGql,
  SubgraphStatus as SubgraphStatusGql,
  SubgraphUpdateInput as SubgraphUpdateInputGql,
} from '../../generated/graphql';

export type Subgraph = DeepOmit<SubgraphGql>;
export type SubgraphSchema = DeepOmit<SubgraphSchemaGql>;
export type ExchangeHealthStatus = DeepOmit<ExchangeHealthStatusGql>;
export type SubgraphRegisterInput = SubgraphRegisterInputGql;
export type SubgraphUpdateInput = SubgraphUpdateInputGql;
export { SubgraphStatus } from '../../generated/graphql';

/**
 * Status color mapping for UI display
 */
export const subgraphStatusColors: Record<SubgraphStatusGql, 'success' | 'warning' | 'error' | 'default'> = {
  ACTIVE: 'success',
  PENDING: 'warning',
  UNHEALTHY: 'error',
  INACTIVE: 'default',
};

/**
 * Status labels for display
 */
export const subgraphStatusLabels: Record<SubgraphStatusGql, string> = {
  ACTIVE: 'Active',
  PENDING: 'Pending',
  UNHEALTHY: 'Unhealthy',
  INACTIVE: 'Inactive',
};
