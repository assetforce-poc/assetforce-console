'use client';

import React, { useState } from 'react';

interface ActivationFormProps {
  email?: string;
  loading: boolean;
  error?: string;
  onSubmit: (password: string, confirmPassword: string) => Promise<void>;
}

export const ActivationForm: React.FC<ActivationFormProps> = ({ email, loading, error, onSubmit }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    await onSubmit(password, confirmPassword);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Activate Your Account</h2>
      {email && (
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Setting password for: <strong>{email}</strong>
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '8px', width: '100%' }}
            disabled={loading}
            required
            minLength={8}
          />
          <small style={{ color: '#666' }}>Minimum 8 characters</small>
        </div>

        <div>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ padding: '8px', width: '100%' }}
            disabled={loading}
            required
            minLength={8}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {loading ? 'Activating Account...' : 'Activate Account'}
        </button>
      </form>

      {(error || localError) && <p style={{ color: 'red', marginTop: '10px' }}>{error || localError}</p>}
    </div>
  );
};
