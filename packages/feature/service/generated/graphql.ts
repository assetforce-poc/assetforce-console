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
  _FieldSet: { input: any; output: any; }
};

/** Schema change severity classification */
export enum ChangeSeverity {
  /** Breaking changes requiring major version bump */
  Major = 'MAJOR',
  /** Backward-compatible additions requiring minor version bump */
  Minor = 'MINOR',
  /** Non-structural changes requiring patch version bump */
  Patch = 'PATCH'
}

/** Summary of changes by severity */
export type ChangeSummary = {
  __typename?: 'ChangeSummary';
  /** Breaking changes (severity=MAJOR) */
  major: Scalars['Int']['output'];
  /** Backward-compatible additions (severity=MINOR) */
  minor: Scalars['Int']['output'];
  /** Non-structural changes (severity=PATCH) */
  patch: Scalars['Int']['output'];
  /** Total number of changes */
  total: Scalars['Int']['output'];
};

/** A contract this service CONSUMES and its providers */
export type ConsumesNode = {
  __typename?: 'ConsumesNode';
  /** The contract this service consumes */
  contract: ServiceContract;
  /** Services that PROVIDE this contract */
  providers: Array<Service>;
};

/** Dependency graph showing what a service provides/consumes */
export type ContractDependencyGraph = {
  __typename?: 'ContractDependencyGraph';
  /** Contracts this service CONSUMES and who PROVIDES them */
  consumes: Array<ConsumesNode>;
  /** Contracts this service PROVIDES and who CONSUMES them */
  provides: Array<ProvidesNode>;
  /** The service this graph is for */
  service: Service;
};

export type ContractDeprecateInput = {
  /** Suggested alternative */
  alternative?: InputMaybe<Scalars['String']['input']>;
  /** Contract ID to deprecate */
  id: Scalars['ID']['input'];
  /** Reason for deprecation */
  reason: Scalars['String']['input'];
  /** Planned removal version */
  removal?: InputMaybe<Scalars['String']['input']>;
  /** Version when deprecation started */
  since?: InputMaybe<Scalars['String']['input']>;
};

/** Contract deprecation notification (sent to consumers when contract is deprecated) */
export type ContractDeprecationNotification = {
  __typename?: 'ContractDeprecationNotification';
  /** Whether the notification has been acknowledged */
  acknowledged: Scalars['Boolean']['output'];
  /** When the notification was acknowledged */
  acknowledgedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Who acknowledged the notification */
  acknowledgedBy?: Maybe<Scalars['String']['output']>;
  /** Suggested alternative (e.g., Query.usersV2) */
  alternative?: Maybe<Scalars['String']['output']>;
  /** ID of the deprecated contract */
  contractId: Scalars['ID']['output'];
  /** Contract identifier (e.g., Query.users) */
  contractIdentifier: Scalars['String']['output'];
  /** When the notification was created */
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** Deprecation reason */
  reason?: Maybe<Scalars['String']['output']>;
  /** Planned removal version */
  removalVersion?: Maybe<Scalars['String']['output']>;
  /** Version when deprecation started */
  sinceVersion?: Maybe<Scalars['String']['output']>;
  /** Source service (provider of the deprecated contract) */
  source: Scalars['ID']['output'];
  /** Target service (consumer who receives the notification) */
  target: Scalars['ID']['output'];
};

/** Connection response for contract deprecation notification list */
export type ContractDeprecationNotificationConnection = {
  __typename?: 'ContractDeprecationNotificationConnection';
  items: Array<ContractDeprecationNotification>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/**
 *  ============================================================
 *  Contract Input Types (Phase 2 - SXP)
 *  ============================================================
 */
export type ContractListInput = {
  /** Include all tenants. Platform-admin only. */
  allTenants?: InputMaybe<Scalars['Boolean']['input']>;
  /** Pagination parameters */
  page?: InputMaybe<PageInput>;
  /** Filter by protocol */
  protocol?: InputMaybe<Protocol>;
  /** Filter by service ID */
  serviceId?: InputMaybe<Scalars['ID']['input']>;
  /** Target specific tenant. Platform-admin only. */
  tenant?: InputMaybe<Scalars['String']['input']>;
  /** Filter by contract type (PROVIDES/CONSUMES) */
  type?: InputMaybe<ContractType>;
};

export type ContractLookupInput = {
  /** GraphQL operation to look up (e.g., Query.users) */
  operation: Scalars['String']['input'];
  /** Target tenant (uses caller's tenant if not specified) */
  tenant?: InputMaybe<Scalars['String']['input']>;
};

/** Contract type: whether a service provides or consumes an interface */
export enum ContractType {
  /** Service consumes this interface from another service */
  Consumes = 'CONSUMES',
  /** Service provides this interface for others to call */
  Provides = 'PROVIDES'
}

export type Dependency = {
  __typename?: 'Dependency';
  critical: Scalars['Boolean']['output'];
  sourceServiceId: Scalars['ID']['output'];
  targetServiceId: Scalars['ID']['output'];
};

/** Input for dependency graph query */
export type DependencyGraphInput = {
  /** Service ID to get dependency graph for */
  serviceId: Scalars['ID']['input'];
  /** Tenant filter (null = current tenant) */
  tenant?: InputMaybe<Scalars['String']['input']>;
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

/** Input for contract deprecation notification list query */
export type DeprecationNotificationListInput = {
  /** Filter by acknowledged status (null = all) */
  acknowledged?: InputMaybe<Scalars['Boolean']['input']>;
  /** Pagination */
  page?: InputMaybe<PageInput>;
  /** Filter by target service ID */
  target: Scalars['ID']['input'];
};

/** Deprecation information for a contract */
export type DeprecationType = {
  __typename?: 'DeprecationType';
  /** Suggested alternative */
  alternative?: Maybe<Scalars['String']['output']>;
  /** Reason for deprecation */
  reason: Scalars['String']['output'];
  /** Planned removal version */
  removal?: Maybe<Scalars['String']['output']>;
  /** Version when deprecation started */
  since?: Maybe<Scalars['String']['output']>;
};

export enum Environment {
  Development = 'DEVELOPMENT',
  Production = 'PRODUCTION',
  Testing = 'TESTING'
}

export enum ErrorDetail {
  /**
   * The deadline expired before the operation could complete.
   *
   * For operations that change the state of the system, this error
   * may be returned even if the operation has completed successfully.
   * For example, a successful response from a server could have been
   * delayed long enough for the deadline to expire.
   *
   * HTTP Mapping: 504 Gateway Timeout
   * Error Type: UNAVAILABLE
   */
  DeadlineExceeded = 'DEADLINE_EXCEEDED',
  /**
   * The server detected that the client is exhibiting a behavior that
   * might be generating excessive load.
   *
   * HTTP Mapping: 420 Enhance Your Calm
   * Error Type: UNAVAILABLE
   */
  EnhanceYourCalm = 'ENHANCE_YOUR_CALM',
  /**
   * The requested field is not found in the schema.
   *
   * This differs from `NOT_FOUND` in that `NOT_FOUND` should be used when a
   * query is valid, but is unable to return a result (if, for example, a
   * specific video id doesn't exist). `FIELD_NOT_FOUND` is intended to be
   * returned by the server to signify that the requested field is not known to exist.
   * This may be returned in lieu of failing the entire query.
   * See also `PERMISSION_DENIED` for cases where the
   * requested field is invalid only for the given user or class of users.
   *
   * HTTP Mapping: 404 Not Found
   * Error Type: BAD_REQUEST
   */
  FieldNotFound = 'FIELD_NOT_FOUND',
  /**
   * The client specified an invalid argument.
   *
   * Note that this differs from `FAILED_PRECONDITION`.
   * `INVALID_ARGUMENT` indicates arguments that are problematic
   * regardless of the state of the system (e.g., a malformed file name).
   *
   * HTTP Mapping: 400 Bad Request
   * Error Type: BAD_REQUEST
   */
  InvalidArgument = 'INVALID_ARGUMENT',
  /**
   * The provided cursor is not valid.
   *
   * The most common usage for this error is when a client is paginating
   * through a list that uses stateful cursors. In that case, the provided
   * cursor may be expired.
   *
   * HTTP Mapping: 404 Not Found
   * Error Type: NOT_FOUND
   */
  InvalidCursor = 'INVALID_CURSOR',
  /**
   * Unable to perform operation because a required resource is missing.
   *
   * Example: Client is attempting to refresh a list, but the specified
   * list is expired. This requires an action by the client to get a new list.
   *
   * If the user is simply trying GET a resource that is not found,
   * use the NOT_FOUND error type. FAILED_PRECONDITION.MISSING_RESOURCE
   * is to be used particularly when the user is performing an operation
   * that requires a particular resource to exist.
   *
   * HTTP Mapping: 400 Bad Request or 500 Internal Server Error
   * Error Type: FAILED_PRECONDITION
   */
  MissingResource = 'MISSING_RESOURCE',
  /**
   * Service Error.
   *
   * There is a problem with an upstream service.
   *
   * This may be returned if a gateway receives an unknown error from a service
   * or if a service is unreachable.
   * If a request times out which waiting on a response from a service,
   * `DEADLINE_EXCEEDED` may be returned instead.
   * If a service returns a more specific error Type, the specific error Type may
   * be returned instead.
   *
   * HTTP Mapping: 502 Bad Gateway
   * Error Type: UNAVAILABLE
   */
  ServiceError = 'SERVICE_ERROR',
  /**
   * Request failed due to network errors.
   *
   * HTTP Mapping: 503 Unavailable
   * Error Type: UNAVAILABLE
   */
  TcpFailure = 'TCP_FAILURE',
  /**
   * Request throttled based on server concurrency limits.
   *
   * HTTP Mapping: 503 Unavailable
   * Error Type: UNAVAILABLE
   */
  ThrottledConcurrency = 'THROTTLED_CONCURRENCY',
  /**
   * Request throttled based on server CPU limits
   *
   * HTTP Mapping: 503 Unavailable.
   * Error Type: UNAVAILABLE
   */
  ThrottledCpu = 'THROTTLED_CPU',
  /**
   * The server detected that the client is exhibiting a behavior that
   * might be generating excessive load.
   *
   * HTTP Mapping: 429 Too Many Requests
   * Error Type: UNAVAILABLE
   */
  TooManyRequests = 'TOO_MANY_REQUESTS',
  /**
   * The operation is not implemented or is not currently supported/enabled.
   *
   * HTTP Mapping: 501 Not Implemented
   * Error Type: BAD_REQUEST
   */
  Unimplemented = 'UNIMPLEMENTED',
  /**
   * Unknown error.
   *
   * This error should only be returned when no other error detail applies.
   * If a client sees an unknown errorDetail, it will be interpreted as UNKNOWN.
   *
   * HTTP Mapping: 500 Internal Server Error
   */
  Unknown = 'UNKNOWN'
}

export enum ErrorType {
  /**
   * Bad Request.
   *
   * There is a problem with the request.
   * Retrying the same request is not likely to succeed.
   * An example would be a query or argument that cannot be deserialized.
   *
   * HTTP Mapping: 400 Bad Request
   */
  BadRequest = 'BAD_REQUEST',
  /**
   * The operation was rejected because the system is not in a state
   * required for the operation's execution.  For example, the directory
   * to be deleted is non-empty, an rmdir operation is applied to
   * a non-directory, etc.
   *
   * Service implementers can use the following guidelines to decide
   * between `FAILED_PRECONDITION` and `UNAVAILABLE`:
   *
   * - Use `UNAVAILABLE` if the client can retry just the failing call.
   * - Use `FAILED_PRECONDITION` if the client should not retry until
   * the system state has been explicitly fixed.  E.g., if an "rmdir"
   *      fails because the directory is non-empty, `FAILED_PRECONDITION`
   * should be returned since the client should not retry unless
   * the files are deleted from the directory.
   *
   * HTTP Mapping: 400 Bad Request or 500 Internal Server Error
   */
  FailedPrecondition = 'FAILED_PRECONDITION',
  /**
   * Internal error.
   *
   * An unexpected internal error was encountered. This means that some
   * invariants expected by the underlying system have been broken.
   * This error code is reserved for serious errors.
   *
   * HTTP Mapping: 500 Internal Server Error
   */
  Internal = 'INTERNAL',
  /**
   * The requested entity was not found.
   *
   * This could apply to a resource that has never existed (e.g. bad resource id),
   * or a resource that no longer exists (e.g. cache expired.)
   *
   * Note to server developers: if a request is denied for an entire class
   * of users, such as gradual feature rollout or undocumented allowlist,
   * `NOT_FOUND` may be used. If a request is denied for some users within
   * a class of users, such as user-based access control, `PERMISSION_DENIED`
   * must be used.
   *
   * HTTP Mapping: 404 Not Found
   */
  NotFound = 'NOT_FOUND',
  /**
   * The caller does not have permission to execute the specified
   * operation.
   *
   * `PERMISSION_DENIED` must not be used for rejections
   * caused by exhausting some resource or quota.
   * `PERMISSION_DENIED` must not be used if the caller
   * cannot be identified (use `UNAUTHENTICATED`
   * instead for those errors).
   *
   * This error Type does not imply the
   * request is valid or the requested entity exists or satisfies
   * other pre-conditions.
   *
   * HTTP Mapping: 403 Forbidden
   */
  PermissionDenied = 'PERMISSION_DENIED',
  /**
   * The request does not have valid authentication credentials.
   *
   * This is intended to be returned only for routes that require
   * authentication.
   *
   * HTTP Mapping: 401 Unauthorized
   */
  Unauthenticated = 'UNAUTHENTICATED',
  /**
   * Currently Unavailable.
   *
   * The service is currently unavailable.  This is most likely a
   * transient condition, which can be corrected by retrying with
   * a backoff.
   *
   * HTTP Mapping: 503 Unavailable
   */
  Unavailable = 'UNAVAILABLE',
  /**
   * Unknown error.
   *
   * For example, this error may be returned when
   * an error code received from another address space belongs to
   * an error space that is not known in this address space.  Also
   * errors raised by APIs that do not return enough error information
   * may be converted to this error.
   *
   * If a client sees an unknown errorType, it will be interpreted as UNKNOWN.
   * Unknown errors MUST NOT trigger any special behavior. These MAY be treated
   * by an implementation as being equivalent to INTERNAL.
   *
   * When possible, a more specific error should be provided.
   *
   * HTTP Mapping: 520 Unknown Error
   */
  Unknown = 'UNKNOWN'
}

/** Event-specific contract configuration (future) */
export type EventContractType = {
  __typename?: 'EventContractType';
  /** Schema reference (Avro/JSON Schema) */
  schema?: Maybe<SchemaReferenceType>;
  /** Event topic: user.created */
  topic: Scalars['String']['output'];
};

/** Deprecation notification mutations (under exchange.notification namespace) */
export type ExchangeDeprecationNotificationMutations = {
  __typename?: 'ExchangeDeprecationNotificationMutations';
  /** Acknowledge contract deprecation notifications */
  acknowledge: Array<ContractDeprecationNotification>;
};


/** Deprecation notification mutations (under exchange.notification namespace) */
export type ExchangeDeprecationNotificationMutationsAcknowledgeArgs = {
  ids: Array<Scalars['ID']['input']>;
};

/** Deprecation notification queries (under exchange.notification namespace) */
export type ExchangeDeprecationNotificationQueries = {
  __typename?: 'ExchangeDeprecationNotificationQueries';
  /** List contract deprecation notifications for a target service */
  list: ContractDeprecationNotificationConnection;
};


/** Deprecation notification queries (under exchange.notification namespace) */
export type ExchangeDeprecationNotificationQueriesListArgs = {
  input: DeprecationNotificationListInput;
};

export type ExchangeHealthStatus = {
  __typename?: 'ExchangeHealthStatus';
  /** Number of active subgraphs */
  activeSubgraphs: Scalars['Int']['output'];
  /** Overall gateway status */
  status: Scalars['String']['output'];
  /** Total registered subgraphs */
  totalSubgraphs: Scalars['Int']['output'];
  /** List of unhealthy subgraphs */
  unhealthySubgraphs: Array<Scalars['String']['output']>;
};

/**
 *  ============================================================
 *  Exchange Mutation Namespace
 *  ============================================================
 */
export type ExchangeMutations = {
  __typename?: 'ExchangeMutations';
  /** Schema change notification mutations */
  notification: ExchangeNotificationMutations;
  /** Subgraph-related mutations */
  subgraph: ExchangeSubgraphMutations;
};

/** Schema change notification mutations (under exchange namespace) */
export type ExchangeNotificationMutations = {
  __typename?: 'ExchangeNotificationMutations';
  /** Acknowledge schema change notifications */
  acknowledge: Array<SchemaChangeNotification>;
  /** Deprecation notification namespace */
  deprecation: ExchangeDeprecationNotificationMutations;
};


/** Schema change notification mutations (under exchange namespace) */
export type ExchangeNotificationMutationsAcknowledgeArgs = {
  ids: Array<Scalars['ID']['input']>;
};

/** Schema change notification queries (under exchange namespace) */
export type ExchangeNotificationQueries = {
  __typename?: 'ExchangeNotificationQueries';
  /** Deprecation notification namespace */
  deprecation: ExchangeDeprecationNotificationQueries;
  /** List schema change notifications for a target service */
  list: SchemaChangeNotificationConnection;
};


/** Schema change notification queries (under exchange namespace) */
export type ExchangeNotificationQueriesListArgs = {
  input: NotificationListInput;
};

/**
 *  ============================================================
 *  Exchange Query Namespace
 *  ============================================================
 */
export type ExchangeQueries = {
  __typename?: 'ExchangeQueries';
  /** Get gateway health status */
  health: ExchangeHealthStatus;
  /** Schema change notifications for service owners */
  notification: ExchangeNotificationQueries;
  /** Subgraph-related queries */
  subgraph: ExchangeSubgraphQueries;
};

export type ExchangeSubgraphMutations = {
  __typename?: 'ExchangeSubgraphMutations';
  /** Activate a subgraph (start routing traffic) */
  activate: Subgraph;
  /** Deactivate a subgraph (stop routing traffic) */
  deactivate: Subgraph;
  /** Register a new subgraph */
  register: Subgraph;
  /** Remove a subgraph from the registry */
  remove: Scalars['Boolean']['output'];
  /** Schema-related operations */
  schema: ExchangeSubgraphSchemaMutations;
  /** Update a subgraph's configuration */
  update: Subgraph;
};


export type ExchangeSubgraphMutationsActivateArgs = {
  name: Scalars['String']['input'];
};


export type ExchangeSubgraphMutationsDeactivateArgs = {
  name: Scalars['String']['input'];
};


export type ExchangeSubgraphMutationsRegisterArgs = {
  input: SubgraphRegisterInput;
};


export type ExchangeSubgraphMutationsRemoveArgs = {
  name: Scalars['String']['input'];
};


export type ExchangeSubgraphMutationsUpdateArgs = {
  input: SubgraphUpdateInput;
};

export type ExchangeSubgraphQueries = {
  __typename?: 'ExchangeSubgraphQueries';
  /** List all registered subgraphs */
  list: SubgraphConnection;
  /** Get a subgraph by name */
  one?: Maybe<Subgraph>;
};


export type ExchangeSubgraphQueriesListArgs = {
  status?: InputMaybe<SubgraphStatus>;
};


export type ExchangeSubgraphQueriesOneArgs = {
  name: Scalars['String']['input'];
};

/** Schema operations for a subgraph */
export type ExchangeSubgraphSchemaMutations = {
  __typename?: 'ExchangeSubgraphSchemaMutations';
  /** Trigger schema refresh (introspection) for a subgraph */
  refresh?: Maybe<SubgraphSchema>;
  /**
   * Validate schema change before deployment.
   * Returns impact analysis without actually deploying.
   * Use this in CI/CD pipelines to detect breaking changes.
   */
  validate: SchemaValidationResult;
};


/** Schema operations for a subgraph */
export type ExchangeSubgraphSchemaMutationsRefreshArgs = {
  name: Scalars['String']['input'];
};


/** Schema operations for a subgraph */
export type ExchangeSubgraphSchemaMutationsValidateArgs = {
  input: SchemaValidateInput;
};

/** GraphQL-specific contract configuration */
export type GraphQlContractType = {
  __typename?: 'GraphQLContractType';
  /** GraphQL operation path: Query.users, Mutation.createUser */
  operation: Scalars['String']['output'];
  /** Schema reference */
  schema?: Maybe<SchemaReferenceType>;
};

export type GraphQlContractUpsertInput = {
  /** GraphQL operation: Query.users, Mutation.createUser */
  operation: Scalars['String']['input'];
  /** Schema content hash for change detection */
  schemaHash?: InputMaybe<Scalars['String']['input']>;
  /** Schema reference URL (Git path) */
  schemaUrl?: InputMaybe<Scalars['String']['input']>;
  /** Schema semantic version */
  schemaVersion?: InputMaybe<Scalars['String']['input']>;
  /** Service that owns this contract */
  serviceId: Scalars['ID']['input'];
  /** Target tenant. Platform-admin only. */
  tenant?: InputMaybe<Scalars['String']['input']>;
  /** Contract type: PROVIDES or CONSUMES */
  type: ContractType;
  /** API version */
  version?: InputMaybe<Scalars['String']['input']>;
};

/** gRPC-specific contract configuration (future) */
export type GrpcContractType = {
  __typename?: 'GrpcContractType';
  /** gRPC method name: GetUser */
  method: Scalars['String']['output'];
  /** Schema reference (.proto) */
  schema?: Maybe<SchemaReferenceType>;
  /** gRPC service name: UserService */
  service: Scalars['String']['output'];
};

export enum HealthStatus {
  Down = 'DOWN',
  Unknown = 'UNKNOWN',
  Up = 'UP'
}

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
  /** Service Exchange Portal mutations (Phase 2) */
  exchange: ExchangeMutations;
  service: ServiceMutations;
};

/** Input for schema change notification list query */
export type NotificationListInput = {
  /** Filter by acknowledged status (null = all) */
  acknowledged?: InputMaybe<Scalars['Boolean']['input']>;
  /** Pagination */
  page?: InputMaybe<PageInput>;
  /** Filter by change severity (null = all) */
  severity?: InputMaybe<Array<ChangeSeverity>>;
  /** Filter by target service ID */
  target: Scalars['ID']['input'];
};

export type PageInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export enum ProbeAction {
  Approve = 'APPROVE',
  Disable = 'DISABLE',
  Enable = 'ENABLE'
}

export enum ProbeApprovalStatus {
  Approved = 'APPROVED',
  Disabled = 'DISABLED',
  Pending = 'PENDING'
}

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

/** Protocol type for service contracts */
export enum Protocol {
  /** Event/messaging protocol - future extension */
  Event = 'EVENT',
  /** GraphQL protocol - primary focus for Phase 2.1 */
  Graphql = 'GRAPHQL',
  /** gRPC protocol - future extension */
  Grpc = 'GRPC',
  /** REST protocol - future extension */
  Rest = 'REST'
}

/** A contract this service PROVIDES and its consumers */
export type ProvidesNode = {
  __typename?: 'ProvidesNode';
  /** Services that CONSUME this contract */
  consumers: Array<Service>;
  /** The contract this service provides */
  contract: ServiceContract;
};

/**
 *  ============================================================
 *  Root Types
 *  ============================================================
 */
export type Query = {
  __typename?: 'Query';
  _service: _Service;
  /** Service Exchange Portal queries (Phase 2) */
  exchange: ExchangeQueries;
  service: ServiceQueries;
};

/** REST-specific contract configuration (future) */
export type RestContractType = {
  __typename?: 'RestContractType';
  /** HTTP method: GET, POST, PUT, DELETE */
  method: Scalars['String']['output'];
  /** Endpoint path: /api/v1/users */
  path: Scalars['String']['output'];
  /** Schema reference (OpenAPI) */
  schema?: Maybe<SchemaReferenceType>;
};

/** Schema change detection record */
export type SchemaChange = {
  __typename?: 'SchemaChange';
  detectedAt: Scalars['DateTime']['output'];
  diffSummary: Scalars['String']['output'];
  hash: SchemaHashPair;
  id: Scalars['ID']['output'];
  severity: ChangeSeverity;
  subgraphName: Scalars['String']['output'];
};

/** Connection response for schema change list */
export type SchemaChangeConnection = {
  __typename?: 'SchemaChangeConnection';
  items: Array<SchemaChange>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/** Input for schema change list query */
export type SchemaChangeListInput = {
  /** Pagination */
  page?: InputMaybe<PageInput>;
  /** Filter by change severity (null = all) */
  severity?: InputMaybe<ChangeSeverity>;
  /** Filter by subgraph name (null = all) */
  subgraphName?: InputMaybe<Scalars['String']['input']>;
};

/** Schema change notification (supports all severities: MAJOR/MINOR/PATCH) */
export type SchemaChangeNotification = {
  __typename?: 'SchemaChangeNotification';
  /** Whether the notification has been acknowledged */
  acknowledged: Scalars['Boolean']['output'];
  /** When the notification was acknowledged */
  acknowledgedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Who acknowledged the notification */
  acknowledgedBy?: Maybe<Scalars['String']['output']>;
  /** Contract identifier that changed */
  contract: Scalars['String']['output'];
  /** When the notification was detected */
  detectedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** Schema change that triggered this notification */
  schemaChange: SchemaChange;
  /** Source service (who made the schema change) */
  source: Scalars['ID']['output'];
  /** Summary of the schema change */
  summary: Scalars['String']['output'];
  /** Target service (who receives the notification) */
  target: Scalars['ID']['output'];
};

/** Connection response for schema change notification list */
export type SchemaChangeNotificationConnection = {
  __typename?: 'SchemaChangeNotificationConnection';
  items: Array<SchemaChangeNotification>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/** Schema hash pair (old and new) */
export type SchemaHashPair = {
  __typename?: 'SchemaHashPair';
  new: Scalars['String']['output'];
  old: Scalars['String']['output'];
};

/** Schema-related queries */
export type SchemaQueries = {
  __typename?: 'SchemaQueries';
  /** List schema changes for subgraphs with optional filtering */
  changes: SchemaChangeConnection;
};


/** Schema-related queries */
export type SchemaQueriesChangesArgs = {
  input: SchemaChangeListInput;
};

/** Schema reference for tracking schema versions and changes */
export type SchemaReferenceType = {
  __typename?: 'SchemaReferenceType';
  /** Content hash for change detection */
  hash?: Maybe<Scalars['String']['output']>;
  /** Git path to schema file */
  url: Scalars['String']['output'];
  /** Semantic version */
  version?: Maybe<Scalars['String']['output']>;
};

/** Input for schema validation */
export type SchemaValidateInput = {
  /** Subgraph name */
  name: Scalars['String']['input'];
  /** New schema SDL to validate */
  schema: Scalars['String']['input'];
};

/** Result of schema validation */
export type SchemaValidationResult = {
  __typename?: 'SchemaValidationResult';
  /** All detected changes (filter by severity client-side) */
  changes: Array<SchemaChange>;
  /** Services consuming affected contracts */
  consumers: Array<Service>;
  /** Change counts by severity */
  summary: ChangeSummary;
  /** No breaking changes detected */
  valid: Scalars['Boolean']['output'];
};

/**
 *  ============================================================
 *  Domain Types
 *  ============================================================
 */
export type Service = {
  __typename?: 'Service';
  /**
   * Contracts declared by this service (Phase 2 - SXP).
   * Optionally filter by type (PROVIDES/CONSUMES).
   */
  contracts: Array<ServiceContract>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /**
   * Dependencies declared by this service.
   * Returns list of services this service depends on.
   */
  dependencies: Array<ServiceDependency>;
  displayName: Scalars['String']['output'];
  docsUrl?: Maybe<Scalars['String']['output']>;
  health?: Maybe<ServiceHealthSummary>;
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


/**
 *  ============================================================
 *  Domain Types
 *  ============================================================
 */
export type ServiceContractsArgs = {
  type?: InputMaybe<ContractType>;
};


/**
 *  ============================================================
 *  Domain Types
 *  ============================================================
 */
export type ServiceInstancesArgs = {
  environment?: InputMaybe<Environment>;
};

/**
 *  ============================================================
 *  Connection Types (Pagination)
 *  ============================================================
 */
export type ServiceConnection = {
  __typename?: 'ServiceConnection';
  items: Array<Service>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/**
 * ServiceContract - Declares what interfaces a service provides or consumes.
 * Enables service dependency tracking and API governance.
 */
export type ServiceContract = {
  __typename?: 'ServiceContract';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Whether this contract is deprecated */
  deprecated: Scalars['Boolean']['output'];
  /** Deprecation information. Present if contract is deprecated. */
  deprecation?: Maybe<DeprecationType>;
  /** Event-specific configuration. Present when protocol = EVENT */
  event?: Maybe<EventContractType>;
  /** GraphQL-specific configuration. Present when protocol = GRAPHQL */
  graphql?: Maybe<GraphQlContractType>;
  /** gRPC-specific configuration. Present when protocol = GRPC */
  grpc?: Maybe<GrpcContractType>;
  id: Scalars['ID']['output'];
  protocol: Protocol;
  /** REST-specific configuration. Present when protocol = REST */
  rest?: Maybe<RestContractType>;
  serviceId: Scalars['ID']['output'];
  tenant: Scalars['String']['output'];
  type: ContractType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  /** API version (semantic version) */
  version?: Maybe<Scalars['String']['output']>;
};

export type ServiceContractConnection = {
  __typename?: 'ServiceContractConnection';
  items: Array<ServiceContract>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ServiceContractMutations = {
  __typename?: 'ServiceContractMutations';
  /** Delete a contract. */
  delete: Scalars['Boolean']['output'];
  /** Mark a contract as deprecated. */
  deprecate: ServiceContract;
  /**
   * Create or update a GraphQL contract.
   * Upsert by: serviceId + type + operation.
   */
  upsertGraphQL: ServiceContract;
};


export type ServiceContractMutationsDeleteArgs = {
  id: Scalars['ID']['input'];
};


export type ServiceContractMutationsDeprecateArgs = {
  input: ContractDeprecateInput;
};


export type ServiceContractMutationsUpsertGraphQlArgs = {
  input: GraphQlContractUpsertInput;
};

export type ServiceContractQueries = {
  __typename?: 'ServiceContractQueries';
  /** Find services that consume a specific GraphQL operation. */
  consumers: Array<ServiceContract>;
  /** Get dependency graph for a service showing what it provides/consumes and related services. */
  dependencies: ContractDependencyGraph;
  /** List contracts with optional filters. */
  list: ServiceContractConnection;
  /** Get a single contract by ID. */
  one: ServiceContract;
  /** Find services that provide a specific GraphQL operation. */
  providers: Array<ServiceContract>;
  /** Schema-related queries (M7: schema change detection) */
  schema: SchemaQueries;
};


export type ServiceContractQueriesConsumersArgs = {
  input: ContractLookupInput;
};


export type ServiceContractQueriesDependenciesArgs = {
  input: DependencyGraphInput;
};


export type ServiceContractQueriesListArgs = {
  input: ContractListInput;
};


export type ServiceContractQueriesOneArgs = {
  id: Scalars['ID']['input'];
};


export type ServiceContractQueriesProvidersArgs = {
  input: ContractLookupInput;
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

export enum ServiceLifecycle {
  Deprecated = 'DEPRECATED',
  Development = 'DEVELOPMENT',
  Production = 'PRODUCTION',
  Testing = 'TESTING'
}

/**
 *  ============================================================
 *  Query Input Types
 *  ============================================================
 */
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

/**
 *  ============================================================
 *  Mutation Namespaces
 *  ============================================================
 */
export type ServiceMutations = {
  __typename?: 'ServiceMutations';
  /** Contract-related mutations (Phase 2 - SXP). */
  contract: ServiceContractMutations;
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


/**
 *  ============================================================
 *  Mutation Namespaces
 *  ============================================================
 */
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

/**
 *  ============================================================
 *  Query Namespaces
 *  ============================================================
 */
export type ServiceQueries = {
  __typename?: 'ServiceQueries';
  /** Contract-related queries (Phase 2 - SXP). */
  contract: ServiceContractQueries;
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


/**
 *  ============================================================
 *  Query Namespaces
 *  ============================================================
 */
export type ServiceQueriesListArgs = {
  input: ServiceListInput;
};


/**
 *  ============================================================
 *  Query Namespaces
 *  ============================================================
 */
export type ServiceQueriesOneArgs = {
  input: ServiceOneInput;
};

/**
 *  ============================================================
 *  Enums
 *  ============================================================
 */
export enum ServiceType {
  Core = 'CORE',
  Extension = 'EXTENSION',
  External = 'EXTERNAL'
}

/**
 *  ============================================================
 *  Mutation Input Types
 *  ============================================================
 */
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

/**
 * Subgraph - A GraphQL service registered with Service Exchange Portal.
 * Each subgraph exposes a GraphQL schema that can be composed into the unified supergraph.
 */
export type Subgraph = {
  __typename?: 'Subgraph';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Human-readable display name */
  displayName?: Maybe<Scalars['String']['output']>;
  /** Consecutive failure count */
  failureCount: Scalars['Int']['output'];
  /** GraphQL endpoint URL */
  graphqlUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Last successful health check */
  lastHealthyAt?: Maybe<Scalars['DateTime']['output']>;
  /** Unique name of the subgraph (e.g., sgc, aac, imc) */
  name: Scalars['String']['output'];
  /** Routing priority (lower = higher priority) */
  priority: Scalars['Int']['output'];
  /** SHA-256 hash of the current schema */
  schemaHash?: Maybe<Scalars['String']['output']>;
  /** Current status */
  status: SubgraphStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type SubgraphConnection = {
  __typename?: 'SubgraphConnection';
  items: Array<Subgraph>;
  total: Scalars['Int']['output'];
};

/**
 *  ============================================================
 *  Exchange Input Types
 *  ============================================================
 */
export type SubgraphRegisterInput = {
  /** Human-readable display name */
  displayName?: InputMaybe<Scalars['String']['input']>;
  /** GraphQL endpoint URL */
  graphqlUrl: Scalars['String']['input'];
  /** Unique name for the subgraph (e.g., aac, imc) */
  name: Scalars['String']['input'];
  /** Routing priority (lower = higher priority, default: 100) */
  priority?: InputMaybe<Scalars['Int']['input']>;
};

/** Schema information for a subgraph */
export type SubgraphSchema = {
  __typename?: 'SubgraphSchema';
  /** Whether the schema changed from previous version */
  changed: Scalars['Boolean']['output'];
  /** SHA-256 hash of the current schema */
  hash: Scalars['String']['output'];
  /** Subgraph name */
  name: Scalars['String']['output'];
  /** When this refresh operation was performed */
  refreshedAt: Scalars['DateTime']['output'];
  /** Schema SDL (if available) */
  sdl?: Maybe<Scalars['String']['output']>;
};

/** Status of a subgraph in the federation */
export enum SubgraphStatus {
  /** Active and healthy, receiving traffic */
  Active = 'ACTIVE',
  /** Manually disabled or removed */
  Inactive = 'INACTIVE',
  /** Newly registered, not yet verified */
  Pending = 'PENDING',
  /** Temporarily unhealthy, excluded from routing */
  Unhealthy = 'UNHEALTHY'
}

export type SubgraphUpdateInput = {
  /** New display name */
  displayName?: InputMaybe<Scalars['String']['input']>;
  /** New GraphQL endpoint URL */
  graphqlUrl?: InputMaybe<Scalars['String']['input']>;
  /** Subgraph name to update */
  name: Scalars['String']['input'];
  /** New routing priority */
  priority?: InputMaybe<Scalars['Int']['input']>;
};

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String']['output'];
};

export type UpsertGraphQlContractMutationVariables = Exact<{
  input: GraphQlContractUpsertInput;
}>;


export type UpsertGraphQlContractMutation = { __typename?: 'Mutation', service: { __typename?: 'ServiceMutations', contract: { __typename?: 'ServiceContractMutations', upsertGraphQL: { __typename?: 'ServiceContract', id: string, tenant: string, serviceId: string, type: ContractType, protocol: Protocol, version?: string | null, deprecated: boolean, createdAt?: any | null, updatedAt?: any | null, graphql?: { __typename?: 'GraphQLContractType', operation: string, schema?: { __typename?: 'SchemaReferenceType', url: string, hash?: string | null, version?: string | null } | null } | null, deprecation?: { __typename?: 'DeprecationType', reason: string, since?: string | null, alternative?: string | null, removal?: string | null } | null } } } };

export type DeprecateContractMutationVariables = Exact<{
  input: ContractDeprecateInput;
}>;


export type DeprecateContractMutation = { __typename?: 'Mutation', service: { __typename?: 'ServiceMutations', contract: { __typename?: 'ServiceContractMutations', deprecate: { __typename?: 'ServiceContract', id: string, tenant: string, serviceId: string, type: ContractType, protocol: Protocol, version?: string | null, deprecated: boolean, createdAt?: any | null, updatedAt?: any | null, graphql?: { __typename?: 'GraphQLContractType', operation: string, schema?: { __typename?: 'SchemaReferenceType', url: string, hash?: string | null, version?: string | null } | null } | null, deprecation?: { __typename?: 'DeprecationType', reason: string, since?: string | null, alternative?: string | null, removal?: string | null } | null } } } };

export type DeleteContractMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteContractMutation = { __typename?: 'Mutation', service: { __typename?: 'ServiceMutations', contract: { __typename?: 'ServiceContractMutations', delete: boolean } } };

export type ServiceContractFieldsFragment = { __typename?: 'ServiceContract', id: string, tenant: string, serviceId: string, type: ContractType, protocol: Protocol, version?: string | null, deprecated: boolean, createdAt?: any | null, updatedAt?: any | null, graphql?: { __typename?: 'GraphQLContractType', operation: string, schema?: { __typename?: 'SchemaReferenceType', url: string, hash?: string | null, version?: string | null } | null } | null, deprecation?: { __typename?: 'DeprecationType', reason: string, since?: string | null, alternative?: string | null, removal?: string | null } | null };

export type ListContractsQueryVariables = Exact<{
  input: ContractListInput;
}>;


export type ListContractsQuery = { __typename?: 'Query', service: { __typename?: 'ServiceQueries', contract: { __typename?: 'ServiceContractQueries', list: { __typename?: 'ServiceContractConnection', total: number, limit: number, offset: number, items: Array<{ __typename?: 'ServiceContract', id: string, tenant: string, serviceId: string, type: ContractType, protocol: Protocol, version?: string | null, deprecated: boolean, createdAt?: any | null, updatedAt?: any | null, graphql?: { __typename?: 'GraphQLContractType', operation: string, schema?: { __typename?: 'SchemaReferenceType', url: string, hash?: string | null, version?: string | null } | null } | null, deprecation?: { __typename?: 'DeprecationType', reason: string, since?: string | null, alternative?: string | null, removal?: string | null } | null }> } } } };

export type GetContractQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetContractQuery = { __typename?: 'Query', service: { __typename?: 'ServiceQueries', contract: { __typename?: 'ServiceContractQueries', one: { __typename?: 'ServiceContract', id: string, tenant: string, serviceId: string, type: ContractType, protocol: Protocol, version?: string | null, deprecated: boolean, createdAt?: any | null, updatedAt?: any | null, graphql?: { __typename?: 'GraphQLContractType', operation: string, schema?: { __typename?: 'SchemaReferenceType', url: string, hash?: string | null, version?: string | null } | null } | null, deprecation?: { __typename?: 'DeprecationType', reason: string, since?: string | null, alternative?: string | null, removal?: string | null } | null } } } };

export type ServiceIdentityFieldsFragment = { __typename?: 'Service', id: string, slug: string, displayName: string, type: ServiceType };

export type ServiceContractSummaryFragment = { __typename?: 'ServiceContract', id: string, type: ContractType, protocol: Protocol, deprecated: boolean, graphql?: { __typename?: 'GraphQLContractType', operation: string } | null };

export type ProvidesNodeFieldsFragment = { __typename?: 'ProvidesNode', contract: { __typename?: 'ServiceContract', id: string, type: ContractType, protocol: Protocol, deprecated: boolean, graphql?: { __typename?: 'GraphQLContractType', operation: string } | null }, consumers: Array<{ __typename?: 'Service', id: string, slug: string, displayName: string, type: ServiceType }> };

export type ConsumesNodeFieldsFragment = { __typename?: 'ConsumesNode', contract: { __typename?: 'ServiceContract', id: string, type: ContractType, protocol: Protocol, deprecated: boolean, graphql?: { __typename?: 'GraphQLContractType', operation: string } | null }, providers: Array<{ __typename?: 'Service', id: string, slug: string, displayName: string, type: ServiceType }> };

export type GetDependencyGraphQueryVariables = Exact<{
  input: DependencyGraphInput;
}>;


export type GetDependencyGraphQuery = { __typename?: 'Query', service: { __typename?: 'ServiceQueries', contract: { __typename?: 'ServiceContractQueries', dependencies: { __typename?: 'ContractDependencyGraph', service: { __typename?: 'Service', id: string, slug: string, displayName: string, type: ServiceType }, provides: Array<{ __typename?: 'ProvidesNode', contract: { __typename?: 'ServiceContract', id: string, type: ContractType, protocol: Protocol, deprecated: boolean, graphql?: { __typename?: 'GraphQLContractType', operation: string } | null }, consumers: Array<{ __typename?: 'Service', id: string, slug: string, displayName: string, type: ServiceType }> }>, consumes: Array<{ __typename?: 'ConsumesNode', contract: { __typename?: 'ServiceContract', id: string, type: ContractType, protocol: Protocol, deprecated: boolean, graphql?: { __typename?: 'GraphQLContractType', operation: string } | null }, providers: Array<{ __typename?: 'Service', id: string, slug: string, displayName: string, type: ServiceType }> }> } } } };

export type GetServiceDetailQueryVariables = Exact<{
  input: ServiceOneInput;
}>;


export type GetServiceDetailQuery = { __typename?: 'Query', service: { __typename?: 'ServiceQueries', one: { __typename?: 'Service', id: string, slug: string, displayName: string, type: ServiceType, lifecycle?: ServiceLifecycle | null, repoUrl?: string | null, docsUrl?: string | null, tags?: Array<string> | null, createdAt?: any | null, updatedAt?: any | null, health?: { __typename?: 'ServiceHealthSummary', status: HealthStatus, lastCheckedAt?: any | null, lastSuccessAt?: any | null, lastFailureAt?: any | null } | null, dependencies: Array<{ __typename?: 'ServiceDependency', critical: boolean, target: { __typename?: 'ServiceIdentity', id: string, slug: string, displayName: string } }>, instances: Array<{ __typename?: 'ServiceInstance', id: string, key: string, environment: Environment, baseUrl: string, healthPath: string, enabled: boolean, probeApprovalStatus: ProbeApprovalStatus, lastStatus: HealthStatus, lastCheckedAt?: any | null, lastFailureReason?: string | null }> } } };

export type RegisterSubgraphMutationVariables = Exact<{
  input: SubgraphRegisterInput;
}>;


export type RegisterSubgraphMutation = { __typename?: 'Mutation', exchange: { __typename?: 'ExchangeMutations', subgraph: { __typename?: 'ExchangeSubgraphMutations', register: { __typename?: 'Subgraph', id: string, name: string, displayName?: string | null, graphqlUrl: string, status: SubgraphStatus, schemaHash?: string | null, lastHealthyAt?: any | null, failureCount: number, priority: number, createdAt?: any | null, updatedAt?: any | null } } } };

export type UpdateSubgraphMutationVariables = Exact<{
  input: SubgraphUpdateInput;
}>;


export type UpdateSubgraphMutation = { __typename?: 'Mutation', exchange: { __typename?: 'ExchangeMutations', subgraph: { __typename?: 'ExchangeSubgraphMutations', update: { __typename?: 'Subgraph', id: string, name: string, displayName?: string | null, graphqlUrl: string, status: SubgraphStatus, schemaHash?: string | null, lastHealthyAt?: any | null, failureCount: number, priority: number, createdAt?: any | null, updatedAt?: any | null } } } };

export type ActivateSubgraphMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type ActivateSubgraphMutation = { __typename?: 'Mutation', exchange: { __typename?: 'ExchangeMutations', subgraph: { __typename?: 'ExchangeSubgraphMutations', activate: { __typename?: 'Subgraph', id: string, name: string, displayName?: string | null, graphqlUrl: string, status: SubgraphStatus, schemaHash?: string | null, lastHealthyAt?: any | null, failureCount: number, priority: number, createdAt?: any | null, updatedAt?: any | null } } } };

export type DeactivateSubgraphMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type DeactivateSubgraphMutation = { __typename?: 'Mutation', exchange: { __typename?: 'ExchangeMutations', subgraph: { __typename?: 'ExchangeSubgraphMutations', deactivate: { __typename?: 'Subgraph', id: string, name: string, displayName?: string | null, graphqlUrl: string, status: SubgraphStatus, schemaHash?: string | null, lastHealthyAt?: any | null, failureCount: number, priority: number, createdAt?: any | null, updatedAt?: any | null } } } };

export type RemoveSubgraphMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type RemoveSubgraphMutation = { __typename?: 'Mutation', exchange: { __typename?: 'ExchangeMutations', subgraph: { __typename?: 'ExchangeSubgraphMutations', remove: boolean } } };

export type RefreshSubgraphSchemaMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type RefreshSubgraphSchemaMutation = { __typename?: 'Mutation', exchange: { __typename?: 'ExchangeMutations', subgraph: { __typename?: 'ExchangeSubgraphMutations', schema: { __typename?: 'ExchangeSubgraphSchemaMutations', refresh?: { __typename?: 'SubgraphSchema', name: string, hash: string, sdl?: string | null, refreshedAt: any, changed: boolean } | null } } } };

export type SubgraphFieldsFragment = { __typename?: 'Subgraph', id: string, name: string, displayName?: string | null, graphqlUrl: string, status: SubgraphStatus, schemaHash?: string | null, lastHealthyAt?: any | null, failureCount: number, priority: number, createdAt?: any | null, updatedAt?: any | null };

export type SubgraphSchemaFieldsFragment = { __typename?: 'SubgraphSchema', name: string, hash: string, sdl?: string | null, refreshedAt: any, changed: boolean };

export type ListSubgraphsQueryVariables = Exact<{
  status?: InputMaybe<SubgraphStatus>;
}>;


export type ListSubgraphsQuery = { __typename?: 'Query', exchange: { __typename?: 'ExchangeQueries', subgraph: { __typename?: 'ExchangeSubgraphQueries', list: { __typename?: 'SubgraphConnection', total: number, items: Array<{ __typename?: 'Subgraph', id: string, name: string, displayName?: string | null, graphqlUrl: string, status: SubgraphStatus, schemaHash?: string | null, lastHealthyAt?: any | null, failureCount: number, priority: number, createdAt?: any | null, updatedAt?: any | null }> } } } };

export type GetSubgraphQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type GetSubgraphQuery = { __typename?: 'Query', exchange: { __typename?: 'ExchangeQueries', subgraph: { __typename?: 'ExchangeSubgraphQueries', one?: { __typename?: 'Subgraph', id: string, name: string, displayName?: string | null, graphqlUrl: string, status: SubgraphStatus, schemaHash?: string | null, lastHealthyAt?: any | null, failureCount: number, priority: number, createdAt?: any | null, updatedAt?: any | null } | null } } };

export type GetExchangeHealthQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExchangeHealthQuery = { __typename?: 'Query', exchange: { __typename?: 'ExchangeQueries', health: { __typename?: 'ExchangeHealthStatus', status: string, activeSubgraphs: number, totalSubgraphs: number, unhealthySubgraphs: Array<string> } } };

export type ListServicesQueryVariables = Exact<{
  input: ServiceListInput;
}>;


export type ListServicesQuery = { __typename?: 'Query', service: { __typename?: 'ServiceQueries', list: { __typename?: 'ServiceConnection', total: number, limit: number, offset: number, items: Array<{ __typename?: 'Service', id: string, slug: string, displayName: string, type: ServiceType, lifecycle?: ServiceLifecycle | null, tags?: Array<string> | null, createdAt?: any | null, updatedAt?: any | null, health?: { __typename?: 'ServiceHealthSummary', status: HealthStatus, lastCheckedAt?: any | null } | null }> } } };

export type AcknowledgeNotificationsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type AcknowledgeNotificationsMutation = { __typename?: 'Mutation', exchange: { __typename?: 'ExchangeMutations', notification: { __typename?: 'ExchangeNotificationMutations', acknowledge: Array<{ __typename?: 'SchemaChangeNotification', id: string, source: string, target: string, contract: string, summary: string, detectedAt: any, acknowledged: boolean, acknowledgedAt?: any | null, acknowledgedBy?: string | null, schemaChange: { __typename?: 'SchemaChange', id: string, subgraphName: string, severity: ChangeSeverity, diffSummary: string, detectedAt: any, hash: { __typename?: 'SchemaHashPair', old: string, new: string } } }> } } };

export type AcknowledgeDeprecationNotificationsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type AcknowledgeDeprecationNotificationsMutation = { __typename?: 'Mutation', exchange: { __typename?: 'ExchangeMutations', notification: { __typename?: 'ExchangeNotificationMutations', deprecation: { __typename?: 'ExchangeDeprecationNotificationMutations', acknowledge: Array<{ __typename?: 'ContractDeprecationNotification', id: string, contractId: string, source: string, target: string, contractIdentifier: string, reason?: string | null, sinceVersion?: string | null, alternative?: string | null, removalVersion?: string | null, createdAt: any, acknowledged: boolean, acknowledgedAt?: any | null, acknowledgedBy?: string | null }> } } } };

export type SchemaChangeFieldsFragment = { __typename?: 'SchemaChange', id: string, subgraphName: string, severity: ChangeSeverity, diffSummary: string, detectedAt: any, hash: { __typename?: 'SchemaHashPair', old: string, new: string } };

export type NotificationFieldsFragment = { __typename?: 'SchemaChangeNotification', id: string, source: string, target: string, contract: string, summary: string, detectedAt: any, acknowledged: boolean, acknowledgedAt?: any | null, acknowledgedBy?: string | null, schemaChange: { __typename?: 'SchemaChange', id: string, subgraphName: string, severity: ChangeSeverity, diffSummary: string, detectedAt: any, hash: { __typename?: 'SchemaHashPair', old: string, new: string } } };

export type ListNotificationsQueryVariables = Exact<{
  input: NotificationListInput;
}>;


export type ListNotificationsQuery = { __typename?: 'Query', exchange: { __typename?: 'ExchangeQueries', notification: { __typename?: 'ExchangeNotificationQueries', list: { __typename?: 'SchemaChangeNotificationConnection', total: number, limit: number, offset: number, items: Array<{ __typename?: 'SchemaChangeNotification', id: string, source: string, target: string, contract: string, summary: string, detectedAt: any, acknowledged: boolean, acknowledgedAt?: any | null, acknowledgedBy?: string | null, schemaChange: { __typename?: 'SchemaChange', id: string, subgraphName: string, severity: ChangeSeverity, diffSummary: string, detectedAt: any, hash: { __typename?: 'SchemaHashPair', old: string, new: string } } }> } } } };

export type DeprecationNotificationFieldsFragment = { __typename?: 'ContractDeprecationNotification', id: string, contractId: string, source: string, target: string, contractIdentifier: string, reason?: string | null, sinceVersion?: string | null, alternative?: string | null, removalVersion?: string | null, createdAt: any, acknowledged: boolean, acknowledgedAt?: any | null, acknowledgedBy?: string | null };

export type ListDeprecationNotificationsQueryVariables = Exact<{
  input: DeprecationNotificationListInput;
}>;


export type ListDeprecationNotificationsQuery = { __typename?: 'Query', exchange: { __typename?: 'ExchangeQueries', notification: { __typename?: 'ExchangeNotificationQueries', deprecation: { __typename?: 'ExchangeDeprecationNotificationQueries', list: { __typename?: 'ContractDeprecationNotificationConnection', total: number, limit: number, offset: number, items: Array<{ __typename?: 'ContractDeprecationNotification', id: string, contractId: string, source: string, target: string, contractIdentifier: string, reason?: string | null, sinceVersion?: string | null, alternative?: string | null, removalVersion?: string | null, createdAt: any, acknowledged: boolean, acknowledgedAt?: any | null, acknowledgedBy?: string | null }> } } } } };

export const ServiceContractFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ServiceContractFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceContract"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"serviceId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"protocol"}},{"kind":"Field","name":{"kind":"Name","value":"graphql"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"schema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"hash"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"deprecation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"since"}},{"kind":"Field","name":{"kind":"Name","value":"alternative"}},{"kind":"Field","name":{"kind":"Name","value":"removal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deprecated"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ServiceContractFieldsFragment, unknown>;
export const ServiceContractSummaryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ServiceContractSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceContract"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"protocol"}},{"kind":"Field","name":{"kind":"Name","value":"graphql"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deprecated"}}]}}]} as unknown as DocumentNode<ServiceContractSummaryFragment, unknown>;
export const ServiceIdentityFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ServiceIdentityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Service"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<ServiceIdentityFieldsFragment, unknown>;
export const ProvidesNodeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProvidesNodeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProvidesNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contract"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ServiceContractSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"consumers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ServiceIdentityFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ServiceIdentityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Service"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ServiceContractSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceContract"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"protocol"}},{"kind":"Field","name":{"kind":"Name","value":"graphql"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deprecated"}}]}}]} as unknown as DocumentNode<ProvidesNodeFieldsFragment, unknown>;
export const ConsumesNodeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConsumesNodeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConsumesNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contract"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ServiceContractSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ServiceIdentityFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ServiceIdentityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Service"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ServiceContractSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceContract"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"protocol"}},{"kind":"Field","name":{"kind":"Name","value":"graphql"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deprecated"}}]}}]} as unknown as DocumentNode<ConsumesNodeFieldsFragment, unknown>;
export const SubgraphFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubgraphFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Subgraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"graphqlUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schemaHash"}},{"kind":"Field","name":{"kind":"Name","value":"lastHealthyAt"}},{"kind":"Field","name":{"kind":"Name","value":"failureCount"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<SubgraphFieldsFragment, unknown>;
export const SubgraphSchemaFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubgraphSchemaFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubgraphSchema"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hash"}},{"kind":"Field","name":{"kind":"Name","value":"sdl"}},{"kind":"Field","name":{"kind":"Name","value":"refreshedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changed"}}]}}]} as unknown as DocumentNode<SubgraphSchemaFieldsFragment, unknown>;
export const SchemaChangeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchemaChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SchemaChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subgraphName"}},{"kind":"Field","name":{"kind":"Name","value":"hash"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"old"}},{"kind":"Field","name":{"kind":"Name","value":"new"}}]}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"diffSummary"}},{"kind":"Field","name":{"kind":"Name","value":"detectedAt"}}]}}]} as unknown as DocumentNode<SchemaChangeFieldsFragment, unknown>;
export const NotificationFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SchemaChangeNotification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"contract"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"schemaChange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SchemaChangeFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"detectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledged"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledgedBy"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchemaChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SchemaChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subgraphName"}},{"kind":"Field","name":{"kind":"Name","value":"hash"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"old"}},{"kind":"Field","name":{"kind":"Name","value":"new"}}]}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"diffSummary"}},{"kind":"Field","name":{"kind":"Name","value":"detectedAt"}}]}}]} as unknown as DocumentNode<NotificationFieldsFragment, unknown>;
export const DeprecationNotificationFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeprecationNotificationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContractDeprecationNotification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contractId"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"contractIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"sinceVersion"}},{"kind":"Field","name":{"kind":"Name","value":"alternative"}},{"kind":"Field","name":{"kind":"Name","value":"removalVersion"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledged"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledgedBy"}}]}}]} as unknown as DocumentNode<DeprecationNotificationFieldsFragment, unknown>;
export const UpsertGraphQlContractDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertGraphQLContract"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GraphQLContractUpsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contract"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertGraphQL"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ServiceContractFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ServiceContractFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceContract"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"serviceId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"protocol"}},{"kind":"Field","name":{"kind":"Name","value":"graphql"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"schema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"hash"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"deprecation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"since"}},{"kind":"Field","name":{"kind":"Name","value":"alternative"}},{"kind":"Field","name":{"kind":"Name","value":"removal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deprecated"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpsertGraphQlContractMutation, UpsertGraphQlContractMutationVariables>;
export const DeprecateContractDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeprecateContract"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContractDeprecateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contract"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deprecate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ServiceContractFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ServiceContractFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceContract"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"serviceId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"protocol"}},{"kind":"Field","name":{"kind":"Name","value":"graphql"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"schema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"hash"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"deprecation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"since"}},{"kind":"Field","name":{"kind":"Name","value":"alternative"}},{"kind":"Field","name":{"kind":"Name","value":"removal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deprecated"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<DeprecateContractMutation, DeprecateContractMutationVariables>;
export const DeleteContractDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteContract"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contract"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]}}]}}]} as unknown as DocumentNode<DeleteContractMutation, DeleteContractMutationVariables>;
export const ListContractsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListContracts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContractListInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contract"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ServiceContractFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ServiceContractFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceContract"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"serviceId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"protocol"}},{"kind":"Field","name":{"kind":"Name","value":"graphql"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"schema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"hash"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"deprecation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"since"}},{"kind":"Field","name":{"kind":"Name","value":"alternative"}},{"kind":"Field","name":{"kind":"Name","value":"removal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deprecated"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ListContractsQuery, ListContractsQueryVariables>;
export const GetContractDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetContract"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contract"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ServiceContractFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ServiceContractFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceContract"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"serviceId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"protocol"}},{"kind":"Field","name":{"kind":"Name","value":"graphql"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"schema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"hash"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"deprecation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"since"}},{"kind":"Field","name":{"kind":"Name","value":"alternative"}},{"kind":"Field","name":{"kind":"Name","value":"removal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deprecated"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetContractQuery, GetContractQueryVariables>;
export const GetDependencyGraphDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDependencyGraph"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DependencyGraphInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contract"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dependencies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ServiceIdentityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"provides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProvidesNodeFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"consumes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConsumesNodeFields"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ServiceIdentityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Service"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ServiceContractSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceContract"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"protocol"}},{"kind":"Field","name":{"kind":"Name","value":"graphql"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deprecated"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProvidesNodeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProvidesNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contract"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ServiceContractSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"consumers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ServiceIdentityFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConsumesNodeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConsumesNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contract"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ServiceContractSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ServiceIdentityFields"}}]}}]}}]} as unknown as DocumentNode<GetDependencyGraphQuery, GetDependencyGraphQueryVariables>;
export const GetServiceDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetServiceDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceOneInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"lifecycle"}},{"kind":"Field","name":{"kind":"Name","value":"repoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"docsUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastCheckedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastSuccessAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastFailureAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dependencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"critical"}}]}},{"kind":"Field","name":{"kind":"Name","value":"instances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"environment"}},{"kind":"Field","name":{"kind":"Name","value":"baseUrl"}},{"kind":"Field","name":{"kind":"Name","value":"healthPath"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"probeApprovalStatus"}},{"kind":"Field","name":{"kind":"Name","value":"lastStatus"}},{"kind":"Field","name":{"kind":"Name","value":"lastCheckedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastFailureReason"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetServiceDetailQuery, GetServiceDetailQueryVariables>;
export const RegisterSubgraphDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterSubgraph"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubgraphRegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exchange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subgraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubgraphFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubgraphFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Subgraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"graphqlUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schemaHash"}},{"kind":"Field","name":{"kind":"Name","value":"lastHealthyAt"}},{"kind":"Field","name":{"kind":"Name","value":"failureCount"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RegisterSubgraphMutation, RegisterSubgraphMutationVariables>;
export const UpdateSubgraphDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSubgraph"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubgraphUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exchange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subgraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubgraphFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubgraphFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Subgraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"graphqlUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schemaHash"}},{"kind":"Field","name":{"kind":"Name","value":"lastHealthyAt"}},{"kind":"Field","name":{"kind":"Name","value":"failureCount"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateSubgraphMutation, UpdateSubgraphMutationVariables>;
export const ActivateSubgraphDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ActivateSubgraph"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exchange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subgraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubgraphFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubgraphFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Subgraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"graphqlUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schemaHash"}},{"kind":"Field","name":{"kind":"Name","value":"lastHealthyAt"}},{"kind":"Field","name":{"kind":"Name","value":"failureCount"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ActivateSubgraphMutation, ActivateSubgraphMutationVariables>;
export const DeactivateSubgraphDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeactivateSubgraph"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exchange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subgraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubgraphFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubgraphFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Subgraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"graphqlUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schemaHash"}},{"kind":"Field","name":{"kind":"Name","value":"lastHealthyAt"}},{"kind":"Field","name":{"kind":"Name","value":"failureCount"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<DeactivateSubgraphMutation, DeactivateSubgraphMutationVariables>;
export const RemoveSubgraphDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveSubgraph"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exchange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subgraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"remove"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]}}]}}]} as unknown as DocumentNode<RemoveSubgraphMutation, RemoveSubgraphMutationVariables>;
export const RefreshSubgraphSchemaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshSubgraphSchema"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exchange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subgraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubgraphSchemaFields"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubgraphSchemaFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SubgraphSchema"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hash"}},{"kind":"Field","name":{"kind":"Name","value":"sdl"}},{"kind":"Field","name":{"kind":"Name","value":"refreshedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changed"}}]}}]} as unknown as DocumentNode<RefreshSubgraphSchemaMutation, RefreshSubgraphSchemaMutationVariables>;
export const ListSubgraphsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListSubgraphs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SubgraphStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exchange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subgraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubgraphFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubgraphFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Subgraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"graphqlUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schemaHash"}},{"kind":"Field","name":{"kind":"Name","value":"lastHealthyAt"}},{"kind":"Field","name":{"kind":"Name","value":"failureCount"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ListSubgraphsQuery, ListSubgraphsQueryVariables>;
export const GetSubgraphDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSubgraph"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exchange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subgraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubgraphFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubgraphFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Subgraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"graphqlUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schemaHash"}},{"kind":"Field","name":{"kind":"Name","value":"lastHealthyAt"}},{"kind":"Field","name":{"kind":"Name","value":"failureCount"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetSubgraphQuery, GetSubgraphQueryVariables>;
export const GetExchangeHealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExchangeHealth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exchange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"activeSubgraphs"}},{"kind":"Field","name":{"kind":"Name","value":"totalSubgraphs"}},{"kind":"Field","name":{"kind":"Name","value":"unhealthySubgraphs"}}]}}]}}]}}]} as unknown as DocumentNode<GetExchangeHealthQuery, GetExchangeHealthQueryVariables>;
export const ListServicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListServices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ServiceListInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"lifecycle"}},{"kind":"Field","name":{"kind":"Name","value":"health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastCheckedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}}]}}]}}]}}]} as unknown as DocumentNode<ListServicesQuery, ListServicesQueryVariables>;
export const AcknowledgeNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcknowledgeNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exchange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acknowledge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchemaChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SchemaChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subgraphName"}},{"kind":"Field","name":{"kind":"Name","value":"hash"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"old"}},{"kind":"Field","name":{"kind":"Name","value":"new"}}]}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"diffSummary"}},{"kind":"Field","name":{"kind":"Name","value":"detectedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SchemaChangeNotification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"contract"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"schemaChange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SchemaChangeFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"detectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledged"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledgedBy"}}]}}]} as unknown as DocumentNode<AcknowledgeNotificationsMutation, AcknowledgeNotificationsMutationVariables>;
export const AcknowledgeDeprecationNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcknowledgeDeprecationNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exchange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deprecation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acknowledge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeprecationNotificationFields"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeprecationNotificationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContractDeprecationNotification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contractId"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"contractIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"sinceVersion"}},{"kind":"Field","name":{"kind":"Name","value":"alternative"}},{"kind":"Field","name":{"kind":"Name","value":"removalVersion"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledged"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledgedBy"}}]}}]} as unknown as DocumentNode<AcknowledgeDeprecationNotificationsMutation, AcknowledgeDeprecationNotificationsMutationVariables>;
export const ListNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationListInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exchange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchemaChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SchemaChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subgraphName"}},{"kind":"Field","name":{"kind":"Name","value":"hash"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"old"}},{"kind":"Field","name":{"kind":"Name","value":"new"}}]}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"diffSummary"}},{"kind":"Field","name":{"kind":"Name","value":"detectedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SchemaChangeNotification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"contract"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"schemaChange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SchemaChangeFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"detectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledged"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledgedBy"}}]}}]} as unknown as DocumentNode<ListNotificationsQuery, ListNotificationsQueryVariables>;
export const ListDeprecationNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDeprecationNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeprecationNotificationListInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exchange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deprecation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeprecationNotificationFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeprecationNotificationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContractDeprecationNotification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contractId"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"contractIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"sinceVersion"}},{"kind":"Field","name":{"kind":"Name","value":"alternative"}},{"kind":"Field","name":{"kind":"Name","value":"removalVersion"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledged"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"acknowledgedBy"}}]}}]} as unknown as DocumentNode<ListDeprecationNotificationsQuery, ListDeprecationNotificationsQueryVariables>;