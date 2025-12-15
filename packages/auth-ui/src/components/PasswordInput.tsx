'use client';

import { IconButton, InputAdornment, TextField, type TextFieldProps } from '@assetforce/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';

export interface PasswordInputProps extends Omit<TextFieldProps, 'type'> {
  /** Show visibility toggle button (default: true) */
  showToggle?: boolean;
}

/**
 * PasswordInput - Password input field with show/hide toggle
 *
 * Features:
 * - Show/hide password toggle button
 * - All TextField props supported
 * - Accessible (aria-label)
 *
 * @example
 * <PasswordInput
 *   label="Password"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   error={!!error}
 *   helperText={error}
 * />
 */
export function PasswordInput({ showToggle = true, InputProps, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      {...props}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        ...InputProps,
        endAdornment: showToggle ? (
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={handleToggleVisibility}
              edge="end"
              size="small"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}
