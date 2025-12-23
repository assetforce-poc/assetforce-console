/**
 * Service Contract Types
 *
 * Re-exported from GraphQL codegen to avoid hand-maintained duplicates.
 */

import type {
  ContractDeprecateInput as ContractDeprecateInputGql,
  ContractListInput as ContractListInputGql,
  ContractType as ContractTypeGql,
  DeprecationType as DeprecationTypeGql,
  GraphQlContractType as GraphQlContractTypeGql,
  GraphQlContractUpsertInput as GraphQlContractUpsertInputGql,
  Protocol as ProtocolGql,
  SchemaReferenceType as SchemaReferenceTypeGql,
  ServiceContract as ServiceContractGql,
} from '../generated/graphql';

type StripTypename<T> = T extends (infer U)[]
  ? StripTypename<U>[]
  : T extends object
    ? { [K in keyof T as K extends '__typename' ? never : K]: StripTypename<T[K]> }
    : T;

export type ContractDeprecateInput = ContractDeprecateInputGql;
export type ContractListInput = ContractListInputGql;
export type ContractType = ContractTypeGql;
export type GraphQlContractUpsertInput = GraphQlContractUpsertInputGql;
export type Protocol = ProtocolGql;

export type SchemaReference = StripTypename<SchemaReferenceTypeGql>;
export type DeprecationInfo = StripTypename<DeprecationTypeGql>;
export type GraphQlContract = StripTypename<GraphQlContractTypeGql>;
export type ServiceContract = StripTypename<ServiceContractGql>;

// Back-compat aliases for existing usage.
export type GraphQLContract = GraphQlContract;
export type GraphQLContractUpsertInput = GraphQlContractUpsertInput;
