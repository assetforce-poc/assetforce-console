'use client';

import { Button } from '@assetforce/material';
import clsx from 'clsx';
import type { FC } from 'react';

import type { Invite } from '../types/invite';
import { InviteCard } from './InviteCard';
import styles from './styles.module.scss';

interface InviteAcceptCardProps {
  invite: Invite;
  onAccept: () => void;
  loading?: boolean;
}

/**
 * Card displayed when invite is valid and user can accept.
 * Shows invite details and accept CTA.
 */
export const InviteAcceptCard: FC<InviteAcceptCardProps> = ({ invite, onAccept, loading = false }) => {
  return (
    <InviteCard
      title="You've been invited!"
      subtitle={`You have been invited to join ${invite.tenantName}`}
      icon={<span>🏢</span>}
      iconVariant="primary"
    >
      <div className={styles.infoBox}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Organization:</span>
          <span className={styles.infoValue}>{invite.tenantName}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Invited email:</span>
          <span className={styles.infoValue}>{invite.invitedEmail}</span>
        </div>

        {invite.inviterEmail && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Invited by:</span>
            <span className={styles.infoValue}>{invite.inviterEmail}</span>
          </div>
        )}

        {invite.role && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Role:</span>
            <span className={styles.chip}>{invite.role}</span>
          </div>
        )}
      </div>

      {invite.message && (
        <div className={clsx(styles.infoBox, styles.infoBoxHighlight)}>
          <p className={clsx(styles.textSmall, styles.textSecondary)}>Message from inviter:</p>
          <p className={styles.textSmall}>{invite.message}</p>
        </div>
      )}

      <div className={styles.buttonContainer}>
        <Button variant="contained" color="primary" size="large" onClick={onAccept} disabled={loading}>
          {loading ? 'Accepting...' : 'Accept Invitation'}
        </Button>
      </div>
    </InviteCard>
  );
};

export default InviteAcceptCard;
