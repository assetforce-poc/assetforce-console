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
  TenantExtensions: { input: any; output: any; }
  _FieldSet: { input: any; output: any; }
};

export type Application = {
  __typename?: 'Application';
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  status: ApplicationStatus;
  tenant: Tenant;
  updatedAt: Scalars['String']['output'];
};

/**  Intentionally excludes "APPROVED/REJECTED" actions (admin-only, out of 052 scope). */
export enum ApplicationStatus {
  Approved = 'APPROVED',
  Cancelled = 'CANCELLED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type ApplyResult = {
  __typename?: 'ApplyResult';
  application?: Maybe<Application>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type AuthRequirement = {
  __typename?: 'AuthRequirement';
  /** True if user must authenticate before accepting */
  required: Scalars['Boolean']['output'];
};

export type CancelResult = {
  __typename?: 'CancelResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type CooldownStatus = {
  __typename?: 'CooldownStatus';
  canApply: Scalars['Boolean']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  until?: Maybe<Scalars['String']['output']>;
};

export type CreateGroupInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  tenantId: Scalars['String']['input'];
  type: GroupType;
};

export type CreateTenantInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  keycloakRealm?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  type?: InputMaybe<TenantType>;
};

/**  ========== Inputs ========== */
export type CreateUserInput = {
  department?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** AID (AssetForce Account ID) from AAC */
  subject: Scalars['String']['input'];
  tenantId: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<UserType>;
};

export type EmailMatchInfo = {
  __typename?: 'EmailMatchInfo';
  /** Current logged-in user's email (null if not logged in) */
  current?: Maybe<Scalars['String']['output']>;
  /** The email address the invite was sent to */
  invited: Scalars['String']['output'];
  /** Whether current user's email matches invited email */
  match: Scalars['Boolean']['output'];
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

export type Group = {
  __typename?: 'Group';
  code?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  memberCount?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  sortOrder?: Maybe<Scalars['Int']['output']>;
  tenantId: Scalars['String']['output'];
  type: GroupType;
};

export type GroupMutations = {
  __typename?: 'GroupMutations';
  create: Group;
  update: Group;
  users: GroupUserMutations;
};


export type GroupMutationsCreateArgs = {
  input: CreateGroupInput;
};


export type GroupMutationsUpdateArgs = {
  id: Scalars['String']['input'];
  input: UpdateGroupInput;
};

export type GroupQueries = {
  __typename?: 'GroupQueries';
  list: Array<Group>;
  one?: Maybe<Group>;
};


export type GroupQueriesListArgs = {
  tenantId: Scalars['String']['input'];
  type?: InputMaybe<GroupType>;
};


export type GroupQueriesOneArgs = {
  id: Scalars['String']['input'];
};

export enum GroupType {
  Department = 'DEPARTMENT',
  Function = 'FUNCTION',
  Project = 'PROJECT',
  Role = 'ROLE',
  Team = 'TEAM'
}

export type GroupUserMutations = {
  __typename?: 'GroupUserMutations';
  add: UserGroupMembership;
  remove: Scalars['Boolean']['output'];
};


export type GroupUserMutationsAddArgs = {
  groupId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type GroupUserMutationsRemoveArgs = {
  groupId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

/**  Identity Context for AAC integration */
export type IdentityContext = {
  __typename?: 'IdentityContext';
  groups: Array<Scalars['String']['output']>;
  /** AID (AssetForce Account ID) - Snowflake BIGINT */
  subject: Scalars['String']['output'];
  tenant: Scalars['String']['output'];
};

/**
 * Identity context query input.
 * All fields required for building identity context.
 */
export type IdentityContextInput = {
  /** User subject (AID from AAC) */
  subject: Scalars['String']['input'];
  /** Tenant identifier */
  tenantId: Scalars['String']['input'];
};

export type IdentityQueries = {
  __typename?: 'IdentityQueries';
  /**
   * Build Identity Context for AAC integration.
   * Returns tenant, subject (AID), and organizational groups.
   */
  context?: Maybe<IdentityContext>;
};


export type IdentityQueriesContextArgs = {
  input: IdentityContextInput;
};

export type Invite = {
  __typename?: 'Invite';
  createdAt: Scalars['String']['output'];
  expiresAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  invitedEmail: Scalars['String']['output'];
  inviterEmail?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  status: InviteStatus;
  tenantId: Scalars['String']['output'];
  tenantName: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type InviteAcceptResult = {
  __typename?: 'InviteAcceptResult';
  error?: Maybe<InviteError>;
  /** Membership details after joining */
  membership?: Maybe<Membership>;
  success: Scalars['Boolean']['output'];
  /** The tenant that was joined */
  tenant?: Maybe<TenantInfo>;
};

export type InviteCancelResult = {
  __typename?: 'InviteCancelResult';
  error?: Maybe<InviteError>;
  /** The cancelled invite */
  invite?: Maybe<Invite>;
  success: Scalars['Boolean']['output'];
};

export type InviteConnection = {
  __typename?: 'InviteConnection';
  hasMore: Scalars['Boolean']['output'];
  items: Array<Invite>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type InviteError = {
  __typename?: 'InviteError';
  code: InviteErrorCode;
  message: Scalars['String']['output'];
};

export enum InviteErrorCode {
  AccountInactive = 'ACCOUNT_INACTIVE',
  AlreadyAccepted = 'ALREADY_ACCEPTED',
  AlreadyCancelled = 'ALREADY_CANCELLED',
  AlreadyMember = 'ALREADY_MEMBER',
  DuplicatePending = 'DUPLICATE_PENDING',
  EmailMismatch = 'EMAIL_MISMATCH',
  EmailNotVerified = 'EMAIL_NOT_VERIFIED',
  Expired = 'EXPIRED',
  Forbidden = 'FORBIDDEN',
  /**  User state errors */
  InvalidEmail = 'INVALID_EMAIL',
  /**  Token errors */
  InvalidToken = 'INVALID_TOKEN',
  /**  Not found errors */
  InviteNotFound = 'INVITE_NOT_FOUND',
  /**  Rate limiting */
  RateLimited = 'RATE_LIMITED',
  TenantNotFound = 'TENANT_NOT_FOUND',
  /**  Tenant errors */
  TenantUnavailable = 'TENANT_UNAVAILABLE',
  /**  Auth errors */
  Unauthorized = 'UNAUTHORIZED'
}

export type InviteResendResult = {
  __typename?: 'InviteResendResult';
  /** The cancelled old invite */
  cancelled?: Maybe<Invite>;
  /** New invite with fresh token */
  created?: Maybe<Invite>;
  error?: Maybe<InviteError>;
  success: Scalars['Boolean']['output'];
};

export type InviteSendInput = {
  /** Email address to invite */
  email: Scalars['String']['input'];
  /** Days until expiry (default: 7, max: 30) */
  expiryDays?: InputMaybe<Scalars['Int']['input']>;
  /** Optional personal message from inviter */
  message?: InputMaybe<Scalars['String']['input']>;
  /** Optional role to assign upon acceptance */
  role?: InputMaybe<Scalars['String']['input']>;
  /** Target tenant to invite the user to join */
  tenantId: Scalars['String']['input'];
};

export type InviteSendResult = {
  __typename?: 'InviteSendResult';
  error?: Maybe<InviteError>;
  invite?: Maybe<Invite>;
  success: Scalars['Boolean']['output'];
};

export enum InviteStatus {
  Accepted = 'ACCEPTED',
  Cancelled = 'CANCELLED',
  Expired = 'EXPIRED',
  Pending = 'PENDING'
}

export type InviteValidationResult = {
  __typename?: 'InviteValidationResult';
  /** Authentication requirement info */
  auth: AuthRequirement;
  /** Email matching info (null if token invalid) */
  email?: Maybe<EmailMatchInfo>;
  /** Error details if invalid */
  error?: Maybe<InviteError>;
  /** Invite details if valid */
  invite?: Maybe<Invite>;
  /** Whether the token is valid and invite can be accepted */
  valid: Scalars['Boolean']['output'];
};

/** Query input for listing invites */
export type InvitesInput = {
  /** Maximum number of results (default: 20) */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Offset for pagination (default: 0) */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** Optional status filter */
  status?: InputMaybe<InviteStatus>;
  /** Optional tenant filter. If null, returns all accessible invites. */
  tenantId?: InputMaybe<Scalars['String']['input']>;
};

export type LeaveResult = {
  __typename?: 'LeaveResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Membership = {
  __typename?: 'Membership';
  /** When the membership was created */
  createdAt: Scalars['String']['output'];
  /** Role assigned to the user */
  role: Scalars['String']['output'];
  /** User's subject identifier */
  subject: Scalars['String']['output'];
  /** The tenant that was joined */
  tenant: TenantInfo;
};

export enum MembershipType {
  Delegated = 'DELEGATED',
  Direct = 'DIRECT',
  Inherited = 'INHERITED',
  Temporary = 'TEMPORARY'
}

/**  ========== Root Mutation (singular namespace) ========== */
export type Mutation = {
  __typename?: 'Mutation';
  group: GroupMutations;
  tenant: TenantMutations;
  user: UserMutations;
};

/**  ========== Root Query (singular namespace) ========== */
export type Query = {
  __typename?: 'Query';
  _service: _Service;
  group: GroupQueries;
  identity: IdentityQueries;
  tenant: TenantQueries;
  user: UserQueries;
};

/**
 *  Architecture Note:
 *  - Zone is PHYSICAL deployment boundary configured via application.yml
 *  - Not stored in database, not exposed via API
 *  - Subject is AID (Snowflake BIGINT) from AAC
 *  ========== Core Types ==========
 */
export type Tenant = {
  __typename?: 'Tenant';
  description?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  keycloakRealm?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  type: TenantType;
};

export type TenantApplyInput = {
  message?: InputMaybe<Scalars['String']['input']>;
  tenantId: Scalars['String']['input'];
};

export type TenantAvailableInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type TenantCancelInput = {
  id: Scalars['String']['input'];
};

export type TenantConnection = {
  __typename?: 'TenantConnection';
  hasMore: Scalars['Boolean']['output'];
  items: Array<Tenant>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type TenantCooldownInput = {
  tenantId?: InputMaybe<Scalars['String']['input']>;
};

export type TenantInfo = {
  __typename?: 'TenantInfo';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

/**  ========== Tenant Invitation Types (Task 051) ========== */
export type TenantInviteMutations = {
  __typename?: 'TenantInviteMutations';
  /**
   * Accept an invite to join a tenant.
   * Subject derived from JWT. Must match invitedEmail.
   */
  accept: InviteAcceptResult;
  /**
   * Cancel/revoke a pending invite.
   * Admin only.
   */
  cancel: InviteCancelResult;
  /**
   * Resend an invite.
   * Creates new token, invalidates old. Admin only.
   */
  resend: InviteResendResult;
  /**
   * Send an invite to join the current tenant.
   * Admin only. Subject derived from JWT.
   */
  send: InviteSendResult;
};


/**  ========== Tenant Invitation Types (Task 051) ========== */
export type TenantInviteMutationsAcceptArgs = {
  token: Scalars['String']['input'];
};


/**  ========== Tenant Invitation Types (Task 051) ========== */
export type TenantInviteMutationsCancelArgs = {
  id: Scalars['String']['input'];
};


/**  ========== Tenant Invitation Types (Task 051) ========== */
export type TenantInviteMutationsResendArgs = {
  id: Scalars['String']['input'];
};


/**  ========== Tenant Invitation Types (Task 051) ========== */
export type TenantInviteMutationsSendArgs = {
  input: InviteSendInput;
};

export type TenantLeaveInput = {
  tenantId: Scalars['String']['input'];
};

export type TenantMutations = {
  __typename?: 'TenantMutations';
  create: Tenant;
  invite: TenantInviteMutations;
  users: TenantUserMutations;
};


export type TenantMutationsCreateArgs = {
  input: CreateTenantInput;
};

/**  ========== Namespace Query Types ========== */
export type TenantQueries = {
  __typename?: 'TenantQueries';
  applications: Array<Application>;
  available: TenantConnection;
  cooldown: CooldownStatus;
  /**
   * Validate an invite token.
   * Works for both authenticated and anonymous users.
   * Returns invite details if valid, or error if invalid/expired.
   */
  invite: InviteValidationResult;
  /**
   * List all invites for a tenant.
   * Admin only. Subject derived from JWT.
   */
  invites: InviteConnection;
  list: Array<Tenant>;
  mine: Array<Tenant>;
  one?: Maybe<Tenant>;
};


/**  ========== Namespace Query Types ========== */
export type TenantQueriesAvailableArgs = {
  input: TenantAvailableInput;
};


/**  ========== Namespace Query Types ========== */
export type TenantQueriesCooldownArgs = {
  input?: InputMaybe<TenantCooldownInput>;
};


/**  ========== Namespace Query Types ========== */
export type TenantQueriesInviteArgs = {
  token: Scalars['String']['input'];
};


/**  ========== Namespace Query Types ========== */
export type TenantQueriesInvitesArgs = {
  input: InvitesInput;
};


/**  ========== Namespace Query Types ========== */
export type TenantQueriesOneArgs = {
  id: Scalars['String']['input'];
};

/**  ========== Enums ========== */
export enum TenantType {
  Demo = 'DEMO',
  Production = 'PRODUCTION',
  Sandbox = 'SANDBOX',
  Trial = 'TRIAL'
}

export type TenantUserMutations = {
  __typename?: 'TenantUserMutations';
  apply: ApplyResult;
  cancel: CancelResult;
  leave: LeaveResult;
};


export type TenantUserMutationsApplyArgs = {
  input: TenantApplyInput;
};


export type TenantUserMutationsCancelArgs = {
  input: TenantCancelInput;
};


export type TenantUserMutationsLeaveArgs = {
  input: TenantLeaveInput;
};

export type UpdateGroupInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateUserInput = {
  department?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  /**  ===== Audit ===== */
  createdAt: Scalars['String']['output'];
  extensions?: Maybe<Scalars['TenantExtensions']['output']>;
  /**  ===== Relations ===== */
  groups: Array<Group>;
  /**  ===== Core Identity ===== */
  id: Scalars['String']['output'];
  isVerified: Scalars['Boolean']['output'];
  preferences: UserPreferences;
  /**  ===== Namespace Groups ===== */
  profile: UserProfile;
  status: UserStatus;
  /** AID (AssetForce Account ID) - Snowflake BIGINT from AAC */
  subject: Scalars['String']['output'];
  /**  ===== Positioning ===== */
  tenantId: Scalars['String']['output'];
  /**  ===== Classification/Status ===== */
  type: UserType;
  updatedAt: Scalars['String']['output'];
};

export type UserGroupMembership = {
  __typename?: 'UserGroupMembership';
  effectiveTo?: Maybe<Scalars['String']['output']>;
  group: Group;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  joinedAt: Scalars['String']['output'];
  type: MembershipType;
  user: User;
};

/** User list query input */
export type UserListInput = {
  /** Optional status filter */
  status?: InputMaybe<UserStatus>;
  /** Tenant to list users for */
  tenantId: Scalars['String']['input'];
};

/**  ========== Namespace Mutation Types ========== */
export type UserMutations = {
  __typename?: 'UserMutations';
  create: User;
  status: User;
  update: User;
};


/**  ========== Namespace Mutation Types ========== */
export type UserMutationsCreateArgs = {
  input: CreateUserInput;
};


/**  ========== Namespace Mutation Types ========== */
export type UserMutationsStatusArgs = {
  id: Scalars['String']['input'];
  status: UserStatus;
};


/**  ========== Namespace Mutation Types ========== */
export type UserMutationsUpdateArgs = {
  id: Scalars['String']['input'];
  input: UpdateUserInput;
};

/**
 * User single query input.
 * Exactly one of (id) or (subject + tenantId) must be provided.
 * Runtime validation enforces XOR constraint.
 */
export type UserOneInput = {
  /** User ID - for lookup by primary key */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Subject (AID from AAC) - requires tenant context */
  subject?: InputMaybe<Scalars['String']['input']>;
  /** Tenant ID - required when using subject */
  tenantId?: InputMaybe<Scalars['String']['input']>;
};

/**  User preferences (managed by user) */
export type UserPreferences = {
  __typename?: 'UserPreferences';
  locale?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
};

/**  User profile information (managed by admin/user) */
export type UserProfile = {
  __typename?: 'UserProfile';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  department?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type UserQueries = {
  __typename?: 'UserQueries';
  /** List users in a tenant with optional status filter */
  list: Array<User>;
  /**
   * Get a single user by ID or subject.
   * Exactly one of (id) or (subject + tenantId) must be provided.
   * Runtime validation enforces XOR constraint.
   */
  one?: Maybe<User>;
};


export type UserQueriesListArgs = {
  input: UserListInput;
};


export type UserQueriesOneArgs = {
  input: UserOneInput;
};

export enum UserStatus {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
  Inactive = 'INACTIVE',
  Suspended = 'SUSPENDED'
}

export enum UserType {
  Demo = 'DEMO',
  Partner = 'PARTNER',
  Production = 'PRODUCTION',
  System = 'SYSTEM',
  Trial = 'TRIAL'
}

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String']['output'];
};

export type ValidateInviteQueryVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type ValidateInviteQuery = { __typename?: 'Query', tenant: { __typename?: 'TenantQueries', invite: { __typename?: 'InviteValidationResult', valid: boolean, invite?: { __typename?: 'Invite', id: string, tenantId: string, tenantName: string, invitedEmail: string, inviterEmail?: string | null, role?: string | null, message?: string | null, status: InviteStatus, expiresAt: string, createdAt: string, updatedAt: string } | null, error?: { __typename?: 'InviteError', code: InviteErrorCode, message: string } | null, auth: { __typename?: 'AuthRequirement', required: boolean }, email?: { __typename?: 'EmailMatchInfo', match: boolean, invited: string, current?: string | null } | null } } };

export type ListInvitesQueryVariables = Exact<{
  input: InvitesInput;
}>;


export type ListInvitesQuery = { __typename?: 'Query', tenant: { __typename?: 'TenantQueries', invites: { __typename?: 'InviteConnection', total: number, hasMore: boolean, items: Array<{ __typename?: 'Invite', id: string, tenantId: string, tenantName: string, invitedEmail: string, inviterEmail?: string | null, role?: string | null, status: InviteStatus, message?: string | null, expiresAt: string, createdAt: string, updatedAt: string }> } } };

export type AcceptInviteMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type AcceptInviteMutation = { __typename?: 'Mutation', tenant: { __typename?: 'TenantMutations', invite: { __typename?: 'TenantInviteMutations', accept: { __typename?: 'InviteAcceptResult', success: boolean, membership?: { __typename?: 'Membership', subject: string, role: string, createdAt: string, tenant: { __typename?: 'TenantInfo', id: string, name: string } } | null, error?: { __typename?: 'InviteError', code: InviteErrorCode, message: string } | null } } } };

export type SendInviteMutationVariables = Exact<{
  input: InviteSendInput;
}>;


export type SendInviteMutation = { __typename?: 'Mutation', tenant: { __typename?: 'TenantMutations', invite: { __typename?: 'TenantInviteMutations', send: { __typename?: 'InviteSendResult', success: boolean, invite?: { __typename?: 'Invite', id: string, tenantId: string, tenantName: string, invitedEmail: string, role?: string | null, expiresAt: string, createdAt: string } | null, error?: { __typename?: 'InviteError', code: InviteErrorCode, message: string } | null } } } };

export type CancelInviteMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type CancelInviteMutation = { __typename?: 'Mutation', tenant: { __typename?: 'TenantMutations', invite: { __typename?: 'TenantInviteMutations', cancel: { __typename?: 'InviteCancelResult', success: boolean, error?: { __typename?: 'InviteError', code: InviteErrorCode, message: string } | null } } } };

export type ResendInviteMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ResendInviteMutation = { __typename?: 'Mutation', tenant: { __typename?: 'TenantMutations', invite: { __typename?: 'TenantInviteMutations', resend: { __typename?: 'InviteResendResult', success: boolean, cancelled?: { __typename?: 'Invite', id: string, status: InviteStatus } | null, created?: { __typename?: 'Invite', id: string, tenantId: string, tenantName: string, invitedEmail: string, role?: string | null, expiresAt: string, createdAt: string } | null, error?: { __typename?: 'InviteError', code: InviteErrorCode, message: string } | null } } } };


export const ValidateInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ValidateInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valid"}},{"kind":"Field","name":{"kind":"Name","value":"invite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tenantId"}},{"kind":"Field","name":{"kind":"Name","value":"tenantName"}},{"kind":"Field","name":{"kind":"Name","value":"invitedEmail"}},{"kind":"Field","name":{"kind":"Name","value":"inviterEmail"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"auth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"required"}}]}},{"kind":"Field","name":{"kind":"Name","value":"email"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"match"}},{"kind":"Field","name":{"kind":"Name","value":"invited"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ValidateInviteQuery, ValidateInviteQueryVariables>;
export const ListInvitesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListInvites"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InvitesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invites"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tenantId"}},{"kind":"Field","name":{"kind":"Name","value":"tenantName"}},{"kind":"Field","name":{"kind":"Name","value":"invitedEmail"}},{"kind":"Field","name":{"kind":"Name","value":"inviterEmail"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}}]}}]}}]}}]} as unknown as DocumentNode<ListInvitesQuery, ListInvitesQueryVariables>;
export const AcceptInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accept"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"membership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AcceptInviteMutation, AcceptInviteMutationVariables>;
export const SendInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteSendInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"send"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"invite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tenantId"}},{"kind":"Field","name":{"kind":"Name","value":"tenantName"}},{"kind":"Field","name":{"kind":"Name","value":"invitedEmail"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SendInviteMutation, SendInviteMutationVariables>;
export const CancelInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CancelInviteMutation, CancelInviteMutationVariables>;
export const ResendInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resend"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tenantId"}},{"kind":"Field","name":{"kind":"Name","value":"tenantName"}},{"kind":"Field","name":{"kind":"Name","value":"invitedEmail"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ResendInviteMutation, ResendInviteMutationVariables>;