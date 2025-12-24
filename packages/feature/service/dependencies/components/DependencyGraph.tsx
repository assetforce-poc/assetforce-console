'use client';

import { Box, Chip, Paper, Tooltip, Typography } from '@assetforce/material';
import type { FC } from 'react';
import { useCallback, useMemo } from 'react';

import type { DependencyGraphData, GraphEdge, GraphNode } from '../types';

interface DependencyGraphProps {
  data: DependencyGraphData;
  onNodeClick?: (node: GraphNode) => void;
  onEdgeClick?: (edge: GraphEdge) => void;
}

interface NodePosition {
  x: number;
  y: number;
}

/**
 * Calculate node positions in a radial layout
 * Current service at center, providers on left, consumers on right
 */
function calculateNodePositions(nodes: GraphNode[]): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  const centerX = 400;
  const centerY = 250;
  const radius = 180;

  const currentNode = nodes.find((n) => n.type === 'current');
  const providers = nodes.filter((n) => n.type === 'provider');
  const consumers = nodes.filter((n) => n.type === 'consumer');

  // Center node
  if (currentNode) {
    positions.set(currentNode.id, { x: centerX, y: centerY });
  }

  // Providers on the left (semicircle)
  providers.forEach((node, index) => {
    const angle = Math.PI / 2 + (Math.PI * (index + 1)) / (providers.length + 1);
    positions.set(node.id, {
      x: centerX + radius * Math.cos(angle) - 50,
      y: centerY + radius * Math.sin(angle) * 0.8,
    });
  });

  // Consumers on the right (semicircle)
  consumers.forEach((node, index) => {
    const angle = -Math.PI / 2 + (Math.PI * (index + 1)) / (consumers.length + 1);
    positions.set(node.id, {
      x: centerX + radius * Math.cos(angle) + 50,
      y: centerY + radius * Math.sin(angle) * 0.8,
    });
  });

  return positions;
}

/**
 * Node colors based on type
 */
const nodeColors: Record<GraphNode['type'], { bg: string; border: string; text: string }> = {
  current: { bg: '#1976d2', border: '#1565c0', text: '#ffffff' },
  provider: { bg: '#2e7d32', border: '#1b5e20', text: '#ffffff' },
  consumer: { bg: '#ed6c02', border: '#e65100', text: '#ffffff' },
};

/**
 * SVG-based dependency graph visualization
 */
export const DependencyGraph: FC<DependencyGraphProps> = ({ data, onNodeClick, onEdgeClick }) => {
  const positions = useMemo(() => calculateNodePositions(data.nodes), [data.nodes]);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      onNodeClick?.(node);
    },
    [onNodeClick]
  );

  const handleEdgeClick = useCallback(
    (edge: GraphEdge) => {
      onEdgeClick?.(edge);
    },
    [onEdgeClick]
  );

  if (data.nodes.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No dependency data available</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
        <Chip
          size="small"
          label="Current Service"
          sx={{ bgcolor: nodeColors.current.bg, color: nodeColors.current.text }}
        />
        <Chip
          size="small"
          label="Providers (CONSUMES from)"
          sx={{ bgcolor: nodeColors.provider.bg, color: nodeColors.provider.text }}
        />
        <Chip
          size="small"
          label="Consumers (PROVIDES to)"
          sx={{ bgcolor: nodeColors.consumer.bg, color: nodeColors.consumer.text }}
        />
      </Box>

      {/* SVG Graph */}
      <svg width="100%" height="500" viewBox="0 0 800 500" style={{ minWidth: 600 }}>
        <defs>
          {/* Arrow marker for edges */}
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
          <marker id="arrowhead-provides" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#2e7d32" />
          </marker>
          <marker id="arrowhead-consumes" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ed6c02" />
          </marker>
        </defs>

        {/* Edges */}
        {data.edges.map((edge) => {
          const sourcePos = positions.get(edge.source);
          const targetPos = positions.get(edge.target);
          if (!sourcePos || !targetPos) return null;

          const isProvides = edge.type === 'provides';
          const strokeColor = isProvides ? '#2e7d32' : '#ed6c02';
          const markerId = isProvides ? 'arrowhead-provides' : 'arrowhead-consumes';

          // Calculate edge path with curve
          const midX = (sourcePos.x + targetPos.x) / 2;
          const midY = (sourcePos.y + targetPos.y) / 2;

          // Offset for edge labels
          const dx = targetPos.x - sourcePos.x;
          const dy = targetPos.y - sourcePos.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const offsetX = (-dy / len) * 10;
          const offsetY = (dx / len) * 10;

          return (
            <g key={edge.id} onClick={() => handleEdgeClick(edge)} style={{ cursor: 'pointer' }}>
              {/* Edge line */}
              <line
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke={strokeColor}
                strokeWidth="2"
                markerEnd={`url(#${markerId})`}
                opacity="0.7"
              />
              {/* Edge label */}
              {edge.label && (
                <Tooltip title={edge.operation || edge.label}>
                  <text
                    x={midX + offsetX}
                    y={midY + offsetY}
                    fontSize="10"
                    fill="#666"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ pointerEvents: 'none' }}
                  >
                    {edge.label.length > 20 ? `${edge.label.slice(0, 17)}...` : edge.label}
                  </text>
                </Tooltip>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {data.nodes.map((node) => {
          const pos = positions.get(node.id);
          if (!pos) return null;

          const colors = nodeColors[node.type];
          const nodeWidth = Math.max(80, node.label.length * 7);
          const nodeHeight = 36;

          return (
            <g
              key={node.id}
              transform={`translate(${pos.x - nodeWidth / 2}, ${pos.y - nodeHeight / 2})`}
              onClick={() => handleNodeClick(node)}
              style={{ cursor: node.slug ? 'pointer' : 'default' }}
            >
              {/* Node background */}
              <rect
                width={nodeWidth}
                height={nodeHeight}
                rx="6"
                ry="6"
                fill={colors.bg}
                stroke={colors.border}
                strokeWidth="2"
              />
              {/* Node label */}
              <text
                x={nodeWidth / 2}
                y={nodeHeight / 2}
                fontSize="12"
                fill={colors.text}
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight={node.type === 'current' ? 'bold' : 'normal'}
              >
                {node.label}
              </text>
              {/* Service type badge */}
              {node.serviceType && (
                <text
                  x={nodeWidth / 2}
                  y={nodeHeight + 12}
                  fontSize="9"
                  fill="#999"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {node.serviceType}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </Box>
  );
};
