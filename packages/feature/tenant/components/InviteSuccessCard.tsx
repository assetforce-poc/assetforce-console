'use client';

import { Button } from '@assetforce/material';
import clsx from 'clsx';
import type { FC } from 'react';

import type { Membership } from '../types/invite';
import { InviteCard } from './InviteCard';
import styles from './styles.module.scss';

interface InviteSuccessCardProps {
  membership: Membership;
  onContinue: () => void;
}

/**
 * Card displayed after successfully accepting an invitation.
 */
export const InviteSuccessCard: FC<InviteSuccessCardProps> = ({ membership, onContinue }) => {
  return (
    <InviteCard
      title="Welcome!"
      subtitle={`You've successfully joined ${membership.tenant.name}`}
      icon={<span>✅</span>}
      iconVariant="success"
    >
      <div className={clsx(styles.infoBox, styles.infoBoxSuccess)}>
        <p className={clsx(styles.textCenter, styles.fontMedium)}>{membership.tenant.name}</p>
        <p className={styles.textCenter}>
          <span className={styles.chipSuccess}>{membership.role}</span>
        </p>
      </div>

      <p className={styles.textCenter}>You now have access to this organization. Click below to continue.</p>

      <div className={styles.buttonContainer}>
        <Button variant="contained" color="primary" size="large" onClick={onContinue}>
          Continue to Dashboard
        </Button>
      </div>
    </InviteCard>
  );
};

export default InviteSuccessCard;
