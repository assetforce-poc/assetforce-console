/**
 * Service Contract Types
 *
 * Re-exported from GraphQL codegen to avoid hand-maintained duplicates.
 */

import type { DeepOmit } from '@assetforce/graphql';

import type {
  ContractDeprecateInput as ContractDeprecateInputGql,
  ContractListInput as ContractListInputGql,
  DeprecationType as DeprecationTypeGql,
  GraphQlContractType as GraphQlContractTypeGql,
  GraphQlContractUpsertInput as GraphQlContractUpsertInputGql,
  SchemaReferenceType as SchemaReferenceTypeGql,
  ServiceContract as ServiceContractGql,
} from '../generated/graphql';

export type ContractDeprecateInput = ContractDeprecateInputGql;
export type ContractListInput = ContractListInputGql;
export { ContractType, Protocol } from '../generated/graphql';
export type GraphQlContractUpsertInput = GraphQlContractUpsertInputGql;

export type SchemaReference = DeepOmit<SchemaReferenceTypeGql>;
export type DeprecationInfo = DeepOmit<DeprecationTypeGql>;
export type GraphQlContract = DeepOmit<GraphQlContractTypeGql>;
export type ServiceContract = DeepOmit<ServiceContractGql>;

// Back-compat aliases for existing usage.
export type GraphQLContract = GraphQlContract;
export type GraphQLContractUpsertInput = GraphQlContractUpsertInput;
