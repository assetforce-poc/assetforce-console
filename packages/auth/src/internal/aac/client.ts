import type { AuthClient, AuthResult, GraphQLResponse, PreAuthResult } from './types';

/**
 * AAC GraphQL Mutations
 */
const AUTHENTICATE_MUTATION = `
  mutation Authenticate($username: String!, $password: String!) {
    authenticate(username: $username, password: $password) {
      success
      subject
      availableRealms {
        realmId
        realmName
        displayName
        zoneId
        realmType
        description
        isActive
      }
      accessToken
      refreshToken
      expiresIn
      tokenType
      identityContext {
        zone
        realm
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
`;

const SELECT_TENANT_MUTATION = `
  mutation SelectTenant($subject: String!, $realmId: String!) {
    selectTenant(subject: $subject, realmId: $realmId) {
      success
      accessToken
      refreshToken
      expiresIn
      tokenType
      identityContext {
        zone
        realm
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
`;

const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      success
      accessToken
      refreshToken
      expiresIn
      tokenType
      identityContext {
        zone
        realm
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
`;

const LOGOUT_MUTATION = `
  mutation Logout {
    logout
  }
`;

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
   * @returns PreAuthResult - may require tenant selection if multiple realms
   */
  async authenticate(username: string, password: string): Promise<PreAuthResult> {
    const data = await this.execute<{ authenticate: PreAuthResult }>(AUTHENTICATE_MUTATION, { username, password });
    return data.authenticate;
  }

  /**
   * Select tenant after authentication
   *
   * @param subject - Subject ID from PreAuthResult
   * @param realmId - Selected realm ID
   */
  async selectTenant(subject: string, realmId: string): Promise<AuthResult> {
    const data = await this.execute<{ selectTenant: AuthResult }>(SELECT_TENANT_MUTATION, { subject, realmId });
    return data.selectTenant;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResult> {
    const data = await this.execute<{ refreshToken: AuthResult }>(REFRESH_TOKEN_MUTATION, { refreshToken });
    return data.refreshToken;
  }

  /**
   * Logout current session
   */
  async logout(accessToken: string): Promise<boolean> {
    const data = await this.execute<{ logout: boolean }>(LOGOUT_MUTATION, {}, accessToken);
    return data.logout;
  }
}

/**
 * Create AAC client instance
 */
export function createAACClient(options: AACClientOptions): AACClient {
  return new AACClient(options);
}
