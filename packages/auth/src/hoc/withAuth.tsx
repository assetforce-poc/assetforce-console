'use client';

import { useRouter } from 'next/navigation';
import type { ComponentType } from 'react';
import { useEffect } from 'react';

import { useAuth } from '../react';

export interface WithAuthOptions {
  /** Redirect destination if not authenticated (default: /auth/login) */
  redirectTo?: string;
  /** Loading component while checking auth */
  loading?: React.ReactNode;
  /** Custom fallback (overrides redirect) */
  fallback?: React.ReactNode;
}

/**
 * withAuth - HOC that requires authentication
 *
 * @example
 * // Simple usage
 * export default withAuth(MyPage);
 *
 * @example
 * // With options
 * export default withAuth({
 *   redirectTo: '/auth/login',
 *   loading: <Spinner />
 * })(MyPage);
 */
// Overload 1: withAuth(Component)
export function withAuth<P extends object>(component: ComponentType<P>): ComponentType<P>;
// Overload 2: withAuth(options)(Component)
export function withAuth<P extends object>(options: WithAuthOptions): (component: ComponentType<P>) => ComponentType<P>;
// Implementation
export function withAuth<P extends object>(optionsOrComponent?: WithAuthOptions | ComponentType<P>): any {
  // Called as: withAuth(Component)
  if (typeof optionsOrComponent === 'function') {
    const Component = optionsOrComponent;
    return withAuth<P>({})(Component);
  }

  // Called as: withAuth(options)(Component)
  const options = optionsOrComponent || {};
  const { redirectTo = '/auth/login', loading = null, fallback } = options;

  return function WithAuthWrapper(Component: ComponentType<P>): ComponentType<P> {
    const WrappedComponent = (props: P) => {
      const { isAuthenticated, isLoading } = useAuth();
      const router = useRouter();

      useEffect(() => {
        if (!isLoading && !isAuthenticated) {
          router.push(redirectTo);
        }
      }, [isAuthenticated, isLoading, router]);

      // Still loading
      if (isLoading) {
        return <>{loading}</>;
      }

      // Not authenticated
      if (!isAuthenticated) {
        return fallback ? <>{fallback}</> : null;
      }

      // Authenticated - render component
      return <Component {...props} />;
    };

    WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;
    return WrappedComponent;
  };
}
