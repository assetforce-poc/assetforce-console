'use client';

import { Chip } from '@assetforce/material';
import type { FC } from 'react';

import type { ChangeSeverity } from '../../generated/graphql';
import { severityColors, severityLabels } from '../types';

interface SeverityBadgeProps {
  severity: ChangeSeverity;
  size?: 'small' | 'medium';
}

/**
 * Badge component for displaying change severity
 */
export const SeverityBadge: FC<SeverityBadgeProps> = ({ severity, size = 'small' }) => {
  return <Chip label={severityLabels[severity]} color={severityColors[severity]} size={size} />;
};
