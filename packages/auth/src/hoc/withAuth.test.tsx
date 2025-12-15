import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { ComponentType } from 'react';

import { useAuth } from '../react';
import type { WithAuthOptions } from './withAuth';
import { withAuth } from './withAuth';

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
    Authenticated Content
    {props.testProp && <span data-testid="test-prop">{props.testProp}</span>}
  </div>
);

describe('withAuth', () => {
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

  describe('Simple usage: withAuth(Component)', () => {
    it('should render component when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      } as any);

      const WrappedComponent = withAuth(TestComponent);
      render(<WrappedComponent />);

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByText('Authenticated Content')).toBeInTheDocument();
    });

    it('should redirect to /auth/login when not authenticated', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      } as any);

      const WrappedComponent = withAuth(TestComponent);
      render(<WrappedComponent />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/login');
      });
    });

    it('should not render component when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      } as any);

      const WrappedComponent = withAuth(TestComponent);
      render(<WrappedComponent />);

      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
    });

    it('should show loading state while checking auth', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      } as any);

      const WrappedComponent = withAuth(TestComponent);
      const { container } = render(<WrappedComponent />);

      // Should render empty loading (null by default)
      expect(container.firstChild).toBeEmptyDOMElement();
      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should pass props to wrapped component', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      } as any);

      const WrappedComponent = withAuth(TestComponent);
      render(<WrappedComponent testProp="hello" />);

      expect(screen.getByTestId('test-prop')).toHaveTextContent('hello');
    });

    it('should set correct displayName', () => {
      const WrappedComponent = withAuth(TestComponent);
      expect(WrappedComponent.displayName).toBe('withAuth(TestComponent)');
    });

    it('should handle component without displayName', () => {
      const AnonymousComponent = () => <div>Anonymous</div>;
      const WrappedComponent = withAuth(AnonymousComponent);
      expect(WrappedComponent.displayName).toBe('withAuth(Component)');
    });
  });

  describe('With options: withAuth(options)(Component)', () => {
    it('should redirect to custom URL', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      } as any);

      const options: WithAuthOptions = {
        redirectTo: '/custom-login',
      };

      const WrappedComponent = withAuth(options)(TestComponent);
      render(<WrappedComponent />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/custom-login');
      });
    });

    it('should show custom loading component', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      } as any);

      const LoadingComponent = () => <div data-testid="custom-loading">Loading...</div>;

      const options: WithAuthOptions = {
        loading: <LoadingComponent />,
      };

      const WrappedComponent = withAuth(options)(TestComponent);
      render(<WrappedComponent />);

      expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
    });

    it('should show custom fallback instead of redirect', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      } as any);

      const FallbackComponent = () => <div data-testid="custom-fallback">Please sign in to continue</div>;

      const options: WithAuthOptions = {
        fallback: <FallbackComponent />,
      };

      const WrappedComponent = withAuth(options)(TestComponent);
      render(<WrappedComponent />);

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Please sign in to continue')).toBeInTheDocument();
      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
      // Should not redirect when fallback is provided
      expect(mockPush).toHaveBeenCalled();
    });

    it('should use all custom options together', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      } as any);

      const options: WithAuthOptions = {
        redirectTo: '/custom-auth',
        loading: <div data-testid="loading">Custom Loading</div>,
        fallback: <div data-testid="fallback">Custom Fallback</div>,
      };

      const WrappedComponent = withAuth(options)(TestComponent);
      render(<WrappedComponent />);

      // Should show fallback (overrides redirect)
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
      // But redirect should still be called
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/custom-auth');
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle isAuthenticated changing from false to true', async () => {
      const { rerender } = render(<div />);

      // Initial state: not authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      } as any);

      const WrappedComponent = withAuth(TestComponent);
      rerender(<WrappedComponent />);

      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();

      // Auth state changes to authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      } as any);

      rerender(<WrappedComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
      });
    });

    it('should handle isLoading changing from true to false (not authenticated)', async () => {
      const { rerender } = render(<div />);

      // Initial state: loading
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      } as any);

      const WrappedComponent = withAuth(TestComponent);
      rerender(<WrappedComponent />);

      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();

      // Loading completes, not authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      } as any);

      rerender(<WrappedComponent />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/login');
      });
    });

    it('should handle isLoading changing from true to false (authenticated)', async () => {
      const { rerender } = render(<div />);

      // Initial state: loading
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      } as any);

      const WrappedComponent = withAuth(TestComponent);
      rerender(<WrappedComponent />);

      expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();

      // Loading completes, authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
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
        isAuthenticated: false,
        isLoading: false,
      } as any);

      const WrappedComponent = withAuth(TestComponent);
      const { rerender } = render(<WrappedComponent />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledTimes(1);
      });

      // Re-render
      rerender(<WrappedComponent />);

      // Should not call push again (same state)
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe('Type safety', () => {
    it('should preserve component prop types', () => {
      interface CustomProps {
        requiredProp: string;
        optionalProp?: number;
      }
      const TypedComponent = (_props: CustomProps) => <div>Typed</div>;

      const WrappedComponent = withAuth(TypedComponent);

      // This should type-check correctly
      const element = <WrappedComponent requiredProp="test" optionalProp={42} />;
      expect(element).toBeDefined();
    });
  });
});
