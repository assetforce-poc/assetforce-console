import type { IronSession } from 'iron-session';

import type { AuthClient } from '../../internal/aac';
import type { LoginResult } from '../../internal/aac/types';
import type { SessionData } from '../../types';
import type { SignInCredentials } from '../types';
import { createSignIn } from './api';

// Mock session implementation
const createMockSession = (): IronSession<SessionData> => {
  const data: Partial<SessionData> = {};

  return {
    // Session data properties
    get accessToken() {
      return data.accessToken;
    },
    set accessToken(value) {
      data.accessToken = value;
    },
    get refreshToken() {
      return data.refreshToken;
    },
    set refreshToken(value) {
      data.refreshToken = value;
    },
    get expiresAt() {
      return data.expiresAt;
    },
    set expiresAt(value) {
      data.expiresAt = value;
    },
    get user() {
      return data.user;
    },
    set user(value) {
      data.user = value;
    },
    get identity() {
      return data.identity;
    },
    set identity(value) {
      data.identity = value;
    },
    get tenant() {
      return data.tenant;
    },
    set tenant(value) {
      data.tenant = value;
    },
    get pendingTenantSelection() {
      return data.pendingTenantSelection;
    },
    set pendingTenantSelection(value) {
      data.pendingTenantSelection = value;
    },
    get availableTenants() {
      return data.availableTenants;
    },
    set availableTenants(value) {
      data.availableTenants = value;
    },
    get _pendingSubject() {
      return data._pendingSubject;
    },
    set _pendingSubject(value) {
      data._pendingSubject = value;
    },
    get requiresTenantOnboarding() {
      return data.requiresTenantOnboarding;
    },
    set requiresTenantOnboarding(value) {
      data.requiresTenantOnboarding = value;
    },

    // IronSession methods
    save: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn(),
    updateConfig: jest.fn(),
  } as any;
};

// Mock AuthClient
const createMockAuthClient = (mockResponse: LoginResult): AuthClient => ({
  authenticate: jest.fn().mockResolvedValue(mockResponse),
  selectTenant: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
});

describe('signIn API - Integration Tests', () => {
  const credentials: SignInCredentials = {
    username: 'test@example.com',
    password: 'password123',
  };

  describe('Scenario 1: No Tenant - User requires onboarding', () => {
    it('should return empty available array and set pending subject in session', async () => {
      const mockLoginResult: LoginResult = {
        success: true,
        subject: 'user-123',
        tenants: [], // No tenants available
      };

      const authClient = createMockAuthClient(mockLoginResult);
      const signIn = createSignIn(authClient);
      const session = createMockSession();

      const result = await signIn(credentials, session);

      // Verify response
      expect(result).toEqual({
        success: true,
        tenant: {
          available: [],
        },
        subject: 'user-123',
      });

      // Verify session state
      expect(session.pendingTenantSelection).toBe(false);
      expect(session.requiresTenantOnboarding).toBe(true);
      expect(session._pendingSubject).toBe('user-123');
      expect(session.save).toHaveBeenCalledTimes(1);

      // Should NOT have session data
      expect(session.accessToken).toBeUndefined();
      expect(session.user).toBeUndefined();
      expect(session.tenant).toBeUndefined();
    });

    it('should handle undefined tenants as no tenant', async () => {
      const mockLoginResult: LoginResult = {
        success: true,
        subject: 'user-456',
        // tenants: undefined (not provided)
      };

      const authClient = createMockAuthClient(mockLoginResult);
      const signIn = createSignIn(authClient);
      const session = createMockSession();

      const result = await signIn(credentials, session);

      expect(result).toEqual({
        success: true,
        tenant: {
          available: [],
        },
        subject: 'user-456',
      });

      expect(session.pendingTenantSelection).toBe(false);
      expect(session.requiresTenantOnboarding).toBe(true);
      expect(session._pendingSubject).toBe('user-456');
    });
  });

  describe('Scenario 2: Single Tenant - Direct authentication', () => {
    it('should return success and store session data', async () => {
      const mockLoginResult: LoginResult = {
        success: true,
        subject: 'user-789',
        accessToken: 'access-token-abc',
        refreshToken: 'refresh-token-xyz',
        expiresIn: 3600,
        identityContext: {
          zone: 'zone-1',
          tenant: 'tenant-123',
          subject: {
            accountId: 'account-789',
            userId: 'user-789',
            username: 'testuser',
            email: 'test@example.com',
            displayName: 'Test User',
          },
          groups: ['user'],
        },
        tenants: [
          {
            id: 'tenant-123',
            name: 'Test Tenant',
            zoneId: 'zone-1',
            type: 'PRODUCTION',
            isActive: true,
          },
        ],
      };

      const authClient = createMockAuthClient(mockLoginResult);
      const signIn = createSignIn(authClient);
      const session = createMockSession();

      const result = await signIn(credentials, session);

      // Verify response - single tenant returns simple success
      expect(result).toEqual({
        success: true,
      });

      // Verify session data is populated
      expect(session.accessToken).toBe('access-token-abc');
      expect(session.refreshToken).toBe('refresh-token-xyz');
      expect(session.expiresAt).toBeGreaterThan(Date.now());
      expect(session.user).toEqual({
        id: 'account-789',
        name: 'Test User',
        email: 'test@example.com',
        image: undefined,
      });
      expect(session.tenant).toEqual({
        id: 'tenant-123',
        name: 'tenant-123',
      });
      expect(session.identity).toBeDefined();
      expect(session.identity?.realm).toBe('tenant-123');

      // Should save session
      expect(session.save).toHaveBeenCalledTimes(1);

      // Should NOT have pending tenant selection
      expect(session.pendingTenantSelection).toBeUndefined();
      expect(session._pendingSubject).toBeUndefined();
    });

    it('should use displayName for user name if available', async () => {
      const mockLoginResult: LoginResult = {
        success: true,
        accessToken: 'token',
        identityContext: {
          zone: 'zone-1',
          tenant: 'tenant-123',
          subject: {
            accountId: 'account-1',
            userId: 'user-1',
            username: 'username123',
            email: 'user@test.com',
            displayName: 'John Doe',
          },
          groups: [],
        },
        tenants: [
          {
            id: 'tenant-123',
            name: 'Test Tenant',
            zoneId: 'zone-1',
            type: 'PRODUCTION',
            isActive: true,
          },
        ],
      };

      const authClient = createMockAuthClient(mockLoginResult);
      const signIn = createSignIn(authClient);
      const session = createMockSession();

      await signIn(credentials, session);

      expect(session.user?.name).toBe('John Doe');
    });

    it('should fallback to username if displayName not available', async () => {
      const mockLoginResult: LoginResult = {
        success: true,
        accessToken: 'token',
        identityContext: {
          zone: 'zone-1',
          tenant: 'tenant-123',
          subject: {
            accountId: 'account-1',
            userId: 'user-1',
            username: 'username123',
            email: 'user@test.com',
            // displayName: undefined
          },
          groups: [],
        },
        tenants: [
          {
            id: 'tenant-123',
            name: 'Test Tenant',
            zoneId: 'zone-1',
            type: 'PRODUCTION',
            isActive: true,
          },
        ],
      };

      const authClient = createMockAuthClient(mockLoginResult);
      const signIn = createSignIn(authClient);
      const session = createMockSession();

      await signIn(credentials, session);

      expect(session.user?.name).toBe('username123');
    });
  });

  describe('Scenario 3: Multiple Tenants - Requires selection', () => {
    it('should return available tenants and set pending selection in session', async () => {
      const mockLoginResult: LoginResult = {
        success: true,
        subject: 'user-999',
        tenants: [
          {
            id: 'tenant-1',
            name: 'Tenant One',
            zoneId: 'zone-1',
            type: 'PRODUCTION',
            description: 'First tenant',
            isActive: true,
          },
          {
            id: 'tenant-2',
            name: 'Tenant Two',
            zoneId: 'zone-2',
            type: 'PRODUCTION',
            description: 'Second tenant',
            isActive: true,
          },
          {
            id: 'tenant-3',
            name: 'Tenant Three',
            zoneId: 'zone-3',
            type: 'PRODUCTION',
            isActive: true,
          },
        ],
      };

      const authClient = createMockAuthClient(mockLoginResult);
      const signIn = createSignIn(authClient);
      const session = createMockSession();

      const result = await signIn(credentials, session);

      // Verify response
      expect(result).toEqual({
        success: true,
        tenant: {
          available: [
            {
              id: 'tenant-1',
              name: 'Tenant One',
              zoneId: 'zone-1',
              realmType: 'PRODUCTION',
              description: 'First tenant',
            },
            {
              id: 'tenant-2',
              name: 'Tenant Two',
              zoneId: 'zone-2',
              realmType: 'PRODUCTION',
              description: 'Second tenant',
            },
            {
              id: 'tenant-3',
              name: 'Tenant Three',
              zoneId: 'zone-3',
              realmType: 'PRODUCTION',
            },
          ],
        },
        subject: 'user-999',
      });

      // Verify session state
      expect(session.pendingTenantSelection).toBe(true);
      expect(session.availableTenants).toHaveLength(3);
      expect(session._pendingSubject).toBe('user-999');
      expect(session.save).toHaveBeenCalledTimes(1);

      // Should NOT have session data yet
      expect(session.accessToken).toBeUndefined();
      expect(session.user).toBeUndefined();
      expect(session.tenant).toBeUndefined();
    });

    it('should handle realms without optional fields', async () => {
      const mockLoginResult: LoginResult = {
        success: true,
        subject: 'user-111',
        tenants: [
          {
            id: 'tenant-minimal-1',
            name: 'Minimal Tenant 1',
            zoneId: 'zone-1',
            type: 'PRODUCTION',
            isActive: true,
            // No description
          },
          {
            id: 'tenant-minimal-2',
            name: 'Minimal Tenant 2',
            zoneId: 'zone-2',
            type: 'DEVELOPMENT',
            isActive: true,
          },
        ],
      };

      const authClient = createMockAuthClient(mockLoginResult);
      const signIn = createSignIn(authClient);
      const session = createMockSession();

      const result = await signIn(credentials, session);

      expect(result.success).toBe(true);
      expect(result.tenant?.available).toHaveLength(2);
      expect(result.tenant?.available?.[0]).toEqual({
        id: 'tenant-minimal-1',
        name: 'Minimal Tenant 1',
        zoneId: 'zone-1',
        realmType: 'PRODUCTION',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication failure', async () => {
      const mockLoginResult: LoginResult = {
        success: false,
        error: 'Invalid credentials',
      };

      const authClient = createMockAuthClient(mockLoginResult);
      const signIn = createSignIn(authClient);
      const session = createMockSession();

      const result = await signIn(credentials, session);

      expect(result).toEqual({
        success: false,
        error: 'Invalid credentials',
      });

      // Session should not be modified
      expect(session.save).not.toHaveBeenCalled();
      expect(session.accessToken).toBeUndefined();
      expect(session.pendingTenantSelection).toBeUndefined();
    });

    it('should handle network errors', async () => {
      const authClient = {
        authenticate: jest.fn().mockRejectedValue(new Error('Network error')),
      } as any;

      const signIn = createSignIn(authClient);
      const session = createMockSession();

      const result = await signIn(credentials, session);

      expect(result).toEqual({
        success: false,
        error: 'Network error',
      });

      expect(session.save).not.toHaveBeenCalled();
    });

    it('should handle unknown errors', async () => {
      const authClient = {
        authenticate: jest.fn().mockRejectedValue('Unknown error'),
      } as any;

      const signIn = createSignIn(authClient);
      const session = createMockSession();

      const result = await signIn(credentials, session);

      expect(result).toEqual({
        success: false,
        error: 'Authentication failed',
      });
    });

    it('should handle invalid response from auth server', async () => {
      const mockLoginResult: LoginResult = {
        success: true,
        subject: 'user-123',
        // Missing required fields for successful auth (no tokens, no realms)
      };

      const authClient = createMockAuthClient(mockLoginResult);
      const signIn = createSignIn(authClient);
      const session = createMockSession();

      const result = await signIn(credentials, session);

      // Should be treated as no tenant scenario
      expect(result).toEqual({
        success: true,
        tenant: {
          available: [],
        },
        subject: 'user-123',
      });
    });
  });

  describe('Session Management', () => {
    it('should save session for all successful scenarios', async () => {
      // Test no-tenant scenario
      const noTenantResult: LoginResult = {
        success: true,
        subject: 'user-1',
        tenants: [],
      };

      let authClient = createMockAuthClient(noTenantResult);
      let signIn = createSignIn(authClient);
      let session = createMockSession();

      await signIn(credentials, session);
      expect(session.save).toHaveBeenCalledTimes(1);

      // Test single-tenant scenario
      const singleTenantResult: LoginResult = {
        success: true,
        accessToken: 'token',
        identityContext: {
          zone: 'zone-1',
          tenant: 'tenant-1',
          subject: {
            accountId: 'account-1',
            userId: 'user-1',
            username: 'user',
            email: 'user@test.com',
          },
          groups: [],
        },
        tenants: [
          {
            id: 'tenant-1',
            name: 'Tenant 1',
            zoneId: 'zone-1',
            type: 'PRODUCTION',
            isActive: true,
          },
        ],
      };

      authClient = createMockAuthClient(singleTenantResult);
      signIn = createSignIn(authClient);
      session = createMockSession();

      await signIn(credentials, session);
      expect(session.save).toHaveBeenCalledTimes(1);

      // Test multi-tenant scenario
      const multiTenantResult: LoginResult = {
        success: true,
        subject: 'user-1',
        tenants: [
          {
            id: 'tenant-1',
            name: 'Tenant 1',
            zoneId: 'zone-1',
            type: 'PRODUCTION',
            isActive: true,
          },
          {
            id: 'tenant-2',
            name: 'Tenant 2',
            zoneId: 'zone-2',
            type: 'PRODUCTION',
            isActive: true,
          },
        ],
      };

      authClient = createMockAuthClient(multiTenantResult);
      signIn = createSignIn(authClient);
      session = createMockSession();

      await signIn(credentials, session);
      expect(session.save).toHaveBeenCalledTimes(1);
    });

    it('should not save session on authentication failure', async () => {
      const mockLoginResult: LoginResult = {
        success: false,
        error: 'Invalid password',
      };

      const authClient = createMockAuthClient(mockLoginResult);
      const signIn = createSignIn(authClient);
      const session = createMockSession();

      await signIn(credentials, session);

      expect(session.save).not.toHaveBeenCalled();
    });
  });

  describe('AuthClient Integration', () => {
    it('should call authClient.authenticate with correct credentials', async () => {
      const mockLoginResult: LoginResult = {
        success: true,
        subject: 'user-1',
        tenants: [],
      };

      const authClient = createMockAuthClient(mockLoginResult);
      const signIn = createSignIn(authClient);
      const session = createMockSession();

      await signIn(credentials, session);

      expect(authClient.authenticate).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(authClient.authenticate).toHaveBeenCalledTimes(1);
    });

    it('should handle different credential formats', async () => {
      const mockLoginResult: LoginResult = {
        success: true,
        subject: 'user-1',
        tenants: [],
      };

      const authClient = createMockAuthClient(mockLoginResult);
      const signIn = createSignIn(authClient);
      const session = createMockSession();

      // Test with email
      await signIn({ username: 'user@example.com', password: 'pass1' }, session);
      expect(authClient.authenticate).toHaveBeenLastCalledWith('user@example.com', 'pass1');

      // Test with username
      await signIn({ username: 'username123', password: 'pass2' }, session);
      expect(authClient.authenticate).toHaveBeenLastCalledWith('username123', 'pass2');
    });
  });
});
