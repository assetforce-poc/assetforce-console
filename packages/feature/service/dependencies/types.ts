/**
 * Service Dependency Graph Types
 *
 * Re-exported from GraphQL codegen to avoid hand-maintained duplicates.
 */

import type { DeepOmit } from '@assetforce/graphql';

import type {
  ConsumesNode as ConsumesNodeGql,
  ContractDependencyGraph as ContractDependencyGraphGql,
  DependencyGraphInput as DependencyGraphInputGql,
  ProvidesNode as ProvidesNodeGql,
  Service as ServiceGql,
  ServiceContract as ServiceContractGql,
} from '../generated/graphql';

export type DependencyGraphInput = DependencyGraphInputGql;
export type ContractDependencyGraph = DeepOmit<ContractDependencyGraphGql>;
export type ProvidesNode = DeepOmit<ProvidesNodeGql>;
export type ConsumesNode = DeepOmit<ConsumesNodeGql>;
export type DependencyServiceInfo = DeepOmit<ServiceGql>;
export type DependencyContractSummary = DeepOmit<ServiceContractGql>;

/**
 * Graph node representation for visualization
 */
export interface GraphNode {
  id: string;
  label: string;
  type: 'current' | 'provider' | 'consumer';
  slug?: string;
  serviceType?: string;
}

/**
 * Graph edge representation for visualization
 */
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: 'provides' | 'consumes';
  contractId: string;
  operation?: string;
}

/**
 * Full graph data for visualization
 */
export interface DependencyGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
