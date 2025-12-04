'use client';

import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import type { Realm } from '../../types';

export interface TenantSelectorProps {
  /** Available realms/tenants to select from */
  realms: Realm[];
  /** Currently selected realm */
  selectedRealm?: Realm;
  /** Loading state */
  loading?: boolean;
  /** Callback when a realm is selected */
  onSelect: (realm: Realm) => void;
  /** Error message */
  error?: string;
}

const realmTypeLabels: Record<
  string,
  { label: string; color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' }
> = {
  PRODUCTION: { label: 'Production', color: 'success' },
  TRIAL: { label: 'Trial', color: 'warning' },
  DEMO: { label: 'Demo', color: 'secondary' },
  SANDBOX: { label: 'Sandbox', color: 'default' },
};

const defaultTypeInfo = { label: 'Unknown', color: 'default' as const };

export const TenantSelector = ({ realms, selectedRealm, loading = false, onSelect, error }: TenantSelectorProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Tenant
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        You have access to multiple tenants. Please select one to continue.
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper variant="outlined">
        <List disablePadding>
          {realms.map((realm, index) => {
            const isSelected = selectedRealm?.realmId === realm.realmId;
            const isHovered = hoveredId === realm.realmId;
            const typeInfo = realmTypeLabels[realm.realmType] ?? defaultTypeInfo;

            return (
              <ListItem key={realm.realmId} disablePadding divider={index < realms.length - 1}>
                <ListItemButton
                  selected={isSelected}
                  disabled={loading}
                  onClick={() => onSelect(realm)}
                  onMouseEnter={() => setHoveredId(realm.realmId)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <ListItemIcon>
                    {isSelected && loading ? (
                      <CircularProgress size={24} />
                    ) : isSelected ? (
                      <CheckCircleIcon color="primary" />
                    ) : (
                      <BusinessIcon color={isHovered ? 'primary' : 'action'} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {realm.displayName || realm.realmName}
                        <Chip
                          label={typeInfo.label}
                          color={typeInfo.color}
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                    secondary={realm.description || `Zone: ${realm.zoneId}`}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
};
