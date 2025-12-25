/**
 * Contract Deprecation Notification Types
 *
 * Re-exported from GraphQL codegen to avoid hand-maintained duplicates.
 */

import type { DeepOmit } from '@assetforce/graphql';

import type {
  ContractDeprecationNotification as ContractDeprecationNotificationGql,
  DeprecationNotificationListInput as DeprecationNotificationListInputGql,
} from '../generated/graphql';

export type ContractDeprecationNotification = DeepOmit<ContractDeprecationNotificationGql>;
export type DeprecationNotificationListInput = DeprecationNotificationListInputGql;

/**
 * Filter option for deprecation notifications
 */
export interface DeprecationFilter {
  acknowledged?: boolean;
  limit?: number;
  offset?: number;
}
