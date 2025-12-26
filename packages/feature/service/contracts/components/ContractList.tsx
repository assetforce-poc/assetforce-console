'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@assetforce/material';
import { Icons } from '@assetforce/material';
import { useState } from 'react';

import type { ContractType, Protocol, ServiceContract } from '../types';
import { ContractFormDialog } from './ContractFormDialog';
import { DeprecateDialog } from './DeprecateDialog';

const PROTOCOL_COLORS: Record<Protocol, 'primary' | 'secondary' | 'info' | 'default'> = {
  GRAPHQL: 'primary',
  REST: 'secondary',
  GRPC: 'info',
  EVENT: 'default',
};

const TYPE_COLORS: Record<ContractType, 'success' | 'warning'> = {
  PROVIDES: 'success',
  CONSUMES: 'warning',
};

export interface ContractListProps {
  /** List of contracts to display */
  contracts: ServiceContract[];

  /** Loading state */
  loading?: boolean;

  /** Service ID for creating new contracts */
  serviceId: string;

  /** Callback when contract is created/updated */
  onUpsert: (input: any) => Promise<any>;

  /** Callback when contract is deprecated */
  onDeprecate: (input: any) => Promise<any>;

  /** Callback when contract is deleted */
  onDelete: (id: string) => Promise<any>;

  /** Filter by contract type */
  filterType?: ContractType;

  /** Filter by protocol */
  filterProtocol?: Protocol;
}

/**
 * ContractList - Display and manage service contracts
 */
export function ContractList({
  contracts,
  loading,
  serviceId,
  onUpsert,
  onDeprecate,
  onDelete,
  filterType,
  filterProtocol,
}: ContractListProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [deprecateDialogOpen, setDeprecateDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ServiceContract | null>(null);

  const handleDeprecate = (contract: ServiceContract) => {
    setSelectedContract(contract);
    setDeprecateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contract?')) {
      await onDelete(id);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Contracts</Typography>
            <Button variant="contained" startIcon={<Icons.Add />} onClick={() => setFormOpen(true)} disabled={loading}>
              Add Contract
            </Button>
          </Box>

          {contracts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No contracts registered
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Protocol</TableCell>
                    <TableCell>Operation/Path</TableCell>
                    <TableCell>Version</TableCell>
                    <TableCell>Schema</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <Chip label={contract.type} size="small" color={TYPE_COLORS[contract.type]} />
                      </TableCell>
                      <TableCell>
                        <Chip label={contract.protocol} size="small" color={PROTOCOL_COLORS[contract.protocol]} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {contract.graphql?.operation || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{contract.version || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        {contract.graphql?.schema ? (
                          <Tooltip title={`Hash: ${contract.graphql.schema.hash || 'N/A'}`}>
                            <Typography variant="body2" sx={{ cursor: 'help' }}>
                              v{contract.graphql.schema.version || '?'}
                            </Typography>
                          </Tooltip>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {contract.deprecated ? (
                          <Tooltip
                            title={
                              <Box sx={{ p: 0.5 }}>
                                <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                  Deprecated
                                </Typography>
                                {contract.deprecation?.reason && (
                                  <Typography variant="caption" component="div" sx={{ mb: 0.5 }}>
                                    Reason: {contract.deprecation.reason}
                                  </Typography>
                                )}
                                {contract.deprecation?.alternative && (
                                  <Typography variant="caption" component="div" sx={{ mb: 0.5 }}>
                                    Alternative: {contract.deprecation.alternative}
                                  </Typography>
                                )}
                                {contract.deprecation?.removal && (
                                  <Typography variant="caption" component="div" sx={{ color: 'error.light' }}>
                                    Removal: {new Date(contract.deprecation.removal).toLocaleDateString()}
                                  </Typography>
                                )}
                              </Box>
                            }
                          >
                            <Chip label="DEPRECATED" size="small" color="error" icon={<Icons.Warning />} />
                          </Tooltip>
                        ) : (
                          <Chip label="ACTIVE" size="small" color="success" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          {!contract.deprecated && (
                            <Tooltip title="Deprecate">
                              <IconButton size="small" onClick={() => handleDeprecate(contract)}>
                                <Icons.Warning fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => handleDelete(contract.id)}>
                              <Icons.Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Contract Form Dialog */}
      <ContractFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        serviceId={serviceId}
        onSubmit={async (input) => {
          await onUpsert(input);
          setFormOpen(false);
        }}
      />

      {/* Deprecate Dialog */}
      {selectedContract && (
        <DeprecateDialog
          open={deprecateDialogOpen}
          onClose={() => {
            setDeprecateDialogOpen(false);
            setSelectedContract(null);
          }}
          contract={selectedContract}
          onSubmit={async (input) => {
            await onDeprecate(input);
            setDeprecateDialogOpen(false);
            setSelectedContract(null);
          }}
        />
      )}
    </>
  );
}
