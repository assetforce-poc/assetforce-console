/**
 * Re-export generated types from codegen.
 * Run `yarn codegen` to generate types from GraphQL schema.
 */
export type {
  Service,
  ServiceType,
  ServiceLifecycle,
  ServiceHealthSummary,
  ServiceDependency,
  ServiceIdentity,
  ServiceInstance,
  HealthStatus,
  Environment,
  ProbeApprovalStatus,
  ServiceOneInput,
} from '../generated/graphql';
