/**
 * Account status enumeration matching backend GraphQL schema
 */
export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  LOCKED = 'LOCKED',
  SUSPENDED = 'SUSPENDED',
}

/**
 * Account entity representing an authentication identity
 * Note: This is AAC Account, not IMC Business User
 */
export interface Account {
  id: string;
  username: string;
  email: string;
  status: AccountStatus;
  emailVerified: boolean;
  createdAt: string; // ISO 8601 datetime string
}

/**
 * Pagination metadata for account listing
 */
export interface Pagination {
  current: number;
  size: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Connection pattern response for account listing
 */
export interface AccountConnection {
  items: Account[];
  total: number;
  pagination: Pagination;
}

/**
 * Query parameters for list operations
 */
export interface ListQueriesInput {
  pagination?: PaginationInput;
  sort?: SortInput;
  search?: SearchInput;
}

/**
 * Pagination input parameters
 */
export interface PaginationInput {
  page?: number;
  size?: number;
}

/**
 * Sorting input parameters
 */
export interface SortInput {
  field?: string;
  direction?: 'ASC' | 'DESC';
}

/**
 * Search input parameters
 */
export interface SearchInput {
  query?: string;
  fields?: string[];
}
