'use client';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@assetforce/material';
import { useState } from 'react';

import type { ContractDeprecateInput, ServiceContract } from '../types';

export interface DeprecateDialogProps {
  /** Whether dialog is open */
  open: boolean;

  /** Close handler */
  onClose: () => void;

  /** Contract to deprecate */
  contract: ServiceContract;

  /** Submit handler */
  onSubmit: (input: ContractDeprecateInput) => Promise<void>;
}

/**
 * DeprecateDialog - Form for deprecating a contract
 */
export function DeprecateDialog({ open, onClose, contract, onSubmit }: DeprecateDialogProps) {
  const [reason, setReason] = useState('');
  const [since, setSince] = useState('');
  const [alternative, setAlternative] = useState('');
  const [removal, setRemoval] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert('Reason is required');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        id: contract.id,
        reason: reason.trim(),
        since: since.trim() || undefined,
        alternative: alternative.trim() || undefined,
        removal: removal.trim() || undefined,
      });

      // Reset form
      setReason('');
      setSince('');
      setAlternative('');
      setRemoval('');
    } catch (error) {
      console.error('Failed to deprecate contract:', error);
      alert('Failed to deprecate contract');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Deprecate Contract</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <TextField
          label="Contract Operation"
          value={contract.graphql?.operation || contract.id}
          disabled
          fullWidth
          helperText="Contract being deprecated"
        />

        <TextField
          label="Deprecation Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why is this contract being deprecated?"
          multiline
          rows={3}
          required
          fullWidth
        />

        <TextField
          label="Deprecated Since"
          value={since}
          onChange={(e) => setSince(e.target.value)}
          placeholder="v2.0.0"
          helperText="Version when deprecation started (optional)"
          fullWidth
        />

        <TextField
          label="Alternative"
          value={alternative}
          onChange={(e) => setAlternative(e.target.value)}
          placeholder="Query.usersV2"
          helperText="Suggested alternative operation (optional)"
          fullWidth
        />

        <TextField
          label="Planned Removal"
          value={removal}
          onChange={(e) => setRemoval(e.target.value)}
          placeholder="v3.0.0"
          helperText="Version when contract will be removed (optional)"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="warning" disabled={submitting || !reason.trim()}>
          {submitting ? 'Deprecating...' : 'Deprecate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
