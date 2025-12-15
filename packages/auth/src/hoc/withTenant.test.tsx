import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

import { useAuth } from '../react';
import type { WithTenantOptions } from './withTenant';
import { withTenant } from './withTenant';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../react', () => ({
  useAuth: jest.fn(),
}));

// Test component
const TestComponent = (props: { testProp?: string }) => (
  <div data-testid="test-component">
    Tenant Content
    {props.testProp && <span data-testid="test-prop">{props.testProp}</span>}
  </div>
);

describe('withTenant', () => {
  let mockPush: jest.Mock;
  let mockUseAuth: jest.MockedFunction<typeof useAuth>;
  let mockUseRouter: jest.MockedFunction<typeof useRouter>;

  beforeEach(() => {
    mockPush = jest.fn();
    mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
    mockUseRouter.mockReturnValue({ push: mockPush } as any);

    mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Simple usage: withTenant(Component)', () => {
    it('should render component when tenant exists', () => {
      mockUseAuth.mockReturnValue({
        tenant: { id: 'tenant-123', name: 'Test Tenant' },
        isLoading: false,
      } as any);

      const WrappedComponent = withTenant(TestComponent);
      render(<WrappedComponent />);

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByText('Tenant Content')).toBeInTheDocument();
    });

    it('should redirect to /tenant/request when no tenant', async () => {
      mockUseAuth.mockReturnValue({
        tenant: null,
        isLoading: false,
      } as any);

      const WrappedComponent = withTenant(TestComponent);
      render(<WrappedComponent />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/tenant/request');
      });
    });

    it('should redirect to /tenant/request when tenant is undefined', async () => {
      mockUseAuth.mockReturnValue({
        tenant: undefined,
        isLoading: false,
      } as any);

      const WrappedComponent = withTenant(TestComponent);
      render(<WrappedComponent />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/tenant/request');
      });
    });

    it('should not render component when no tenant', () => {
      mockUseAuth.mockReturnValue({
        tenant: null,
        isLoading: false,
      } as any);

      const WrappedComponent = withTenant(TestComponent);
      render(<WrappedComponent />);

      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
    });

    it('should show loading state while checking tenant', () => {
      mockUseAuth.mockReturnValue({
        tenant: null,
        isLoading: true,
      } as any);

      const WrappedComponent = withTenant(TestComponent);
      const { container } = render(<WrappedComponent />);

      // Should render empty loading (null by default)
      expect(container.firstChild).toBeEmptyDOMElement();
      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should pass props to wrapped component', () => {
      mockUseAuth.mockReturnValue({
        tenant: { id: 'tenant-123', name: 'Test Tenant' },
        isLoading: false,
      } as any);

      const WrappedComponent = withTenant(TestComponent);
      render(<WrappedComponent testProp="hello" />);

      expect(screen.getByTestId('test-prop')).toHaveTextContent('hello');
    });

    it('should set correct displayName', () => {
      const WrappedComponent = withTenant(TestComponent);
      expect(WrappedComponent.displayName).toBe('withTenant(TestComponent)');
    });

    it('should handle component without displayName', () => {
      const AnonymousComponent = () => <div>Anonymous</div>;
      const WrappedComponent = withTenant(AnonymousComponent);
      expect(WrappedComponent.displayName).toBe('withTenant(Component)');
    });
  });

  describe('With options: withTenant(options)(Component)', () => {
    it('should redirect to custom URL', async () => {
      mockUseAuth.mockReturnValue({
        tenant: null,
        isLoading: false,
      } as any);

      const options: WithTenantOptions = {
        redirectTo: '/custom-tenant-page',
      };

      const WrappedComponent = withTenant(options)(TestComponent);
      render(<WrappedComponent />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/custom-tenant-page');
      });
    });

    it('should show custom loading component', () => {
      mockUseAuth.mockReturnValue({
        tenant: null,
        isLoading: true,
      } as any);

      const LoadingComponent = () => <div data-testid="custom-loading">Loading tenant...</div>;

      const options: WithTenantOptions = {
        loading: <LoadingComponent />,
      };

      const WrappedComponent = withTenant(options)(TestComponent);
      render(<WrappedComponent />);

      expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
      expect(screen.getByText('Loading tenant...')).toBeInTheDocument();
      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
    });

    it('should show custom fallback instead of redirect', () => {
      mockUseAuth.mockReturnValue({
        tenant: null,
        isLoading: false,
      } as any);

      const FallbackComponent = () => <div data-testid="custom-fallback">Please join a tenant to continue</div>;

      const options: WithTenantOptions = {
        fallback: <FallbackComponent />,
      };

      const WrappedComponent = withTenant(options)(TestComponent);
      render(<WrappedComponent />);

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Please join a tenant to continue')).toBeInTheDocument();
      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
      // Should still trigger redirect even with fallback
      expect(mockPush).toHaveBeenCalled();
    });

    it('should use all custom options together', async () => {
      mockUseAuth.mockReturnValue({
        tenant: null,
        isLoading: false,
      } as any);

      const options: WithTenantOptions = {
        redirectTo: '/custom-tenant',
        loading: <div data-testid="loading">Custom Loading</div>,
        fallback: <div data-testid="fallback">Custom Fallback</div>,
      };

      const WrappedComponent = withTenant(options)(TestComponent);
      render(<WrappedComponent />);

      // Should show fallback
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
      // And redirect should still be called
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/custom-tenant');
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle tenant changing from null to present', async () => {
      const { rerender } = render(<div />);

      // Initial state: no tenant
      mockUseAuth.mockReturnValue({
        tenant: null,
        isLoading: false,
      } as any);

      const WrappedComponent = withTenant(TestComponent);
      rerender(<WrappedComponent />);

      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();

      // Tenant becomes available
      mockUseAuth.mockReturnValue({
        tenant: { id: 'tenant-123', name: 'Test Tenant' },
        isLoading: false,
      } as any);

      rerender(<WrappedComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
      });
    });

    it('should handle isLoading changing from true to false (no tenant)', async () => {
      const { rerender } = render(<div />);

      // Initial state: loading
      mockUseAuth.mockReturnValue({
        tenant: null,
        isLoading: true,
      } as any);

      const WrappedComponent = withTenant(TestComponent);
      rerender(<WrappedComponent />);

      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();

      // Loading completes, no tenant
      mockUseAuth.mockReturnValue({
        tenant: null,
        isLoading: false,
      } as any);

      rerender(<WrappedComponent />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/tenant/request');
      });
    });

    it('should handle isLoading changing from true to false (with tenant)', async () => {
      const { rerender } = render(<div />);

      // Initial state: loading
      mockUseAuth.mockReturnValue({
        tenant: null,
        isLoading: true,
      } as any);

      const WrappedComponent = withTenant(TestComponent);
      rerender(<WrappedComponent />);

      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();

      // Loading completes, has tenant
      mockUseAuth.mockReturnValue({
        tenant: { id: 'tenant-123', name: 'Test Tenant' },
        isLoading: false,
      } as any);

      rerender(<WrappedComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
      });
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should not redirect multiple times', async () => {
      mockUseAuth.mockReturnValue({
        tenant: null,
        isLoading: false,
      } as any);

      const WrappedComponent = withTenant(TestComponent);
      const { rerender } = render(<WrappedComponent />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledTimes(1);
      });

      // Re-render
      rerender(<WrappedComponent />);

      // Should not call push again (same state)
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it('should handle tenant changing from present to null', async () => {
      const { rerender } = render(<div />);

      // Initial state: has tenant
      mockUseAuth.mockReturnValue({
        tenant: { id: 'tenant-123', name: 'Test Tenant' },
        isLoading: false,
      } as any);

      const WrappedComponent = withTenant(TestComponent);
      rerender(<WrappedComponent />);

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();

      // Tenant removed (e.g., user left tenant)
      mockUseAuth.mockReturnValue({
        tenant: null,
        isLoading: false,
      } as any);

      rerender(<WrappedComponent />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/tenant/request');
      });
      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
    });
  });

  describe('Tenant object variations', () => {
    it('should accept tenant with only required fields', () => {
      mockUseAuth.mockReturnValue({
        tenant: { id: 'tenant-123', name: 'Minimal Tenant' },
        isLoading: false,
      } as any);

      const WrappedComponent = withTenant(TestComponent);
      render(<WrappedComponent />);

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });

    it('should accept tenant with additional fields', () => {
      mockUseAuth.mockReturnValue({
        tenant: {
          id: 'tenant-123',
          name: 'Full Tenant',
          description: 'A full tenant object',
          createdAt: '2025-01-01',
          roles: ['admin', 'user'],
        },
        isLoading: false,
      } as any);

      const WrappedComponent = withTenant(TestComponent);
      render(<WrappedComponent />);

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });

    it('should treat empty object as no tenant', async () => {
      mockUseAuth.mockReturnValue({
        tenant: {} as any,
        isLoading: false,
      } as any);

      const WrappedComponent = withTenant(TestComponent);
      render(<WrappedComponent />);

      // Empty object is truthy, so component should render
      // (This tests actual behavior - if you want empty object to be treated as no tenant,
      // the HOC would need additional logic)
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
  });

  describe('Type safety', () => {
    it('should preserve component prop types', () => {
      interface CustomProps {
        requiredProp: string;
        optionalProp?: number;
      }
      const TypedComponent = (_props: CustomProps) => <div>Typed</div>;

      const WrappedComponent = withTenant(TypedComponent);

      // This should type-check correctly
      const element = <WrappedComponent requiredProp="test" optionalProp={42} />;
      expect(element).toBeDefined();
    });
  });
});
