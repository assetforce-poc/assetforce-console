'use client';

import { useQuery } from '@assetforce/graphql';
import { useMemo } from 'react';

import { GetDependencyGraphDocument } from '../../generated/graphql';
import type {
  ConsumesNode,
  ContractDependencyGraph,
  DependencyGraphData,
  DependencyGraphInput,
  GraphEdge,
  GraphNode,
  ProvidesNode,
} from '../types';

/**
 * Transform API response to visualization-friendly graph data
 */
function transformToGraphData(graph: ContractDependencyGraph | null | undefined): DependencyGraphData {
  if (!graph) {
    return { nodes: [], edges: [] };
  }

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();

  // Add current service as center node
  const currentService = graph.service;
  if (currentService) {
    nodes.push({
      id: currentService.id,
      label: currentService.displayName || currentService.slug || 'Unknown',
      type: 'current',
      slug: currentService.slug ?? undefined,
      serviceType: currentService.type ?? undefined,
    });
    nodeIds.add(currentService.id);
  }

  // Process PROVIDES contracts (current service provides, others consume)
  graph.provides?.forEach((provideNode: ProvidesNode) => {
    const contract = provideNode.contract;
    const operation = contract?.graphql?.operation;

    // Add consumer nodes
    provideNode.consumers?.forEach((consumer) => {
      if (!nodeIds.has(consumer.id)) {
        nodes.push({
          id: consumer.id,
          label: consumer.displayName || consumer.slug || 'Unknown',
          type: 'consumer',
          slug: consumer.slug ?? undefined,
          serviceType: consumer.type ?? undefined,
        });
        nodeIds.add(consumer.id);
      }

      // Edge: current service -> consumer (provides)
      edges.push({
        id: `${currentService?.id}-${consumer.id}-${contract?.id}`,
        source: currentService?.id || '',
        target: consumer.id,
        label: operation || 'API',
        type: 'provides',
        contractId: contract?.id || '',
        operation: operation ?? undefined,
      });
    });
  });

  // Process CONSUMES contracts (current service consumes, others provide)
  graph.consumes?.forEach((consumeNode: ConsumesNode) => {
    const contract = consumeNode.contract;
    const operation = contract?.graphql?.operation;

    // Add provider nodes
    consumeNode.providers?.forEach((provider) => {
      if (!nodeIds.has(provider.id)) {
        nodes.push({
          id: provider.id,
          label: provider.displayName || provider.slug || 'Unknown',
          type: 'provider',
          slug: provider.slug ?? undefined,
          serviceType: provider.type ?? undefined,
        });
        nodeIds.add(provider.id);
      }

      // Edge: provider -> current service (provides)
      edges.push({
        id: `${provider.id}-${currentService?.id}-${contract?.id}`,
        source: provider.id,
        target: currentService?.id || '',
        label: operation || 'API',
        type: 'consumes',
        contractId: contract?.id || '',
        operation: operation ?? undefined,
      });
    });
  });

  return { nodes, edges };
}

/**
 * Hook for fetching service dependency graph
 *
 * @example
 * ```tsx
 * const { graph, graphData, loading } = useDependencies({ serviceId: 'sgc' });
 * ```
 */
export function useDependencies(input: DependencyGraphInput) {
  const { data, loading, error, refetch } = useQuery(GetDependencyGraphDocument, {
    variables: { input },
    skip: !input.serviceId,
  });

  const graph = data?.service?.contract?.dependencies as ContractDependencyGraph | null | undefined;

  // Transform to visualization-friendly format
  const graphData = useMemo(() => transformToGraphData(graph), [graph]);

  return {
    // Raw API response
    graph,

    // Transformed for visualization
    graphData,

    // Statistics
    providesCount: graph?.provides?.length ?? 0,
    consumesCount: graph?.consumes?.length ?? 0,
    totalNodes: graphData.nodes.length,
    totalEdges: graphData.edges.length,

    // Query state
    loading,
    error: error as Error | undefined,
    refetch: async () => {
      await refetch();
    },
  };
}
