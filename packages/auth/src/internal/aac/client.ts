import type { AuthClient, AuthResult, GraphQLResponse, LoginResult } from './types';

/**
 * AAC GraphQL Mutations
 */
const AUTHENTICATE_MUTATION = `
  mutation Authenticate($username: String!, $password: String!) {
    authenticate {
      login(username: $username, password: $password) {
        success
        subject
        tenants {
          id
          name
          zoneId
          type
          description
          isActive
        }
        accessToken
        refreshToken
        expiresIn
        tokenType
        identityContext {
          zone
          tenant
          subject {
            accountId
            userId
            username
            email
            displayName
          }
          groups
        }
        error
      }
    }
  }
`;

const ENTER_TENANT_MUTATION = `
  mutation EnterTenant($subject: String!, $tenantId: String!) {
    authenticate {
      enter(subject: $subject, tenantId: $tenantId) {
        success
        accessToken
        refreshToken
        expiresIn
        tokenType
        identityContext {
          zone
          tenant
          subject {
            accountId
            userId
            username
            email
            displayName
          }
          groups
        }
        error
      }
    }
  }
`;

const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($refreshToken: String!) {
    authenticate {
      refreshToken(refreshToken: $refreshToken) {
        success
        accessToken
        refreshToken
        expiresIn
        tokenType
        identityContext {
          zone
          tenant
          subject {
            accountId
            userId
            username
            email
            displayName
          }
          groups
        }
        error
      }
    }
  }
`;

const LOGOUT_MUTATION = `
  mutation Logout {
    authenticate {
      logout
    }
  }
`;

// ========== Password Management Mutations ==========

const FORGOT_PASSWORD_MUTATION = `
  mutation ForgotPassword($email: String!) {
    account {
      password {
        forgot(email: $email) {
          success
          message
        }
      }
    }
  }
`;

const RESET_PASSWORD_MUTATION = `
  mutation ResetPassword($input: ResetPasswordInput!) {
    account {
      password {
        reset(input: $input) {
          success
          message
        }
      }
    }
  }
`;

const CHANGE_PASSWORD_MUTATION = `
  mutation ChangePassword($input: ChangePasswordInput!) {
    account {
      password {
        change(input: $input) {
          success
          message
        }
      }
    }
  }
`;

// ========== Password Result Types ==========

export interface PasswordResult {
  success: boolean;
  message?: string | null;
}

/**
 * AACClientOptions - Options for creating AAC client
 */
export interface AACClientOptions {
  /** AAC GraphQL endpoint */
  endpoint: string;
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
}

/**
 * AACClient - GraphQL client for AAC
 *
 * Implements AuthClient interface for interchangeability with other auth backends.
 */
export class AACClient implements AuthClient {
  private readonly endpoint: string;
  private readonly timeout: number;

  constructor(options: AACClientOptions) {
    this.endpoint = options.endpoint;
    this.timeout = options.timeout ?? 10000;
  }

  /**
   * Execute GraphQL query/mutation
   */
  private async execute<T>(query: string, variables?: Record<string, unknown>, accessToken?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = (await response.json()) as GraphQLResponse<T>;

      if (result.errors && result.errors.length > 0) {
        const firstError = result.errors[0];
        throw new Error(firstError?.message ?? 'GraphQL error');
      }

      if (!result.data) {
        throw new Error('No data returned from GraphQL');
      }

      return result.data;
    } catch (error) {
      // Convert AbortError to more descriptive timeout error
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Authenticate with username and password
   *
   * @returns LoginResult - may require tenant selection if multiple tenants
   */
  async authenticate(username: string, password: string): Promise<LoginResult> {
    const data = await this.execute<{ authenticate: { login: LoginResult } }>(AUTHENTICATE_MUTATION, {
      username,
      password,
    });
    return data.authenticate.login;
  }

  /**
   * Enter tenant after authentication (select tenant)
   *
   * @param subject - Subject ID from LoginResult
   * @param tenantId - Selected tenant ID
   * @param accessToken - Access token from LoginResult (required)
   */
  async selectTenant(subject: string, tenantId: string, accessToken: string): Promise<AuthResult> {
    const data = await this.execute<{ authenticate: { enter: AuthResult } }>(
      ENTER_TENANT_MUTATION,
      { subject, tenantId },
      accessToken
    );
    return data.authenticate.enter;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResult> {
    const data = await this.execute<{ authenticate: { refreshToken: AuthResult } }>(REFRESH_TOKEN_MUTATION, {
      refreshToken,
    });
    return data.authenticate.refreshToken;
  }

  /**
   * Logout current session
   */
  async logout(accessToken: string): Promise<boolean> {
    const data = await this.execute<{ authenticate: { logout: boolean } }>(LOGOUT_MUTATION, {}, accessToken);
    return data.authenticate.logout;
  }

  // ========== Password Management Methods ==========

  /**
   * Request password reset email
   *
   * @param email - User's email address
   * @returns Always success (to prevent email enumeration)
   */
  async forgotPassword(email: string): Promise<PasswordResult> {
    const data = await this.execute<{ account: { password: { forgot: PasswordResult } } }>(FORGOT_PASSWORD_MUTATION, {
      email,
    });
    return data.account.password.forgot;
  }

  /**
   * Reset password using token from email
   *
   * @param token - Action token from password reset email
   * @param newPassword - New password
   */
  async resetPassword(token: string, newPassword: string): Promise<PasswordResult> {
    const data = await this.execute<{ account: { password: { reset: PasswordResult } } }>(RESET_PASSWORD_MUTATION, {
      input: { token, newPassword },
    });
    return data.account.password.reset;
  }

  /**
   * Change password for authenticated user
   *
   * @param currentPassword - Current password for verification
   * @param newPassword - New password
   * @param accessToken - JWT access token (required for authentication)
   */
  async changePassword(currentPassword: string, newPassword: string, accessToken: string): Promise<PasswordResult> {
    const data = await this.execute<{ account: { password: { change: PasswordResult } } }>(
      CHANGE_PASSWORD_MUTATION,
      { input: { currentPassword, newPassword } },
      accessToken
    );
    return data.account.password.change;
  }
}

/**
 * Create AAC client instance
 */
export function createAACClient(options: AACClientOptions): AACClient {
  return new AACClient(options);
}
