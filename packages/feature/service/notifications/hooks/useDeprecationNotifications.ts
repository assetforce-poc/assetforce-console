'use client';

import { useMutation, useQuery } from '@assetforce/graphql';

import {
  AcknowledgeDeprecationNotificationsDocument,
  ListDeprecationNotificationsDocument,
} from '../../generated/graphql';
import type { ContractDeprecationNotification } from '../deprecation-types';

interface UseDeprecationNotificationsOptions {
  /** Target service ID */
  target: string;
  /** Filter by acknowledged status */
  acknowledged?: boolean;
  /** Pagination offset */
  offset?: number;
  /** Pagination limit */
  limit?: number;
}

/**
 * Hook for fetching contract deprecation notifications for a service
 */
export function useDeprecationNotifications(options: UseDeprecationNotificationsOptions) {
  const { target, acknowledged, offset = 0, limit = 20 } = options;

  const { data, loading, error, refetch } = useQuery(ListDeprecationNotificationsDocument, {
    variables: {
      input: {
        target,
        acknowledged,
        page: { offset, limit },
      },
    },
    skip: !target,
  });

  // Acknowledge mutation
  const [acknowledgeMutation, { loading: acknowledging }] = useMutation(AcknowledgeDeprecationNotificationsDocument, {
    onCompleted: () => refetch(),
  });

  const notifications = (data?.exchange?.notification?.deprecation?.list?.items ?? []).filter(
    (item): item is ContractDeprecationNotification => Boolean(item)
  );

  return {
    // Data
    notifications,
    total: data?.exchange?.notification?.deprecation?.list?.total ?? 0,
    limit: data?.exchange?.notification?.deprecation?.list?.limit ?? limit,
    offset: data?.exchange?.notification?.deprecation?.list?.offset ?? offset,

    // Statistics
    unacknowledgedCount: notifications.filter((n) => !n.acknowledged).length,
    activeDeprecations: notifications.filter((n) => !n.acknowledged && !n.removalVersion),
    urgentDeprecations: notifications.filter((n) => !n.acknowledged && n.removalVersion),

    // Query state
    loading,
    error: error as Error | undefined,
    refetch: async () => {
      await refetch();
    },

    // Mutations
    acknowledge: async (ids: string[]) => {
      await acknowledgeMutation({ variables: { ids } });
    },
    acknowledgeAll: async () => {
      const unacknowledgedIds = notifications.filter((n) => !n.acknowledged).map((n) => n.id);
      if (unacknowledgedIds.length > 0) {
        await acknowledgeMutation({ variables: { ids: unacknowledgedIds } });
      }
    },
    acknowledging,
  };
}
