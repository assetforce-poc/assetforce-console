/**
 * Schema Change Notification Types
 *
 * Re-exported from GraphQL codegen to avoid hand-maintained duplicates.
 */

import type { DeepOmit } from '@assetforce/graphql';

import type {
  ChangeSeverity as ChangeSeverityGql,
  NotificationListInput as NotificationListInputGql,
  SchemaChange as SchemaChangeGql,
  SchemaChangeNotification as SchemaChangeNotificationGql,
} from '../generated/graphql';

export type SchemaChangeNotification = DeepOmit<SchemaChangeNotificationGql>;
export type SchemaChange = DeepOmit<SchemaChangeGql>;
export type NotificationListInput = NotificationListInputGql;
export { ChangeSeverity } from '../generated/graphql';

/**
 * Severity color mapping for UI display
 */
export const severityColors: Record<ChangeSeverityGql, 'error' | 'warning' | 'info'> = {
  MAJOR: 'error',
  MINOR: 'warning',
  PATCH: 'info',
};

/**
 * Severity labels for display
 */
export const severityLabels: Record<ChangeSeverityGql, string> = {
  MAJOR: 'Breaking Change',
  MINOR: 'New Feature',
  PATCH: 'Patch',
};

/**
 * Severity icons for display
 */
export const severityIcons: Record<ChangeSeverityGql, string> = {
  MAJOR: 'Error',
  MINOR: 'Warning',
  PATCH: 'Info',
};
