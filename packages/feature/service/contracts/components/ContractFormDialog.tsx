'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@assetforce/material';
import { useState } from 'react';

import { ContractType, type GraphQLContractUpsertInput } from '../types';

export interface ContractFormDialogProps {
  /** Whether dialog is open */
  open: boolean;

  /** Close handler */
  onClose: () => void;

  /** Service ID */
  serviceId: string;

  /** Submit handler */
  onSubmit: (input: GraphQLContractUpsertInput) => Promise<void>;
}

/**
 * ContractFormDialog - Form for creating/updating GraphQL contracts
 */
export function ContractFormDialog({ open, onClose, serviceId, onSubmit }: ContractFormDialogProps) {
  const [type, setType] = useState<ContractType>(ContractType.Provides);
  const [operation, setOperation] = useState('');
  const [schemaUrl, setSchemaUrl] = useState('');
  const [schemaVersion, setSchemaVersion] = useState('');
  const [version, setVersion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!operation.trim()) {
      alert('Operation is required');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        serviceId,
        type,
        operation: operation.trim(),
        schemaUrl: schemaUrl.trim() || undefined,
        schemaVersion: schemaVersion.trim() || undefined,
        version: version.trim() || undefined,
      });

      // Reset form
      setType(ContractType.Provides);
      setOperation('');
      setSchemaUrl('');
      setSchemaVersion('');
      setVersion('');
    } catch (error) {
      console.error('Failed to create contract:', error);
      alert('Failed to create contract');
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
      <DialogTitle>Add GraphQL Contract</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <FormControl fullWidth required>
          <InputLabel>Contract Type</InputLabel>
          <Select value={type} onChange={(e) => setType(e.target.value as ContractType)} label="Contract Type">
            <MenuItem value={ContractType.Provides}>PROVIDES</MenuItem>
            <MenuItem value={ContractType.Consumes}>CONSUMES</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="GraphQL Operation"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          placeholder="Query.users, Mutation.createUser"
          helperText="Format: Query.fieldName or Mutation.fieldName"
          required
          fullWidth
        />

        <TextField
          label="Schema URL"
          value={schemaUrl}
          onChange={(e) => setSchemaUrl(e.target.value)}
          placeholder="https://github.com/org/repo/schema.graphql"
          helperText="Git path to schema file (optional)"
          fullWidth
        />

        <TextField
          label="Schema Version"
          value={schemaVersion}
          onChange={(e) => setSchemaVersion(e.target.value)}
          placeholder="1.0.0"
          helperText="Semantic version (optional)"
          fullWidth
        />

        <TextField
          label="API Version"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          placeholder="v1"
          helperText="API version identifier (optional)"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting || !operation.trim()}>
          {submitting ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
