/**
 * Re-export generated types from codegen.
 * Run `yarn codegen` to generate types from GraphQL schema.
 */
export type {
  ServiceType,
  ServiceLifecycle,
  HealthStatus,
  Service,
  ServiceHealthSummary,
  ServiceListInput,
  ServiceConnection,
  PageInput,
} from '../generated/graphql';
