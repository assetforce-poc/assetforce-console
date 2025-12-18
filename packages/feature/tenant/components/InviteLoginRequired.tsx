'use client';

import { Button } from '@assetforce/material';
import type { FC } from 'react';

import type { Invite } from '../types/invite';
import { InviteCard } from './InviteCard';
import styles from './styles.module.scss';

interface InviteLoginRequiredProps {
  invite?: Invite;
  onLogin: () => void;
  onRegister?: () => void;
}

/**
 * Card displayed when user needs to log in before accepting invite.
 */
export const InviteLoginRequired: FC<InviteLoginRequiredProps> = ({ invite, onLogin, onRegister }) => {
  return (
    <InviteCard
      title="Sign In Required"
      subtitle={
        invite ? `Sign in to accept your invitation to ${invite.tenantName}` : 'Sign in to accept this invitation'
      }
      icon={<span>🔒</span>}
      iconVariant="primary"
    >
      {invite && (
        <div className={styles.infoBox}>
          <p className={styles.textCenter}>
            This invitation was sent to <strong>{invite.invitedEmail}</strong>
          </p>
        </div>
      )}

      <p className={styles.textCenter}>Please sign in with the email address this invitation was sent to.</p>

      <div className={styles.buttonContainer}>
        <Button variant="contained" color="primary" size="large" onClick={onLogin}>
          Sign In
        </Button>

        {onRegister && (
          <>
            <p className={styles.textCenter}>Don&apos;t have an account?</p>
            <Button variant="outlined" color="primary" onClick={onRegister}>
              Create Account
            </Button>
          </>
        )}
      </div>
    </InviteCard>
  );
};

export default InviteLoginRequired;
