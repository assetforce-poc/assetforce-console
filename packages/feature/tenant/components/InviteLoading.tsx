'use client';

import { FC } from 'react';
import { CircularProgress } from '@assetforce/material';
import styles from './styles.module.scss';

interface InviteLoadingProps {
  message?: string;
}

/**
 * Loading state for invite page.
 */
export const InviteLoading: FC<InviteLoadingProps> = ({
  message = 'Validating invitation...',
}) => {
  return (
    <div className={styles.loadingContainer}>
      <CircularProgress size={60} />
      <p>{message}</p>
    </div>
  );
};

export default InviteLoading;
