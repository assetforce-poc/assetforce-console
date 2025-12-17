import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { TenantApplicationList, TenantCard, TenantMembershipList, TenantSearchForm } from '../src/components/tenant';
import type { Tenant, TenantApplication } from '../src/hooks/tenant/types';

const mockTenant: Tenant = {
  id: 'tenant-1',
  name: 'test-org',
  displayName: 'Test Organization',
};

const mockTenantNoDisplay: Tenant = {
  id: 'tenant-2',
  name: 'another-org',
  displayName: null,
};

const mockApplication: TenantApplication = {
  id: 'app-1',
  tenant: mockTenant,
  status: 'PENDING',
  message: 'Please approve my request',
  createdAt: '2025-12-16T10:00:00Z',
  updatedAt: '2025-12-16T10:00:00Z',
};

describe('TenantCard', () => {
  it('should render tenant with displayName', () => {
    render(<TenantCard tenant={mockTenant} />);

    expect(screen.getByText('Test Organization')).toBeInTheDocument();
    expect(screen.getByText('tenant-1')).toBeInTheDocument();
  });

  it('should fallback to name when displayName is null', () => {
    render(<TenantCard tenant={mockTenantNoDisplay} />);

    expect(screen.getByText('another-org')).toBeInTheDocument();
  });

  it('should render action button when actionLabel and onAction provided', () => {
    const handleAction = jest.fn();

    render(<TenantCard tenant={mockTenant} actionLabel="Leave" onAction={handleAction} />);

    const button = screen.getByRole('button', { name: /leave/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalledWith(mockTenant);
  });

  it('should not render action button without actionLabel', () => {
    render(<TenantCard tenant={mockTenant} onAction={() => {}} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should disable action button when actionDisabled is true', () => {
    render(<TenantCard tenant={mockTenant} actionLabel="Leave" onAction={() => {}} actionDisabled />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should render subtitle when provided', () => {
    render(<TenantCard tenant={mockTenant} subtitle={<span data-testid="subtitle">Custom subtitle</span>} />);

    expect(screen.getByTestId('subtitle')).toBeInTheDocument();
  });
});

describe('TenantMembershipList', () => {
  it('should render title', () => {
    render(<TenantMembershipList tenants={[]} />);

    expect(screen.getByText('My Organizations')).toBeInTheDocument();
  });

  it('should render custom title', () => {
    render(<TenantMembershipList tenants={[]} title="Custom Title" />);

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('should render empty message when no tenants', () => {
    render(<TenantMembershipList tenants={[]} />);

    expect(screen.getByText('No organizations yet.')).toBeInTheDocument();
  });

  it('should render tenant list', () => {
    render(<TenantMembershipList tenants={[mockTenant, mockTenantNoDisplay]} />);

    expect(screen.getByText('Test Organization')).toBeInTheDocument();
    expect(screen.getByText('another-org')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<TenantMembershipList tenants={[]} loading />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show error message', () => {
    render(<TenantMembershipList tenants={[]} error="Failed to load" />);

    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });

  it('should call onLeave when leave button clicked', () => {
    const handleLeave = jest.fn();

    render(<TenantMembershipList tenants={[mockTenant]} onLeave={handleLeave} />);

    fireEvent.click(screen.getByRole('button', { name: /leave/i }));
    expect(handleLeave).toHaveBeenCalledWith('tenant-1');
  });
});

describe('TenantApplicationList', () => {
  it('should render title', () => {
    render(<TenantApplicationList applications={[]} />);

    expect(screen.getByText('Pending Applications')).toBeInTheDocument();
  });

  it('should render empty message when no applications', () => {
    render(<TenantApplicationList applications={[]} />);

    expect(screen.getByText('No pending applications.')).toBeInTheDocument();
  });

  it('should render application with message', () => {
    render(<TenantApplicationList applications={[mockApplication]} />);

    expect(screen.getByText('Test Organization')).toBeInTheDocument();
    expect(screen.getByText(/please approve my request/i)).toBeInTheDocument();
  });

  it('should call onCancel when cancel button clicked', () => {
    const handleCancel = jest.fn();

    render(<TenantApplicationList applications={[mockApplication]} onCancel={handleCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(handleCancel).toHaveBeenCalledWith('app-1');
  });

  it('should use custom date formatter', () => {
    render(<TenantApplicationList applications={[mockApplication]} formatDate={(date) => `Formatted: ${date}`} />);

    expect(screen.getByText(/formatted: 2025-12-16/i)).toBeInTheDocument();
  });
});

describe('TenantSearchForm', () => {
  const defaultProps = {
    search: '',
    onSearchChange: jest.fn(),
    tenants: [] as Tenant[],
    onApply: jest.fn(),
  };

  it('should render title and search input', () => {
    render(<TenantSearchForm {...defaultProps} />);

    expect(screen.getByText('Join Other Organizations')).toBeInTheDocument();
    expect(screen.getByLabelText(/search organizations/i)).toBeInTheDocument();
  });

  it('should show empty search message when search is empty', () => {
    render(<TenantSearchForm {...defaultProps} />);

    expect(screen.getByText('Type a name to search.')).toBeInTheDocument();
  });

  it('should call onSearchChange when typing', () => {
    const handleChange = jest.fn();
    render(<TenantSearchForm {...defaultProps} onSearchChange={handleChange} />);

    fireEvent.change(screen.getByLabelText(/search organizations/i), {
      target: { value: 'test' },
    });

    expect(handleChange).toHaveBeenCalledWith('test');
  });

  it('should show loading state', () => {
    render(<TenantSearchForm {...defaultProps} search="test" loading />);

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('should show no results message', () => {
    render(<TenantSearchForm {...defaultProps} search="test" tenants={[]} />);

    expect(screen.getByText('No organizations found.')).toBeInTheDocument();
  });

  it('should render tenant list with apply buttons', () => {
    render(<TenantSearchForm {...defaultProps} search="test" tenants={[mockTenant]} />);

    expect(screen.getByText('Test Organization')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument();
  });

  it('should open dialog when apply button clicked', () => {
    render(<TenantSearchForm {...defaultProps} search="test" tenants={[mockTenant]} />);

    fireEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Apply to join')).toBeInTheDocument();
  });

  it('should call onApply with message when submitting', () => {
    const handleApply = jest.fn();
    render(<TenantSearchForm {...defaultProps} search="test" tenants={[mockTenant]} onApply={handleApply} />);

    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));

    // Type message
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Please approve' },
    });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(handleApply).toHaveBeenCalledWith('tenant-1', 'Please approve');
  });

  it('should close dialog when cancel clicked', async () => {
    render(<TenantSearchForm {...defaultProps} search="test" tenants={[mockTenant]} />);

    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Cancel
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should show load more button when hasMore is true', () => {
    const handleLoadMore = jest.fn();
    render(
      <TenantSearchForm {...defaultProps} search="test" tenants={[mockTenant]} hasMore onLoadMore={handleLoadMore} />
    );

    const loadMoreButton = screen.getByRole('button', { name: /load more/i });
    expect(loadMoreButton).toBeInTheDocument();

    fireEvent.click(loadMoreButton);
    expect(handleLoadMore).toHaveBeenCalled();
  });

  it('should disable apply when global cooldown is active', () => {
    render(
      <TenantSearchForm
        {...defaultProps}
        search="test"
        tenants={[mockTenant]}
        globalCooldown={{ canApply: false, reason: 'Daily limit reached' }}
      />
    );

    expect(screen.getByRole('button', { name: /apply/i })).toBeDisabled();
  });

  it('should disable apply for tenant with cooldown', () => {
    render(
      <TenantSearchForm
        {...defaultProps}
        search="test"
        tenants={[mockTenant]}
        cooldownByTenantId={{
          'tenant-1': { canApply: false, reason: 'Recently rejected' },
        }}
      />
    );

    expect(screen.getByRole('button', { name: /apply/i })).toBeDisabled();
    expect(screen.getByText(/recently rejected/i)).toBeInTheDocument();
  });
});
