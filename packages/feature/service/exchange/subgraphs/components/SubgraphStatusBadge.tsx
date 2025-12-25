'use client';

import { Chip } from '@assetforce/material';
import type { FC } from 'react';

import type { SubgraphStatus } from '../../../generated/graphql';
import { subgraphStatusColors, subgraphStatusLabels } from '../types';

interface SubgraphStatusBadgeProps {
  status: SubgraphStatus;
  size?: 'small' | 'medium';
}

/**
 * Badge component for displaying subgraph status
 */
export const SubgraphStatusBadge: FC<SubgraphStatusBadgeProps> = ({ status, size = 'small' }) => {
  return <Chip label={subgraphStatusLabels[status]} color={subgraphStatusColors[status]} size={size} />;
};
