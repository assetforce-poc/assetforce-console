import type { IronSession } from 'iron-session';

import { type AuthClient, fromLoginResult } from '../../internal/aac';
import { assignSessionData } from '../../internal/session';
import type { SessionData } from '../../types';
import type { SignInCredentials, SignInResult } from '../types';

/**
 * Create signIn API method
 */
export const createSignIn =
  (authClient: AuthClient) =>
  async (credentials: SignInCredentials, session: IronSession<SessionData>): Promise<SignInResult> => {
    try {
      const result = await authClient.authenticate(credentials.username, credentials.password);
      const authResult = fromLoginResult(result);

      if (!authResult.success) {
        return { success: false, error: authResult.error };
      }

      // No tenant: requires onboarding
      if (authResult.requiresTenantOnboarding) {
        session.pendingTenantSelection = false;
        session.requiresTenantOnboarding = true;
        session._pendingSubject = authResult.subject;
        await session.save();

        return {
          success: true,
          tenant: {
            available: [],
          },
          subject: authResult.subject,
        };
      }

      // Multi-tenant: requires selection
      if (authResult.requiresTenantSelection) {
        session.pendingTenantSelection = true;
        session.availableTenants = authResult.availableTenants;
        session._pendingSubject = authResult.subject;
        await session.save();

        return {
          success: true,
          tenant: {
            available: authResult.availableTenants,
          },
          subject: authResult.subject,
        };
      }

      // Single tenant: got session data
      if (authResult.sessionData) {
        assignSessionData(session, authResult.sessionData);
        await session.save();
        return { success: true };
      }

      return { success: false, error: 'Invalid authentication response' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  };
