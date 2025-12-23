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
  _FieldSet: { input: any; output: any; }
};

/** Account (Authentication Identity) */
export type Account = {
  __typename?: 'Account';
  /** Account creation timestamp */
  createdAt: Scalars['String']['output'];
  /** Email address */
  email?: Maybe<Scalars['String']['output']>;
  /** Email verified status */
  emailVerified: Scalars['Boolean']['output'];
  /** Keycloak User ID (self-referencing ID) */
  id: Scalars['String']['output'];
  /** Account status */
  status: AccountStatus;
  /** Username */
  username: Scalars['String']['output'];
};

/** Account connection with pagination support */
export type AccountConnection = {
  __typename?: 'AccountConnection';
  /** List of accounts */
  items: Array<Account>;
  /** Pagination information */
  pagination: Pagination;
  /** Total number of accounts (filtered) */
  total: Scalars['Int']['output'];
};

/**
 * Account detail with extended information.
 * Includes basic info, attributes, and sessions.
 */
export type AccountDetail = {
  __typename?: 'AccountDetail';
  /** Keycloak user attributes (key-value pairs) */
  attributes: Array<AttributeEntry>;
  /** Account creation timestamp */
  createdAt: Scalars['String']['output'];
  /** Email address */
  email?: Maybe<Scalars['String']['output']>;
  /** Email verified status */
  emailVerified: Scalars['Boolean']['output'];
  /** First name */
  firstName?: Maybe<Scalars['String']['output']>;
  /** Keycloak User ID (self-referencing ID) */
  id: Scalars['String']['output'];
  /** Last name */
  lastName?: Maybe<Scalars['String']['output']>;
  /** Active sessions for this account */
  sessions: Array<SessionInfo>;
  /** Account status */
  status: AccountStatus;
  /** Last updated timestamp */
  updatedAt?: Maybe<Scalars['String']['output']>;
  /** Username */
  username: Scalars['String']['output'];
};

/** Email-related mutations for an account */
export type AccountEmailMutations = {
  __typename?: 'AccountEmailMutations';
  /**
   * Verify email address.
   * - User self-verify: Click email link (context.role = USER)
   * - Admin verify: Manual activation (context.role = ADMIN)
   */
  verify: VerifyEmailResult;
};


/** Email-related mutations for an account */
export type AccountEmailMutationsVerifyArgs = {
  accountId: Scalars['String']['input'];
  context: OperationContext;
};

/** Account-related mutations */
export type AccountMutations = {
  __typename?: 'AccountMutations';
  /** Email-related operations for an account */
  email: AccountEmailMutations;
};

/** Account-related queries */
export type AccountQueries = {
  __typename?: 'AccountQueries';
  /**
   * List accounts with optional filters.
   * Phase 8: Returns all matching accounts (queries.pagination ignored)
   * Phase 9: Implements pagination logic via queries.pagination
   */
  list: AccountConnection;
  /**
   * Get account detail by ID (Phase 9 - UM-005).
   * Returns extended account information including attributes and sessions.
   */
  one: AccountDetail;
};


/** Account-related queries */
export type AccountQueriesListArgs = {
  queries?: InputMaybe<ListQueriesInput>;
  status?: InputMaybe<AccountStatus>;
};


/** Account-related queries */
export type AccountQueriesOneArgs = {
  id: Scalars['String']['input'];
};

/** Account status enumeration */
export enum AccountStatus {
  /** Active and verified */
  Active = 'ACTIVE',
  /** Administratively disabled */
  Locked = 'LOCKED',
  /** Email not verified yet */
  PendingVerification = 'PENDING_VERIFICATION',
  /** User disabled or has required actions */
  Suspended = 'SUSPENDED'
}

/**
 * Key-value attribute entry.
 * Sensitive values like emailVerificationToken are masked.
 */
export type AttributeEntry = {
  __typename?: 'AttributeEntry';
  /** Whether this is a sensitive field */
  isSensitive: Scalars['Boolean']['output'];
  /** Attribute key */
  key: Scalars['String']['output'];
  /** Attribute value (masked if sensitive) */
  value: Scalars['String']['output'];
};

/**  Output Types */
export type AuthResult = {
  __typename?: 'AuthResult';
  accessToken?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  expiresIn?: Maybe<Scalars['Int']['output']>;
  identityContext?: Maybe<IdentityContext>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  tokenType?: Maybe<Scalars['String']['output']>;
};

/** Authentication-related mutations */
export type AuthenticateMutations = {
  __typename?: 'AuthenticateMutations';
  /**
   * Enter a tenant after credential verification.
   * Used when user has multiple tenants and selected one.
   */
  enter: AuthResult;
  /**
   * Universal login operation.
   * - With tenant: Direct login to specific tenant
   * - Without tenant: Returns available tenants for selection
   * - Single tenant: Auto-enters and returns full auth result
   * - No tenants: Returns empty list (user needs onboarding)
   */
  login: LoginResult;
  /** Logout current session */
  logout: Scalars['Boolean']['output'];
  /** Refresh access token */
  refreshToken: AuthResult;
};


/** Authentication-related mutations */
export type AuthenticateMutationsEnterArgs = {
  subject: Scalars['String']['input'];
  tenantId: Scalars['String']['input'];
};


/** Authentication-related mutations */
export type AuthenticateMutationsLoginArgs = {
  password: Scalars['String']['input'];
  tenant?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};


/** Authentication-related mutations */
export type AuthenticateMutationsRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};

/** Email availability status (replaces EmailAvailability) */
export type EmailStatus = {
  __typename?: 'EmailStatus';
  /** Whether the email is available for registration */
  available: Scalars['Boolean']['output'];
  /** Reason if not available: EMAIL_ALREADY_EXISTS, INVALID_FORMAT, etc. */
  reason?: Maybe<Scalars['String']['output']>;
};

/** Result of email verification */
export type EmailVerificationResult = {
  __typename?: 'EmailVerificationResult';
  /** Account ID if successful */
  accountId?: Maybe<Scalars['String']['output']>;
  /** Message or error details */
  message?: Maybe<Scalars['String']['output']>;
  /** Whether verification was successful */
  success: Scalars['Boolean']['output'];
  /** User's tenant membership status */
  tenantStatus?: Maybe<TenantStatus>;
};

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

/** 4D Identity Context - Zone/Tenant/Subject/Groups */
export type IdentityContext = {
  __typename?: 'IdentityContext';
  groups: Array<Scalars['String']['output']>;
  subject: Subject;
  /** Tenant ID (Keycloak realm name) */
  tenant: Scalars['String']['output'];
  zone?: Maybe<Scalars['String']['output']>;
};

/** Query parameters for list operations */
export type ListQueriesInput = {
  /** Pagination parameters */
  pagination?: InputMaybe<PaginationInput>;
  /** Search parameters */
  search?: InputMaybe<SearchInput>;
  /** Sorting parameters */
  sort?: InputMaybe<SortInput>;
};

/** Login result - unified response for all login scenarios. */
export type LoginResult = {
  __typename?: 'LoginResult';
  /** Token fields - only present when single tenant (auto-entered) */
  accessToken?: Maybe<Scalars['String']['output']>;
  /** Error message if authentication failed */
  error?: Maybe<Scalars['String']['output']>;
  expiresIn?: Maybe<Scalars['Int']['output']>;
  identityContext?: Maybe<IdentityContext>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  /** User subject (for tenant selection if needed) */
  subject?: Maybe<Scalars['String']['output']>;
  /** Whether authentication was successful */
  success: Scalars['Boolean']['output'];
  /**
   * Available tenants:
   * - Empty: User has no tenants (needs onboarding)
   * - Single: Auto-entered (includes token fields)
   * - Multiple: User must call enter() to select
   */
  tenants?: Maybe<Array<Tenant>>;
  tokenType?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Account-related mutations (namespace API) */
  account: AccountMutations;
  /** Authentication-related mutations (new namespace) */
  authenticate: AuthenticateMutations;
  /** Registration-related mutations (new namespace) */
  registration: RegistrationMutations;
  /** Verify account email by admin (bypasses email verification flow) */
  verifyEmailByAdmin: EmailVerificationResult;
};


export type MutationVerifyEmailByAdminArgs = {
  accountId: Scalars['String']['input'];
};

/**
 * Operation context for mutations.
 * Captures who is performing the operation and why (for audit).
 */
export type OperationContext = {
  /** Optional: Reason for this operation (for audit) */
  reason?: InputMaybe<Scalars['String']['input']>;
  /** Who is performing this operation */
  role: OperationRole;
  /** Optional: Token for user self-service operations */
  token?: InputMaybe<Scalars['String']['input']>;
  /** Optional: User ID of the operator (for audit) */
  updatedBy?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Operation role enumeration.
 * Defines who is performing an operation.
 */
export enum OperationRole {
  /** Administrator operation */
  Admin = 'ADMIN',
  /** Anonymous/unauthenticated operation */
  Anonymous = 'ANONYMOUS',
  /** System automated operation */
  System = 'SYSTEM',
  /** End user self-service operation */
  User = 'USER'
}

/** Pagination information for list queries */
export type Pagination = {
  __typename?: 'Pagination';
  /** Current page number */
  current: Scalars['Int']['output'];
  /** Has next page */
  hasNext: Scalars['Boolean']['output'];
  /** Has previous page */
  hasPrev: Scalars['Boolean']['output'];
  /** Page size */
  size: Scalars['Int']['output'];
  /** Total number of pages */
  total: Scalars['Int']['output'];
};

/** Pagination input parameters */
export type PaginationInput = {
  /** Page number (1-based) */
  page?: InputMaybe<Scalars['Int']['input']>;
  /** Page size */
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  /** Account-related queries (namespace API) */
  account: AccountQueries;
  /** Current authenticated session */
  currentSession?: Maybe<Session>;
  /** Registration-related queries (new namespace) */
  registration: RegistrationQueries;
  /** Validate a JWT token */
  validateToken?: Maybe<TokenValidation>;
};


export type QueryValidateTokenArgs = {
  token: Scalars['String']['input'];
};

/** Input for user registration */
export type RegisterInput = {
  /** Required: Must accept terms of service */
  acceptTerms: Scalars['Boolean']['input'];
  /** Required: User's email address */
  email: Scalars['String']['input'];
  /** Optional: First name */
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** Optional: Last name */
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Optional: Preferred locale (e.g., 'en-US', 'ja-JP') */
  locale?: InputMaybe<Scalars['String']['input']>;
  /** Required: Password */
  password: Scalars['String']['input'];
  /** Optional: Realm/Tenant to apply for */
  realm?: InputMaybe<Scalars['String']['input']>;
  /** Optional: Username (if not provided, email will be used) */
  username?: InputMaybe<Scalars['String']['input']>;
};

/** Result of user registration */
export type RegisterResult = {
  __typename?: 'RegisterResult';
  /** Keycloak User ID (account ID) */
  accountId?: Maybe<Scalars['String']['output']>;
  /** If realm provided: the tenant applied to */
  appliedTenant?: Maybe<Scalars['String']['output']>;
  /** Success message or error details */
  message?: Maybe<Scalars['String']['output']>;
  /** Always true for email-based registration */
  requiresVerification: Scalars['Boolean']['output'];
  /** Whether registration was successful */
  success: Scalars['Boolean']['output'];
  /** Optional: for testing/debugging only */
  verificationToken?: Maybe<Scalars['String']['output']>;
};

/** Registration-related mutations */
export type RegistrationMutations = {
  __typename?: 'RegistrationMutations';
  /** Register a new user account */
  register: RegisterResult;
  /** Resend verification email to an unverified account */
  resendVerificationEmail: ResendVerificationResult;
  /** Verify email using verification token */
  verifyEmail: VerificationResult;
};


/** Registration-related mutations */
export type RegistrationMutationsRegisterArgs = {
  input: RegisterInput;
};


/** Registration-related mutations */
export type RegistrationMutationsResendVerificationEmailArgs = {
  email: Scalars['String']['input'];
};


/** Registration-related mutations */
export type RegistrationMutationsVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

/** Registration-related queries */
export type RegistrationQueries = {
  __typename?: 'RegistrationQueries';
  /** Check if email is available for registration */
  email: EmailStatus;
};


/** Registration-related queries */
export type RegistrationQueriesEmailArgs = {
  address: Scalars['String']['input'];
};

/** Resend verification email result */
export type ResendVerificationResult = {
  __typename?: 'ResendVerificationResult';
  /** Success message or error code */
  message: Scalars['String']['output'];
  /** Whether the resend operation was successful */
  success: Scalars['Boolean']['output'];
};

/** Search input parameters */
export type SearchInput = {
  /** Fields to search in */
  fields?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Search query string */
  query?: InputMaybe<Scalars['String']['input']>;
};

export type Session = {
  __typename?: 'Session';
  accountId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['String']['output']>;
  identityContext?: Maybe<IdentityContext>;
  isActive: Scalars['Boolean']['output'];
  sessionId: Scalars['String']['output'];
  tenant: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

/** Session information for an account. */
export type SessionInfo = {
  __typename?: 'SessionInfo';
  /** Session ID */
  id: Scalars['String']['output'];
  /** IP address */
  ipAddress?: Maybe<Scalars['String']['output']>;
  /** Last access time */
  lastAccess?: Maybe<Scalars['String']['output']>;
  /** Session start time */
  start?: Maybe<Scalars['String']['output']>;
  /** User agent */
  userAgent?: Maybe<Scalars['String']['output']>;
};

/** Sort input parameters */
export type SortInput = {
  /** Sort direction: ASC or DESC */
  direction?: InputMaybe<Scalars['String']['input']>;
  /** Field to sort by */
  field?: InputMaybe<Scalars['String']['input']>;
};

export type Subject = {
  __typename?: 'Subject';
  accountId: Scalars['String']['output'];
  displayName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

/** Tenant information (business abstraction over Keycloak Realm) */
export type Tenant = {
  __typename?: 'Tenant';
  /** Description */
  description?: Maybe<Scalars['String']['output']>;
  /** Display name for UI */
  displayName?: Maybe<Scalars['String']['output']>;
  /** Tenant ID (Keycloak realm name) */
  id: Scalars['String']['output'];
  /** Whether tenant is active */
  isActive: Scalars['Boolean']['output'];
  /** Tenant name */
  name: Scalars['String']['output'];
  /** Tenant type (e.g., ENTERPRISE, TRIAL) */
  type: Scalars['String']['output'];
  /** Zone ID (foreign key reference) */
  zoneId: Scalars['String']['output'];
};

/** User's tenant membership status */
export type TenantStatus = {
  __typename?: 'TenantStatus';
  /** List of active tenant IDs */
  activeTenants: Array<Scalars['String']['output']>;
  /** Has any tenant roles */
  hasTenants: Scalars['Boolean']['output'];
  /** Has tenants but all pending approval */
  pendingApproval: Scalars['Boolean']['output'];
  /** No tenants → need to apply */
  requiresTenantSelection: Scalars['Boolean']['output'];
};

export type TokenValidation = {
  __typename?: 'TokenValidation';
  accountId?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['String']['output']>;
  tenant?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  valid: Scalars['Boolean']['output'];
};

/** Email verification result (replaces EmailVerificationResult) */
export type VerificationResult = {
  __typename?: 'VerificationResult';
  /** Account ID if successful */
  accountId?: Maybe<Scalars['String']['output']>;
  /** Success message or error details */
  message?: Maybe<Scalars['String']['output']>;
  /** Whether verification was successful */
  success: Scalars['Boolean']['output'];
  /** User's tenant membership status */
  tenantStatus?: Maybe<TenantStatus>;
};

/** Result of email verification operation. */
export type VerifyEmailResult = {
  __typename?: 'VerifyEmailResult';
  /** Account ID if successful */
  accountId?: Maybe<Scalars['String']['output']>;
  /** Success message or error details */
  message?: Maybe<Scalars['String']['output']>;
  /** Whether verification was successful */
  success: Scalars['Boolean']['output'];
};

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String']['output'];
};

export type GetAccountDetailQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetAccountDetailQuery = { __typename?: 'Query', account: { __typename?: 'AccountQueries', one: { __typename?: 'AccountDetail', id: string, username: string, email?: string | null, status: AccountStatus, emailVerified: boolean, createdAt: string, updatedAt?: string | null, firstName?: string | null, lastName?: string | null, attributes: Array<{ __typename?: 'AttributeEntry', key: string, value: string, isSensitive: boolean }>, sessions: Array<{ __typename?: 'SessionInfo', id: string, ipAddress?: string | null, userAgent?: string | null, start?: string | null, lastAccess?: string | null }> } } };

export type VerifyEmailByAdminMutationVariables = Exact<{
  accountId: Scalars['String']['input'];
}>;


export type VerifyEmailByAdminMutation = { __typename?: 'Mutation', verifyEmailByAdmin: { __typename?: 'EmailVerificationResult', success: boolean, message?: string | null } };

export type ListAccountsQueryVariables = Exact<{
  status?: InputMaybe<AccountStatus>;
  queries?: InputMaybe<ListQueriesInput>;
}>;


export type ListAccountsQuery = { __typename?: 'Query', account: { __typename?: 'AccountQueries', list: { __typename?: 'AccountConnection', total: number, items: Array<{ __typename?: 'Account', id: string, username: string, email?: string | null, status: AccountStatus, emailVerified: boolean, createdAt: string }>, pagination: { __typename?: 'Pagination', current: number, size: number, total: number, hasNext: boolean, hasPrev: boolean } } } };


export const GetAccountDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAccountDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"isSensitive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"lastAccess"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAccountDetailQuery, GetAccountDetailQueryVariables>;
export const VerifyEmailByAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmailByAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmailByAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<VerifyEmailByAdminMutation, VerifyEmailByAdminMutationVariables>;
export const ListAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListAccounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queries"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ListQueriesInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"queries"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queries"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"hasNext"}},{"kind":"Field","name":{"kind":"Name","value":"hasPrev"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListAccountsQuery, ListAccountsQueryVariables>;