/**
 * Re-export generated types from codegen.
 * Run `yarn codegen` to generate types from GraphQL schema.
 */
export type {
  Environment,
  HealthStatus,
  ProbeApprovalStatus,
  Service,
  ServiceDependency,
  ServiceHealthSummary,
  ServiceIdentity,
  ServiceInstance,
  ServiceLifecycle,
  ServiceOneInput,
  ServiceType,
} from '../generated/graphql';
