import type { IronSession } from 'iron-session';

import { type AuthClient, fromAuthResult } from '../../internal/aac';
import { assignSessionData } from '../../internal/session';
import type { SessionData } from '../../types';
import type { SelectTenantResult } from '../types';

/**
 * Create selectTenant API method
 */
export const createSelectTenant =
  (authClient: AuthClient) =>
  async (subject: string, tenantId: string, session: IronSession<SessionData>): Promise<SelectTenantResult> => {
    try {
      const result = await authClient.selectTenant(subject, tenantId);

      if (!result.success) {
        return { success: false, error: result.error || 'Tenant selection failed' };
      }

      const sessionData = fromAuthResult(result);
      if (!sessionData) {
        return { success: false, error: 'Invalid tenant selection response' };
      }

      // Clear pending state and set session data
      session.pendingTenantSelection = false;
      session.availableTenants = undefined;
      assignSessionData(session, sessionData);
      await session.save();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tenant selection failed',
      };
    }
  };
