'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@assetforce/material';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

import type { SubgraphRegisterInput } from '../types';

interface SubgraphRegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: SubgraphRegisterInput) => Promise<void>;
  loading?: boolean;
}

/**
 * Dialog for registering a new subgraph
 */
export const SubgraphRegisterDialog: FC<SubgraphRegisterDialogProps> = ({ open, onClose, onSubmit, loading }) => {
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [graphqlUrl, setGraphqlUrl] = useState('');
  const [priority, setPriority] = useState('100');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-z][a-z0-9-]*$/.test(name)) {
      newErrors.name = 'Name must start with lowercase letter, contain only lowercase letters, numbers, and hyphens';
    }

    if (!graphqlUrl.trim()) {
      newErrors.graphqlUrl = 'GraphQL URL is required';
    } else {
      try {
        new URL(graphqlUrl);
      } catch {
        newErrors.graphqlUrl = 'Must be a valid URL';
      }
    }

    const priorityNum = parseInt(priority, 10);
    if (isNaN(priorityNum) || priorityNum < 0) {
      newErrors.priority = 'Priority must be a non-negative number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, graphqlUrl, priority]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    await onSubmit({
      name: name.trim(),
      displayName: displayName.trim() || undefined,
      graphqlUrl: graphqlUrl.trim(),
      priority: parseInt(priority, 10),
    });

    // Reset form
    setName('');
    setDisplayName('');
    setGraphqlUrl('');
    setPriority('100');
    setErrors({});
  }, [name, displayName, graphqlUrl, priority, validate, onSubmit]);

  const handleClose = useCallback(() => {
    setName('');
    setDisplayName('');
    setGraphqlUrl('');
    setPriority('100');
    setErrors({});
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Register Subgraph</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name || 'Unique identifier (e.g., aac, imc, sgc)'}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            helperText="Human-readable name (optional)"
            fullWidth
          />
          <TextField
            label="GraphQL URL"
            value={graphqlUrl}
            onChange={(e) => setGraphqlUrl(e.target.value)}
            error={!!errors.graphqlUrl}
            helperText={errors.graphqlUrl || 'Full URL to the GraphQL endpoint'}
            required
            fullWidth
            placeholder="http://localhost:8081/graphql"
          />
          <TextField
            label="Priority"
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            error={!!errors.priority}
            helperText={errors.priority || 'Lower number = higher priority (default: 100)'}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
