'use client';

import { Alert, Button } from '@assetforce/material';
import clsx from 'clsx';
import type { FC } from 'react';

import type { EmailMatchInfo, Invite } from '../types/invite';
import { InviteCard } from './InviteCard';
import styles from './styles.module.scss';

interface InviteEmailMismatchProps {
  invite?: Invite;
  email: EmailMatchInfo;
  onSwitchAccount: () => void;
  onCancel?: () => void;
}

/**
 * Card displayed when logged-in user's email doesn't match the invited email.
 */
export const InviteEmailMismatch: FC<InviteEmailMismatchProps> = ({ invite, email, onSwitchAccount, onCancel }) => {
  return (
    <InviteCard title="Email Mismatch" icon={<span>⚠️</span>} iconVariant="warning">
      <Alert severity="warning" className={styles.alert}>
        This invitation was sent to a different email address.
      </Alert>

      <div className={styles.infoBox}>
        <div className={styles.infoRowSpaced}>
          <span className={styles.infoLabel}>Invited email:</span>
          <span className={styles.infoValue}>{email.invited}</span>
        </div>
        <div className={styles.infoRowSpaced}>
          <span className={styles.infoLabel}>Your email:</span>
          <span className={styles.infoValue}>{email.current || 'Unknown'}</span>
        </div>
      </div>

      <p className={styles.textCenter}>
        Please sign in with the email address <strong>{email.invited}</strong> to accept this invitation.
      </p>

      <div className={styles.buttonContainer}>
        <Button variant="contained" color="primary" size="large" onClick={onSwitchAccount}>
          Switch Account
        </Button>

        {onCancel && (
          <Button variant="text" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </InviteCard>
  );
};

export default InviteEmailMismatch;
