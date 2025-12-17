'use client';

import { FC, ReactNode } from 'react';
import { Paper, Typography } from '@assetforce/material';
import clsx from 'clsx';
import styles from './styles.module.scss';

interface InviteCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  icon?: ReactNode;
  iconVariant?: 'primary' | 'success' | 'warning' | 'error';
}

/**
 * Base card component for invite page states.
 * Provides consistent styling across all invite-related cards.
 */
export const InviteCard: FC<InviteCardProps> = ({
  title,
  subtitle,
  children,
  icon,
  iconVariant = 'primary',
}) => {
  const iconClass = clsx(styles.icon, {
    [styles.iconPrimary]: iconVariant === 'primary',
    [styles.iconSuccess]: iconVariant === 'success',
    [styles.iconWarning]: iconVariant === 'warning',
    [styles.iconError]: iconVariant === 'error',
  });

  return (
    <Paper className={styles.card} elevation={3}>
      <div className={styles.cardContent}>
        {icon && <div className={iconClass}>{icon}</div>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
      </div>
    </Paper>
  );
};

export default InviteCard;
