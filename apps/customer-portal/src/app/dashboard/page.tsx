'use client';

import { withAuth, withTenant } from '@assetforce/auth';

function DashboardPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}

export default withAuth(withTenant(DashboardPage));
