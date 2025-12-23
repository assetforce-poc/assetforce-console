'use client';

import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@assetforce/material';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

import { useSendInvite } from '../../hooks';

interface InviteSendDialogProps {
  open: boolean;
  onClose: () => void;
  tenantId: string;
  tenantName: string;
  onSuccess?: () => void;
}

/**
 * Dialog to send a tenant invite.
 * Admin only.
 */
export const InviteSendDialog: FC<InviteSendDialogProps> = ({ open, onClose, tenantId, tenantName, onSuccess }) => {
  const { send, loading } = useSendInvite();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClose = useCallback(() => {
    if (!loading) {
      setEmail('');
      setRole('member');
      setMessage('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  }, [loading, onClose]);

  const handleSubmit = useCallback(async () => {
    setError(null);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    const result = await send({
      tenantId,
      email: email.trim(),
      role: role.trim() || undefined,
      message: message.trim() || undefined,
    });

    if (result.success) {
      setSuccess(true);
      onSuccess?.();
      setTimeout(() => {
        handleClose();
      }, 1500);
    } else {
      setError(result.error?.message || 'Failed to send invite');
    }
  }, [email, role, message, tenantId, send, onSuccess, handleClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Invite Member to {tenantName}</DialogTitle>
      <DialogContent>
        {success ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            Invitation sent successfully to {email}
          </Alert>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              sx={{ mt: 1 }}
            />
            <TextField
              margin="dense"
              label="Role"
              type="text"
              fullWidth
              variant="outlined"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              placeholder="member"
              sx={{ mt: 2 }}
            />
            <TextField
              margin="dense"
              label="Personal Message (optional)"
              type="text"
              fullWidth
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              multiline
              rows={3}
              sx={{ mt: 2 }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {success ? 'Close' : 'Cancel'}
        </Button>
        {!success && (
          <Button onClick={handleSubmit} variant="contained" disabled={loading || !email.trim()}>
            {loading ? <CircularProgress size={20} /> : 'Send Invite'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default InviteSendDialog;
