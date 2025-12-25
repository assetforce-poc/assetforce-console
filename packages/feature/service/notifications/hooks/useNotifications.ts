'use client';

import { useMutation, useQuery } from '@assetforce/graphql';

import {
  AcknowledgeNotificationsDocument,
  type ChangeSeverity,
  ListNotificationsDocument,
} from '../../generated/graphql';
import type { SchemaChangeNotification } from '../types';

interface UseNotificationsOptions {
  /** Target service ID */
  target: string;
  /** Filter by acknowledged status */
  acknowledged?: boolean;
  /** Filter by severity */
  severity?: ChangeSeverity[];
  /** Pagination offset */
  offset?: number;
  /** Pagination limit */
  limit?: number;
}

/**
 * Hook for fetching schema change notifications for a service
 */
export function useNotifications(options: UseNotificationsOptions) {
  const { target, acknowledged, severity, offset = 0, limit = 20 } = options;

  const { data, loading, error, refetch } = useQuery(ListNotificationsDocument, {
    variables: {
      input: {
        target,
        acknowledged,
        severity,
        page: { offset, limit },
      },
    },
    skip: !target,
  });

  // Acknowledge mutation
  const [acknowledgeMutation, { loading: acknowledging }] = useMutation(AcknowledgeNotificationsDocument, {
    onCompleted: () => refetch(),
  });

  const notifications = (data?.exchange?.notification?.list?.items ?? []).filter(
    (item): item is SchemaChangeNotification => Boolean(item)
  );

  return {
    // Data
    notifications,
    total: data?.exchange?.notification?.list?.total ?? 0,
    limit: data?.exchange?.notification?.list?.limit ?? limit,
    offset: data?.exchange?.notification?.list?.offset ?? offset,

    // Statistics
    unacknowledgedCount: notifications.filter((n) => !n.acknowledged).length,
    majorCount: notifications.filter((n) => n.schemaChange?.severity === 'MAJOR').length,

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
