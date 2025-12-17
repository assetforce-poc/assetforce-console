/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Dependency = {
  __typename?: 'Dependency';
  critical: Scalars['Boolean']['output'];
  sourceServiceId: Scalars['ID']['output'];
  targetServiceId: Scalars['ID']['output'];
};

export type DependencyInput = {
  /** Is this a critical dependency? */
  critical?: InputMaybe<Scalars['Boolean']['input']>;
  /** Target service ID */
  targetServiceId: Scalars['ID']['input'];
};

export type DependencySetInput = {
  /** List of dependencies. Replaces existing. */
  dependencies: Array<DependencyInput>;
  /** Service to set dependencies for */
  serviceId: Scalars['ID']['input'];
};

export type Environment =
  | 'DEVELOPMENT'
  | 'PRODUCTION'
  | 'TESTING';

export type HealthStatus =
  | 'DOWN'
  | 'UNKNOWN'
  | 'UP';

export type InstanceDiscoverInput = {
  /** Include all tenants. Platform-admin only. */
  allTenants?: InputMaybe<Scalars['Boolean']['input']>;
  /** Only return enabled instances (default: true) */
  enabledOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Environment to discover in */
  environment: Environment;
  /** Filter by health status */
  health?: InputMaybe<HealthStatus>;
  /** Pagination parameters */
  page?: InputMaybe<PageInput>;
  /** Service to discover instances for */
  serviceId: Scalars['ID']['input'];
  /** Target specific tenant. Platform-admin only. */
  tenant?: InputMaybe<Scalars['String']['input']>;
};

export type InstanceListInput = {
  /** Include all tenants. Platform-admin only. */
  allTenants?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by enabled status */
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by environment */
  environment?: InputMaybe<Environment>;
  /** Pagination parameters */
  page?: InputMaybe<PageInput>;
  /** Service to list instances for */
  serviceId: Scalars['ID']['input'];
  /** Target specific tenant. Platform-admin only. */
  tenant?: InputMaybe<Scalars['String']['input']>;
};

export type InstanceUpsertInput = {
  /** Base URL (scheme + host + optional port) */
  baseUrl: Scalars['String']['input'];
  /** Probe interval in seconds. Default: 60, Range: 15-3600 */
  checkIntervalSeconds?: InputMaybe<Scalars['Int']['input']>;
  /** Enable instance for discovery. Default: true */
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Deployment environment */
  environment: Environment;
  /** Health check path. Default: /actuator/health */
  healthPath?: InputMaybe<Scalars['String']['input']>;
  /** Instance key. Immutable after creation. */
  key: Scalars['String']['input'];
  /** Parent service ID */
  serviceId: Scalars['ID']['input'];
  /** Target tenant. Platform-admin only. */
  tenant?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  service: ServiceMutations;
};

export type PageInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ProbeAction =
  | 'APPROVE'
  | 'DISABLE'
  | 'ENABLE';

export type ProbeApprovalStatus =
  | 'APPROVED'
  | 'DISABLED'
  | 'PENDING';

export type ProbeInput = {
  /**
   * APPROVE: set to APPROVED (enable probing)
   * DISABLE: set to DISABLED (stop probing)
   * ENABLE: re-enable a DISABLED instance
   */
  action: ProbeAction;
  /** Instance to control probing for */
  instanceId: Scalars['ID']['input'];
  /** Optional reason for audit trail */
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  service: ServiceQueries;
};

export type Service = {
  __typename?: 'Service';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /**
   * Dependencies declared by this service.
   * Returns list of services this service depends on.
   */
  dependencies: Array<ServiceDependency>;
  displayName: Scalars['String']['output'];
  docsUrl?: Maybe<Scalars['String']['output']>;
  health: ServiceHealthSummary;
  id: Scalars['ID']['output'];
  /**
   * Instances of this service.
   * Optionally filter by environment.
   */
  instances: Array<ServiceInstance>;
  lifecycle?: Maybe<ServiceLifecycle>;
  repoUrl?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  tenant: Scalars['String']['output'];
  type: ServiceType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type ServiceInstancesArgs = {
  environment?: InputMaybe<Environment>;
};

export type ServiceConnection = {
  __typename?: 'ServiceConnection';
  items: Array<Service>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/**
 * Dependency with resolved target service information.
 * Used when fetching dependencies through Service.dependencies field.
 */
export type ServiceDependency = {
  __typename?: 'ServiceDependency';
  /** Is this a critical dependency? */
  critical: Scalars['Boolean']['output'];
  /** Target service identity */
  target: ServiceIdentity;
};

export type ServiceDependencyMutations = {
  __typename?: 'ServiceDependencyMutations';
  /**
   * Set dependencies for a service.
   * Replaces all existing dependencies.
   */
  set: Service;
};


export type ServiceDependencyMutationsSetArgs = {
  input: DependencySetInput;
};

export type ServiceHealthSummary = {
  __typename?: 'ServiceHealthSummary';
  lastCheckedAt?: Maybe<Scalars['DateTime']['output']>;
  lastFailureAt?: Maybe<Scalars['DateTime']['output']>;
  lastSuccessAt?: Maybe<Scalars['DateTime']['output']>;
  status: HealthStatus;
};

/**
 * Minimal identity of a Service.
 * Used in relationships where full Service object is not needed.
 */
export type ServiceIdentity = {
  __typename?: 'ServiceIdentity';
  /** Service display name */
  displayName: Scalars['String']['output'];
  /** Service ID */
  id: Scalars['ID']['output'];
  /** Service slug (for linking) */
  slug: Scalars['String']['output'];
};

export type ServiceInstance = {
  __typename?: 'ServiceInstance';
  baseUrl: Scalars['String']['output'];
  checkIntervalSeconds: Scalars['Int']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  enabled: Scalars['Boolean']['output'];
  environment: Environment;
  healthPath: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  lastCheckedAt?: Maybe<Scalars['DateTime']['output']>;
  lastFailureAt?: Maybe<Scalars['DateTime']['output']>;
  lastFailureReason?: Maybe<Scalars['String']['output']>;
  lastStatus: HealthStatus;
  lastSuccessAt?: Maybe<Scalars['DateTime']['output']>;
  probeApprovalStatus: ProbeApprovalStatus;
  serviceId: Scalars['ID']['output'];
  tenant: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ServiceInstanceConnection = {
  __typename?: 'ServiceInstanceConnection';
  items: Array<ServiceInstance>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ServiceInstanceMutations = {
  __typename?: 'ServiceInstanceMutations';
  /**
   * Control probing for an instance.
   * Platform-admin only.
   * Actions: APPROVE (enable probing), DISABLE (stop probing), ENABLE (re-enable)
   */
  probe: ServiceInstance;
  /**
   * Create or update an instance.
   * Upsert by key: if instance with key exists in (service, env), update; otherwise create.
   */
  upsert: ServiceInstance;
};


export type ServiceInstanceMutationsProbeArgs = {
  input: ProbeInput;
};


export type ServiceInstanceMutationsUpsertArgs = {
  input: InstanceUpsertInput;
};

export type ServiceInstanceQueries = {
  __typename?: 'ServiceInstanceQueries';
  /**
   * Discover instances for service consumption.
   * Returns enabled instances, optionally filtered by health.
   */
  discover: ServiceInstanceConnection;
  /** List instances for a service. */
  list: ServiceInstanceConnection;
};


export type ServiceInstanceQueriesDiscoverArgs = {
  input: InstanceDiscoverInput;
};


export type ServiceInstanceQueriesListArgs = {
  input: InstanceListInput;
};

export type ServiceLifecycle =
  | 'DEPRECATED'
  | 'DEVELOPMENT'
  | 'PRODUCTION'
  | 'TESTING';

export type ServiceListInput = {
  /**
   * Include all tenants. Platform-admin only.
   * Requires explicit true; omission is not treated as all.
   */
  allTenants?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by instance environment (services with instances in this env) */
  environment?: InputMaybe<Environment>;
  /** Filter by lifecycle stage */
  lifecycle?: InputMaybe<ServiceLifecycle>;
  /** Pagination parameters */
  page?: InputMaybe<PageInput>;
  /** Search by slug or displayName (case-insensitive contains) */
  search?: InputMaybe<Scalars['String']['input']>;
  /**
   * Target specific tenant. Platform-admin only.
   * Ignored or rejected for non-admin callers.
   */
  tenant?: InputMaybe<Scalars['String']['input']>;
  /** Filter by service type */
  type?: InputMaybe<ServiceType>;
};

export type ServiceMutations = {
  __typename?: 'ServiceMutations';
  /** Dependency-related mutations (nested namespace). */
  dependency: ServiceDependencyMutations;
  /** Instance-related mutations (nested namespace). */
  instance: ServiceInstanceMutations;
  /**
   * Create or update a service.
   * Upsert by slug: if service with slug exists, update; otherwise create.
   */
  upsert: Service;
};


export type ServiceMutationsUpsertArgs = {
  input: ServiceUpsertInput;
};

export type ServiceOneInput = {
  /** Service ID. Exactly one of id or slug required. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Service slug. Exactly one of id or slug required. */
  slug?: InputMaybe<Scalars['String']['input']>;
  /** Tenant for slug lookup. Required for platform-admin cross-tenant. */
  tenant?: InputMaybe<Scalars['String']['input']>;
};

export type ServiceQueries = {
  __typename?: 'ServiceQueries';
  /** Instance-related queries (nested namespace). */
  instance: ServiceInstanceQueries;
  /**
   * List services with optional filters.
   * Default: returns services in caller's tenant.
   * Platform-admin: can specify tenant or allTenants.
   */
  list: ServiceConnection;
  /**
   * Get a single service by ID or slug.
   * Exactly one of id or slug must be provided.
   */
  one: Service;
};


export type ServiceQueriesListArgs = {
  input: ServiceListInput;
};


export type ServiceQueriesOneArgs = {
  input: ServiceOneInput;
};

export type ServiceType =
  | 'CORE'
  | 'EXTENSION'
  | 'EXTERNAL';

export type ServiceUpsertInput = {
  /** Human-readable display name */
  displayName: Scalars['String']['input'];
  /** Documentation URL */
  docsUrl?: InputMaybe<Scalars['String']['input']>;
  /** Lifecycle stage */
  lifecycle?: InputMaybe<ServiceLifecycle>;
  /** Source repository URL */
  repoUrl?: InputMaybe<Scalars['String']['input']>;
  /** Service slug. Immutable after creation. */
  slug: Scalars['String']['input'];
  /** Tags for categorization */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /**
   * Target tenant. Platform-admin only.
   * Non-admin callers: rejected or uses caller's tenant.
   */
  tenant?: InputMaybe<Scalars['String']['input']>;
  /** Service classification */
  type: ServiceType;
};

export type GetServiceDetailQueryVariables = Exact<{
  input: ServiceOneInput;
}>;


export type GetServiceDetailQuery = { __typename?: 'Query', service: { __typename?: 'ServiceQueries', one: { __typename?: 'Service', id: string, slug: string, displayName: string, type: ServiceType, lifecycle?: ServiceLifecycle | null, repoUrl?: string | null, docsUrl?: string | null, tags?: Array<string> | null, createdAt?: any | null, updatedAt?: any | null, health: { __typename?: 'ServiceHealthSummary', status: HealthStatus, lastCheckedAt?: any | null, lastSuccessAt?: any | null, lastFailureAt?: any | null }, dependencies: Array<{ __typename?: 'ServiceDependency', critical: boolean, target: { __typename?: 'ServiceIdentity', id: string, slug: string, displayName: string } }>, instances: Array<{ __typename?: 'ServiceInstance', id: string, key: string, environment: Environment, baseUrl: string, healthPath: string, enabled: boolean, probeApprovalStatus: ProbeApprovalStatus, lastStatus: HealthStatus, lastCheckedAt?: any | null, lastFailureReason?: string | null }> } } };

export type ListServicesQueryVariables = Exact<{
  input: ServiceListInput;
}>;


export type ListServicesQuery = { __typename?: 'Query', service: { __typename?: 'ServiceQueries', list: { __typename?: 'ServiceConnection', total: number, limit: number, offset: number, items: Array<{ __typename?: 'Service', id: string, slug: string, displayName: string, type: ServiceType, lifecycle?: ServiceLifecycle | null, tags?: Array<string> | null, createdAt?: any | null, updatedAt?: any | null, health: { __typename?: 'ServiceHealthSummary', status: HealthStatus, lastCheckedAt?: any | null } }> } } };


export const GetServiceDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetServiceDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceOneInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"lifecycle"}},{"kind":"Field","name":{"kind":"Name","value":"repoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"docsUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastCheckedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastSuccessAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastFailureAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dependencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"critical"}}]}},{"kind":"Field","name":{"kind":"Name","value":"instances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"environment"}},{"kind":"Field","name":{"kind":"Name","value":"baseUrl"}},{"kind":"Field","name":{"kind":"Name","value":"healthPath"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"probeApprovalStatus"}},{"kind":"Field","name":{"kind":"Name","value":"lastStatus"}},{"kind":"Field","name":{"kind":"Name","value":"lastCheckedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastFailureReason"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetServiceDetailQuery, GetServiceDetailQueryVariables>;
export const ListServicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListServices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceListInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"lifecycle"}},{"kind":"Field","name":{"kind":"Name","value":"health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastCheckedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}}]}}]}}]}}]} as unknown as DocumentNode<ListServicesQuery, ListServicesQueryVariables>;