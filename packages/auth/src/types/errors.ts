/**
 * AuthErrorCode - Authentication error codes
 */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS' // Invalid username or password
  | 'SESSION_EXPIRED' // Session has expired
  | 'SESSION_NOT_FOUND' // Session not found
  | 'TENANT_REQUIRED' // Tenant selection required
  | 'TENANT_ACCESS_DENIED' // Access denied to tenant
  | 'TOKEN_EXPIRED' // Token has expired
  | 'TOKEN_INVALID' // Invalid token
  | 'NETWORK_ERROR' // Network error
  | 'UNKNOWN_ERROR'; // Unknown error

/**
 * AuthError - Authentication error class
 */
export class AuthError extends Error {
  public readonly code: AuthErrorCode;
  public readonly cause?: unknown;

  constructor(code: AuthErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.cause = cause;
  }

  /**
   * Create invalid credentials error
   */
  static invalidCredentials(message = 'Invalid username or password'): AuthError {
    return new AuthError('INVALID_CREDENTIALS', message);
  }

  /**
   * Create session expired error
   */
  static sessionExpired(message = 'Session has expired'): AuthError {
    return new AuthError('SESSION_EXPIRED', message);
  }

  /**
   * Create tenant required error
   */
  static tenantRequired(message = 'Tenant selection required'): AuthError {
    return new AuthError('TENANT_REQUIRED', message);
  }

  /**
   * Create network error
   */
  static networkError(message: string, cause?: unknown): AuthError {
    return new AuthError('NETWORK_ERROR', message, cause);
  }
}
