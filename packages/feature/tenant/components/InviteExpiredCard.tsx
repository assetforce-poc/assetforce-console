'use client';

import { Button } from '@assetforce/material';
import type { FC } from 'react';

import { getErrorMessage } from '../constants';
import type { InviteError } from '../types/invite';
import { InviteCard } from './InviteCard';
import styles from './styles.module.scss';

interface InviteExpiredCardProps {
  error?: InviteError;
  onGoHome?: () => void;
}

/**
 * Card displayed when invite is expired, invalid, or already used.
 */
export const InviteExpiredCard: FC<InviteExpiredCardProps> = ({ error, onGoHome }) => {
  const errorMessage = error ? getErrorMessage(error.code) : 'This invite link is invalid or has expired.';

  return (
    <InviteCard title="Invite Not Available" icon={<span>⚠️</span>} iconVariant="error">
      <p className={styles.textCenter}>{errorMessage}</p>

      <div className={styles.infoBox}>
        <p className={styles.textCenter}>
          Please contact the administrator who sent you this invite to request a new one.
        </p>
      </div>

      {onGoHome && (
        <div className={styles.buttonContainer}>
          <Button variant="outlined" color="primary" onClick={onGoHome}>
            Go to Home
          </Button>
        </div>
      )}
    </InviteCard>
  );
};

export default InviteExpiredCard;
