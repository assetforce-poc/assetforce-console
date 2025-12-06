import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { z } from 'zod';
import { Form } from './Form';
import { Field } from './Field';
import { FieldArray } from './FieldArray';
import { useFormContext } from './useFormContext';
import { useWatch } from './useWatch';
import { useCrossFieldValidation, matchField } from './useCrossFieldValidation';
import type { FieldProps } from './types';

// Simple text input component for testing
const TextInput = ({ field, fieldState }: FieldProps) => (
  <div>
    <input
      data-testid={`input-${field.name}`}
      name={field.name}
      value={(field.value as string) ?? ''}
      onChange={(e) => field.onChange(e.target.value)}
      onBlur={field.onBlur}
    />
    {fieldState.error && (
      <span data-testid={`error-${field.name}`}>{fieldState.error.message}</span>
    )}
  </div>
);

// Component to test useFormContext
const FormValues = () => {
  const form = useFormContext();
  return (
    <div data-testid="form-values">{JSON.stringify(form.values.get())}</div>
  );
};

describe('Form', () => {
  it('should render children', () => {
    render(
      <Form>
        <div data-testid="child">Child content</div>
      </Form>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should render with default values', () => {
    render(
      <Form defaultValues={{ email: 'test@example.com' }}>
        <Field name="email" component={TextInput} />
      </Form>
    );

    const input = screen.getByTestId('input-email') as HTMLInputElement;
    expect(input.value).toBe('test@example.com');
  });

  it('should call onSubmit with form values', async () => {
    const handleSubmit = jest.fn();

    render(
      <Form defaultValues={{ email: '' }} onSubmit={handleSubmit}>
        <Field name="email" component={TextInput} />
        <button type="submit">Submit</button>
      </Form>
    );

    const input = screen.getByTestId('input-email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
      expect(handleSubmit.mock.calls[0][0]).toEqual({ email: 'test@example.com' });
    });
  });

  it('should validate with zod schema', async () => {
    const schema = z.object({
      email: z.string().email('Invalid email'),
    });

    render(
      <Form schema={schema} defaultValues={{ email: '' }}>
        <Field name="email" component={TextInput} />
        <button type="submit">Submit</button>
      </Form>
    );

    const input = screen.getByTestId('input-email');
    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByTestId('error-email')).toHaveTextContent('Invalid email');
    });
  });

  it('should provide form context to children', () => {
    render(
      <Form defaultValues={{ name: 'John' }}>
        <FormValues />
      </Form>
    );

    expect(screen.getByTestId('form-values')).toHaveTextContent('{"name":"John"}');
  });
});

describe('Field', () => {
  it('should update value on change', async () => {
    render(
      <Form defaultValues={{ name: '' }}>
        <Field name="name" component={TextInput} />
      </Form>
    );

    const input = screen.getByTestId('input-name');
    fireEvent.change(input, { target: { value: 'Jane' } });

    await waitFor(() => {
      expect((input as HTMLInputElement).value).toBe('Jane');
    });
  });

  it('should accept validation rules', () => {
    // Field accepts rules prop - actual validation is covered by zod schema test
    render(
      <Form defaultValues={{ name: '' }}>
        <Field
          name="name"
          component={TextInput}
          rules={{ required: 'Name is required' }}
        />
      </Form>
    );

    expect(screen.getByTestId('input-name')).toBeInTheDocument();
  });
});

describe('useFormContext', () => {
  it('should throw error when used outside Form', () => {
    const ErrorComponent = () => {
      useFormContext();
      return null;
    };

    expect(() => render(<ErrorComponent />)).toThrow(
      'useFormContext must be used within a Form component'
    );
  });

  it('should provide values API', async () => {
    const ValuesSetter = () => {
      const form = useFormContext();
      return (
        <button onClick={() => form.values.set('name', 'Updated')}>
          Update
        </button>
      );
    };

    render(
      <Form defaultValues={{ name: 'Initial' }}>
        <Field name="name" component={TextInput} />
        <ValuesSetter />
      </Form>
    );

    expect((screen.getByTestId('input-name') as HTMLInputElement).value).toBe('Initial');

    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect((screen.getByTestId('input-name') as HTMLInputElement).value).toBe('Updated');
    });
  });

  it('should provide errors API', async () => {
    const ErrorSetter = () => {
      const form = useFormContext();
      return (
        <>
          <button onClick={() => form.errors.set('name', 'Custom error')}>
            Set Error
          </button>
          <button onClick={() => form.errors.clear('name')}>
            Clear Error
          </button>
        </>
      );
    };

    render(
      <Form defaultValues={{ name: '' }}>
        <Field name="name" component={TextInput} />
        <ErrorSetter />
      </Form>
    );

    fireEvent.click(screen.getByText('Set Error'));

    await waitFor(() => {
      expect(screen.getByTestId('error-name')).toHaveTextContent('Custom error');
    });

    fireEvent.click(screen.getByText('Clear Error'));

    await waitFor(() => {
      expect(screen.queryByTestId('error-name')).not.toBeInTheDocument();
    });
  });
});

describe('useWatch', () => {
  it('should watch single field value', async () => {
    const WatchedValue = () => {
      const email = useWatch('email');
      return <div data-testid="watched-email">{email as string}</div>;
    };

    render(
      <Form defaultValues={{ email: 'initial@test.com' }}>
        <Field name="email" component={TextInput} />
        <WatchedValue />
      </Form>
    );

    expect(screen.getByTestId('watched-email')).toHaveTextContent('initial@test.com');

    fireEvent.change(screen.getByTestId('input-email'), {
      target: { value: 'updated@test.com' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('watched-email')).toHaveTextContent('updated@test.com');
    });
  });

  it('should watch all values via form.values.watch()', () => {
    const WatchAll = () => {
      const form = useFormContext();
      const values = form.values.watch();
      return <div data-testid="all-values">{JSON.stringify(values)}</div>;
    };

    render(
      <Form defaultValues={{ name: 'John', age: 30 }}>
        <WatchAll />
      </Form>
    );

    expect(screen.getByTestId('all-values')).toHaveTextContent('{"name":"John","age":30}');
  });
});

describe('FieldArray', () => {
  it('should render array fields', () => {
    render(
      <Form defaultValues={{ items: [{ name: 'Item 1' }, { name: 'Item 2' }] }}>
        <FieldArray name="items">
          {({ fields, getName }) => (
            <div>
              {fields.map((field, index) => (
                <div key={field.id} data-testid={`item-${index}`}>
                  <Field name={getName(index, 'name')} component={TextInput} />
                </div>
              ))}
            </div>
          )}
        </FieldArray>
      </Form>
    );

    expect(screen.getByTestId('item-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect((screen.getByTestId('input-items.0.name') as HTMLInputElement).value).toBe('Item 1');
    expect((screen.getByTestId('input-items.1.name') as HTMLInputElement).value).toBe('Item 2');
  });

  it('should append item to array', async () => {
    render(
      <Form defaultValues={{ items: [{ name: 'Item 1' }] }}>
        <FieldArray name="items">
          {({ fields, append, getName }) => (
            <div>
              {fields.map((field, index) => (
                <div key={field.id} data-testid={`item-${index}`}>
                  <Field name={getName(index, 'name')} component={TextInput} />
                </div>
              ))}
              <button onClick={() => append({ name: 'New Item' })}>Add</button>
            </div>
          )}
        </FieldArray>
      </Form>
    );

    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByTestId('item-1')).toBeInTheDocument();
      expect((screen.getByTestId('input-items.1.name') as HTMLInputElement).value).toBe('New Item');
    });
  });

  it('should remove item from array', async () => {
    render(
      <Form defaultValues={{ items: [{ name: 'Item 1' }, { name: 'Item 2' }] }}>
        <FieldArray name="items">
          {({ fields, remove, getName }) => (
            <div>
              {fields.map((field, index) => (
                <div key={field.id} data-testid={`item-${index}`}>
                  <Field name={getName(index, 'name')} component={TextInput} />
                  <button onClick={() => remove(index)}>Remove {index}</button>
                </div>
              ))}
            </div>
          )}
        </FieldArray>
      </Form>
    );

    expect(screen.getByTestId('item-1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Remove 0'));

    await waitFor(() => {
      expect((screen.getByTestId('input-items.0.name') as HTMLInputElement).value).toBe('Item 2');
    });
  });
});

describe('Nested Object Support', () => {
  it('should support dot notation for nested fields', () => {
    render(
      <Form defaultValues={{ address: { city: 'Tokyo', zip: '100-0001' } }}>
        <Field name="address.city" component={TextInput} />
        <Field name="address.zip" component={TextInput} />
      </Form>
    );

    expect((screen.getByTestId('input-address.city') as HTMLInputElement).value).toBe('Tokyo');
    expect((screen.getByTestId('input-address.zip') as HTMLInputElement).value).toBe('100-0001');
  });

  it('should update nested field values', async () => {
    const NestedValues = () => {
      const form = useFormContext();
      // Use watch() for reactive updates
      const values = form.values.watch();
      return <div data-testid="nested-values">{JSON.stringify(values)}</div>;
    };

    render(
      <Form defaultValues={{ address: { city: 'Tokyo' } }}>
        <Field name="address.city" component={TextInput} />
        <NestedValues />
      </Form>
    );

    fireEvent.change(screen.getByTestId('input-address.city'), {
      target: { value: 'Osaka' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('nested-values')).toHaveTextContent('{"address":{"city":"Osaka"}}');
    });
  });
});

describe('Cross-Field Validation', () => {
  it('should validate password confirmation with matchField', async () => {
    const PasswordForm = () => {
      useCrossFieldValidation(matchField('password', 'confirmPassword', 'Passwords must match'));

      return (
        <>
          <Field name="password" component={TextInput} />
          <Field name="confirmPassword" component={TextInput} />
        </>
      );
    };

    render(
      <Form defaultValues={{ password: '', confirmPassword: '' }}>
        <PasswordForm />
      </Form>
    );

    // Enter password
    fireEvent.change(screen.getByTestId('input-password'), {
      target: { value: 'secret123' },
    });

    // Enter mismatched confirmation
    fireEvent.change(screen.getByTestId('input-confirmPassword'), {
      target: { value: 'different' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-confirmPassword')).toHaveTextContent('Passwords must match');
    });

    // Fix the confirmation
    fireEvent.change(screen.getByTestId('input-confirmPassword'), {
      target: { value: 'secret123' },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('error-confirmPassword')).not.toBeInTheDocument();
    });
  });
});
