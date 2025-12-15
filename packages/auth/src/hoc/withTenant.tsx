'use client';

import { useRouter } from 'next/navigation';
import type { ComponentType } from 'react';
import { useEffect } from 'react';

import { useAuth } from '../react';

export interface WithTenantOptions {
  /** Redirect destination if no tenant (default: /tenant/request) */
  redirectTo?: string;
  /** Loading component while checking tenant */
  loading?: React.ReactNode;
  /** Custom fallback (overrides redirect) */
  fallback?: React.ReactNode;
}

/**
 * withTenant - HOC that requires tenant membership
 *
 * Note: Assumes user is already authenticated (use with withAuth)
 *
 * @example
 * // Simple usage
 * export default withAuth(withTenant(MyPage));
 *
 * @example
 * // With options
 * export default withTenant({
 *   redirectTo: '/tenant/request',
 *   loading: <Spinner />
 * })(MyPage);
 */
// Overload 1: withTenant(Component)
export function withTenant<P extends object>(component: ComponentType<P>): ComponentType<P>;
// Overload 2: withTenant(options)(Component)
export function withTenant<P extends object>(
  options: WithTenantOptions
): (component: ComponentType<P>) => ComponentType<P>;
// Implementation
export function withTenant<P extends object>(optionsOrComponent?: WithTenantOptions | ComponentType<P>): any {
  // Called as: withTenant(Component)
  if (typeof optionsOrComponent === 'function') {
    const Component = optionsOrComponent;
    return withTenant<P>({})(Component);
  }

  // Called as: withTenant(options)(Component)
  const options = optionsOrComponent || {};
  const { redirectTo = '/tenant/request', loading = null, fallback } = options;

  return function WithTenantWrapper(Component: ComponentType<P>): ComponentType<P> {
    const WrappedComponent = (props: P) => {
      const { tenant, isLoading } = useAuth();
      const router = useRouter();

      useEffect(() => {
        if (!isLoading && !tenant) {
          router.push(redirectTo);
        }
      }, [tenant, isLoading, router]);

      // Still loading
      if (isLoading) {
        return <>{loading}</>;
      }

      // No tenant
      if (!tenant) {
        return fallback ? <>{fallback}</> : null;
      }

      // Has tenant - render component
      return <Component {...props} />;
    };

    WrappedComponent.displayName = `withTenant(${Component.displayName || Component.name || 'Component'})`;
    return WrappedComponent;
  };
}
