import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { withGuards } from './withGuards';

// Test component
const TestComponent = (props: { testId: string; message: string }) => (
  <div data-testid={props.testId}>{props.message}</div>
);

// Mock HOC guards for testing
const createMockGuard = (name: string, shouldRender: boolean = true) => {
  return <P extends object>(Component: ComponentType<P>): ComponentType<P> => {
    const MockGuard = (props: P) => {
      if (!shouldRender) {
        return <div data-testid={`${name}-blocked`}>Blocked by {name}</div>;
      }
      return (
        <div data-testid={`${name}-wrapper`}>
          <div data-testid={`${name}-label`}>{name}</div>
          <Component {...props} />
        </div>
      );
    };
    MockGuard.displayName = `${name}(${(Component as any).displayName || (Component as any).name || 'Component'})`;
    return MockGuard;
  };
};

describe('withGuards', () => {
  describe('Basic composition', () => {
    it('should compose zero guards (identity function)', () => {
      const WrappedComponent = withGuards([])(TestComponent);
      render(<WrappedComponent testId="test" message="No guards" />);

      expect(screen.getByTestId('test')).toBeInTheDocument();
      expect(screen.getByText('No guards')).toBeInTheDocument();
    });

    it('should compose single guard', () => {
      const Guard1 = createMockGuard('Guard1');
      const WrappedComponent = withGuards([Guard1])(TestComponent);

      render(<WrappedComponent testId="test" message="Single guard" />);

      expect(screen.getByTestId('Guard1-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('Guard1-label')).toHaveTextContent('Guard1');
      expect(screen.getByTestId('test')).toBeInTheDocument();
      expect(screen.getByText('Single guard')).toBeInTheDocument();
    });

    it('should compose two guards in correct order', () => {
      const Guard1 = createMockGuard('Guard1');
      const Guard2 = createMockGuard('Guard2');

      const WrappedComponent = withGuards([Guard1, Guard2])(TestComponent);

      render(<WrappedComponent testId="test" message="Two guards" />);

      // Guards should wrap in the order: Guard1(Guard2(Component))
      // So outer wrapper should be Guard1
      expect(screen.getByTestId('Guard1-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('Guard2-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('test')).toBeInTheDocument();

      // Verify nesting structure
      const guard1Wrapper = screen.getByTestId('Guard1-wrapper');
      const guard2Wrapper = screen.getByTestId('Guard2-wrapper');
      expect(guard1Wrapper).toContainElement(guard2Wrapper);
    });

    it('should compose three guards in correct order', () => {
      const Guard1 = createMockGuard('Guard1');
      const Guard2 = createMockGuard('Guard2');
      const Guard3 = createMockGuard('Guard3');

      const WrappedComponent = withGuards([Guard1, Guard2, Guard3])(TestComponent);

      render(<WrappedComponent testId="test" message="Three guards" />);

      // Guards should wrap in the order: Guard1(Guard2(Guard3(Component)))
      expect(screen.getByTestId('Guard1-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('Guard2-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('Guard3-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('test')).toBeInTheDocument();

      // Verify nesting structure: Guard1 > Guard2 > Guard3 > Component
      const guard1Wrapper = screen.getByTestId('Guard1-wrapper');
      const guard2Wrapper = screen.getByTestId('Guard2-wrapper');
      const guard3Wrapper = screen.getByTestId('Guard3-wrapper');

      expect(guard1Wrapper).toContainElement(guard2Wrapper);
      expect(guard2Wrapper).toContainElement(guard3Wrapper);
    });
  });

  describe('Guard blocking behavior', () => {
    it('should block rendering when first guard fails', () => {
      const Guard1 = createMockGuard('Guard1', false); // Blocks
      const Guard2 = createMockGuard('Guard2', true);

      const WrappedComponent = withGuards([Guard1, Guard2])(TestComponent);

      render(<WrappedComponent testId="test" message="Should not render" />);

      // Guard1 blocks, so we should see blocked message
      expect(screen.getByTestId('Guard1-blocked')).toBeInTheDocument();
      expect(screen.getByText('Blocked by Guard1')).toBeInTheDocument();

      // Component should not render
      expect(screen.queryByTestId('test')).not.toBeInTheDocument();
      expect(screen.queryByText('Should not render')).not.toBeInTheDocument();

      // Guard2 should still wrap but won't be visible because Guard1 blocked
      expect(screen.queryByTestId('Guard2-wrapper')).not.toBeInTheDocument();
    });

    it('should block rendering when second guard fails', () => {
      const Guard1 = createMockGuard('Guard1', true);
      const Guard2 = createMockGuard('Guard2', false); // Blocks

      const WrappedComponent = withGuards([Guard1, Guard2])(TestComponent);

      render(<WrappedComponent testId="test" message="Should not render" />);

      // Guard1 wrapper should be present
      expect(screen.getByTestId('Guard1-wrapper')).toBeInTheDocument();

      // Guard2 blocks
      expect(screen.getByTestId('Guard2-blocked')).toBeInTheDocument();
      expect(screen.getByText('Blocked by Guard2')).toBeInTheDocument();

      // Component should not render
      expect(screen.queryByTestId('test')).not.toBeInTheDocument();
      expect(screen.queryByText('Should not render')).not.toBeInTheDocument();
    });

    it('should render when all guards pass', () => {
      const Guard1 = createMockGuard('Guard1', true);
      const Guard2 = createMockGuard('Guard2', true);
      const Guard3 = createMockGuard('Guard3', true);

      const WrappedComponent = withGuards([Guard1, Guard2, Guard3])(TestComponent);

      render(<WrappedComponent testId="test" message="All guards passed" />);

      // All guards present
      expect(screen.getByTestId('Guard1-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('Guard2-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('Guard3-wrapper')).toBeInTheDocument();

      // Component renders
      expect(screen.getByTestId('test')).toBeInTheDocument();
      expect(screen.getByText('All guards passed')).toBeInTheDocument();
    });
  });

  describe('Props passing', () => {
    it('should pass props through all guards to component', () => {
      const Guard1 = createMockGuard('Guard1');
      const Guard2 = createMockGuard('Guard2');

      const WrappedComponent = withGuards([Guard1, Guard2])(TestComponent);

      render(<WrappedComponent testId="custom-id" message="Custom message" />);

      expect(screen.getByTestId('custom-id')).toBeInTheDocument();
      expect(screen.getByText('Custom message')).toBeInTheDocument();
    });

    it('should preserve prop types through composition', () => {
      interface CustomProps {
        requiredProp: string;
        optionalProp?: number;
      }
      const TypedComponent = (props: CustomProps) => (
        <div>
          {props.requiredProp}-{props.optionalProp}
        </div>
      );

      const Guard1 = createMockGuard('Guard1');
      const WrappedComponent = withGuards([Guard1])(TypedComponent);

      // This should type-check correctly
      const element = <WrappedComponent requiredProp="test" optionalProp={42} />;
      expect(element).toBeDefined();
    });
  });

  describe('Equivalence with manual composition', () => {
    it('should be equivalent to manual HOC composition', () => {
      const Guard1 = createMockGuard('Guard1');
      const Guard2 = createMockGuard('Guard2');
      const Guard3 = createMockGuard('Guard3');

      // Using withGuards
      const ComposedWithGuards = withGuards([Guard1, Guard2, Guard3])(TestComponent);

      // Manual composition: Guard1(Guard2(Guard3(Component)))
      const ManuallyComposed = Guard1(Guard2(Guard3(TestComponent)));

      // Render both
      const { container: container1 } = render(<ComposedWithGuards testId="test1" message="withGuards" />);
      const { container: container2 } = render(<ManuallyComposed testId="test2" message="manual" />);

      // Both should have the same guard structure
      expect(container1.querySelector('[data-testid="Guard1-wrapper"]')).toBeInTheDocument();
      expect(container1.querySelector('[data-testid="Guard2-wrapper"]')).toBeInTheDocument();
      expect(container1.querySelector('[data-testid="Guard3-wrapper"]')).toBeInTheDocument();

      expect(container2.querySelector('[data-testid="Guard1-wrapper"]')).toBeInTheDocument();
      expect(container2.querySelector('[data-testid="Guard2-wrapper"]')).toBeInTheDocument();
      expect(container2.querySelector('[data-testid="Guard3-wrapper"]')).toBeInTheDocument();
    });
  });

  describe('Real-world usage patterns', () => {
    it('should work like withAuth(withTenant(Component))', () => {
      // Simulate real guards
      const mockWithAuth = <P extends object>(Component: ComponentType<P>) => {
        const WithAuth = (props: P) => (
          <div data-testid="auth-guard">
            <Component {...props} />
          </div>
        );
        return WithAuth;
      };

      const mockWithTenant = <P extends object>(Component: ComponentType<P>) => {
        const WithTenant = (props: P) => (
          <div data-testid="tenant-guard">
            <Component {...props} />
          </div>
        );
        return WithTenant;
      };

      // Using withGuards
      const Protected = withGuards([mockWithAuth, mockWithTenant])(TestComponent);

      render(<Protected testId="test" message="Protected content" />);

      // Both guards should be present
      expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
      expect(screen.getByTestId('tenant-guard')).toBeInTheDocument();
      expect(screen.getByTestId('test')).toBeInTheDocument();
      expect(screen.getByText('Protected content')).toBeInTheDocument();

      // Verify nesting: auth-guard > tenant-guard > component
      const authGuard = screen.getByTestId('auth-guard');
      const tenantGuard = screen.getByTestId('tenant-guard');
      expect(authGuard).toContainElement(tenantGuard);
    });

    it('should allow dynamic guard arrays', () => {
      const Guard1 = createMockGuard('Guard1');
      const Guard2 = createMockGuard('Guard2');

      const conditionalGuards = true;
      const guards = conditionalGuards ? [Guard1, Guard2] : [Guard1];

      const WrappedComponent = withGuards(guards)(TestComponent);

      render(<WrappedComponent testId="test" message="Dynamic guards" />);

      expect(screen.getByTestId('Guard1-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('Guard2-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle component with displayName', () => {
      const NamedComponent = () => <div>Named</div>;
      NamedComponent.displayName = 'MyNamedComponent';

      const Guard = createMockGuard('Guard');
      const WrappedComponent = withGuards([Guard])(NamedComponent);

      // The guard's displayName should reference the component's displayName
      expect(WrappedComponent.displayName).toBeDefined();
    });

    it('should handle component without displayName', () => {
      const AnonymousComponent = () => <div>Anonymous</div>;

      const Guard = createMockGuard('Guard');
      const WrappedComponent = withGuards([Guard])(AnonymousComponent);

      expect(WrappedComponent).toBeDefined();
    });

    it('should handle very deep guard nesting', () => {
      const guards = Array.from({ length: 10 }, (_, i) => createMockGuard(`Guard${i + 1}`));

      const WrappedComponent = withGuards(guards)(TestComponent);

      render(<WrappedComponent testId="test" message="Deep nesting" />);

      // All guards should be present
      guards.forEach((_, i) => {
        expect(screen.getByTestId(`Guard${i + 1}-wrapper`)).toBeInTheDocument();
      });

      expect(screen.getByTestId('test')).toBeInTheDocument();
      expect(screen.getByText('Deep nesting')).toBeInTheDocument();
    });

    it('should maintain correct order with many guards', () => {
      const Guard1 = createMockGuard('Guard1');
      const Guard2 = createMockGuard('Guard2');
      const Guard3 = createMockGuard('Guard3');
      const Guard4 = createMockGuard('Guard4');
      const Guard5 = createMockGuard('Guard5');

      const WrappedComponent = withGuards([Guard1, Guard2, Guard3, Guard4, Guard5])(TestComponent);

      render(<WrappedComponent testId="test" message="Many guards" />);

      // Verify nesting order: Guard1 > Guard2 > Guard3 > Guard4 > Guard5 > Component
      const guard1 = screen.getByTestId('Guard1-wrapper');
      const guard2 = screen.getByTestId('Guard2-wrapper');
      const guard3 = screen.getByTestId('Guard3-wrapper');
      const guard4 = screen.getByTestId('Guard4-wrapper');
      const guard5 = screen.getByTestId('Guard5-wrapper');

      expect(guard1).toContainElement(guard2);
      expect(guard2).toContainElement(guard3);
      expect(guard3).toContainElement(guard4);
      expect(guard4).toContainElement(guard5);
    });
  });

  describe('Type safety', () => {
    it('should correctly infer component prop types', () => {
      interface CustomProps {
        id: number;
        name: string;
        optional?: boolean;
      }
      const TypedComponent = (_props: CustomProps) => <div>Typed</div>;

      const Guard = createMockGuard('Guard');
      const WrappedComponent = withGuards([Guard])(TypedComponent);

      // Should type-check with correct props
      const element = <WrappedComponent id={1} name="test" optional={true} />;
      expect(element).toBeDefined();
    });

    it('should accept HOC array with correct types', () => {
      type HOC<P> = (Component: ComponentType<P>) => ComponentType<P>;

      const guard1: HOC<any> = createMockGuard('Guard1');
      const guard2: HOC<any> = createMockGuard('Guard2');

      const guards: HOC<any>[] = [guard1, guard2];

      const WrappedComponent = withGuards(guards)(TestComponent);
      expect(WrappedComponent).toBeDefined();
    });
  });
});
