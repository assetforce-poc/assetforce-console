'use client';

import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@assetforce/material';

import type { AccountAttribute } from '../types';

export interface AccountAttributesCardProps {
  attributes: AccountAttribute[];
}

/**
 * AccountAttributesCard - Display account attributes as key-value table
 *
 * Shows all Keycloak user attributes with sensitive values masked.
 *
 * @example
 * ```tsx
 * <AccountAttributesCard attributes={account.attributes} />
 * ```
 */
export function AccountAttributesCard({ attributes }: AccountAttributesCardProps) {
  if (attributes.length === 0) {
    return (
      <Card data-testid="account-attributes-card">
        <CardHeader title="Account Attributes" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No attributes found for this account.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="account-attributes-card">
      <CardHeader
        title="Account Attributes"
        subheader={`${attributes.length} attribute${attributes.length === 1 ? '' : 's'}`}
      />
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Key</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 120 }}>Sensitivity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attributes.map((attr) => (
                <TableRow key={attr.key} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                      {attr.key}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: attr.isSensitive ? 'monospace' : 'inherit',
                        color: attr.isSensitive ? 'text.secondary' : 'text.primary',
                      }}
                    >
                      {attr.value}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {attr.isSensitive ? (
                      <Chip label="Sensitive" color="warning" size="small" sx={{ height: 24 }} />
                    ) : (
                      <Chip label="Public" color="default" size="small" sx={{ height: 24 }} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
