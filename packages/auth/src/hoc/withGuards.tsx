'use client';

import type { ComponentType } from 'react';

type HOC<P = any> = (Component: ComponentType<P>) => ComponentType<P>;

/**
 * withGuards - Compose multiple HOC guards
 *
 * @example
 * // Compose multiple guards
 * export default withGuards([withAuth, withTenant])(MyPage);
 *
 * // Equivalent to:
 * export default withAuth(withTenant(MyPage));
 */
export function withGuards<P extends object>(guards: HOC<P>[]): (Component: ComponentType<P>) => ComponentType<P> {
  return (Component: ComponentType<P>) => {
    return guards.reduceRight((WrappedComponent, guard) => {
      return guard(WrappedComponent);
    }, Component);
  };
}
