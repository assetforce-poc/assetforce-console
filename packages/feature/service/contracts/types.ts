/**
 * Service Contract Types
 *
 * Type definitions for service contracts (PROVIDES/CONSUMES)
 * aligned with SGC GraphQL schema.
 */

export enum ContractType {
  PROVIDES = 'PROVIDES',
  CONSUMES = 'CONSUMES',
}

export enum Protocol {
  GRAPHQL = 'GRAPHQL',
  REST = 'REST',
  GRPC = 'GRPC',
  EVENT = 'EVENT',
}

export interface SchemaReference {
  url: string;
  hash?: string;
  version?: string;
}

export interface GraphQLContract {
  operation: string;
  schema?: SchemaReference;
}

export interface DeprecationInfo {
  reason: string;
  since?: string;
  alternative?: string;
  removal?: string;
}

export interface ServiceContract {
  id: string;
  tenant: string;
  serviceId: string;
  type: ContractType;
  protocol: Protocol;
  graphql?: GraphQLContract;
  version?: string;
  deprecation?: DeprecationInfo;
  deprecated: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContractListInput {
  serviceId?: string;
  type?: ContractType;
  protocol?: Protocol;
}

export interface GraphQLContractUpsertInput {
  serviceId: string;
  type: ContractType;
  operation: string;
  schemaUrl?: string;
  schemaHash?: string;
  schemaVersion?: string;
  version?: string;
}

export interface ContractDeprecateInput {
  id: string;
  reason: string;
  since?: string;
  alternative?: string;
  removal?: string;
}
