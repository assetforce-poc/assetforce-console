import { fireEvent, render, screen } from '@testing-library/react';

import { EmailInput, FormError, PasswordInput, SubmitButton } from '../src/components';

describe('PasswordInput', () => {
  it('should render password input', () => {
    render(<PasswordInput label="Password" value="" onChange={() => {}} />);
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should toggle password visibility', () => {
    render(<PasswordInput label="Password" value="test123" onChange={() => {}} />);

    const inputs = screen.getAllByLabelText(/password/i);
    const input = inputs[0] as HTMLInputElement;
    expect(input.type).toBe('password');

    const toggleButton = screen.getByRole('button', { name: /show password/i });
    fireEvent.click(toggleButton);

    expect(input.type).toBe('text');
  });

  it('should not show toggle button when showToggle is false', () => {
    render(<PasswordInput label="Password" value="" onChange={() => {}} showToggle={false} />);

    expect(screen.queryByRole('button', { name: /show password/i })).not.toBeInTheDocument();
  });
});

describe('EmailInput', () => {
  it('should render email input', () => {
    render(<EmailInput label="Email" value="" onChange={() => {}} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should have email type', () => {
    render(<EmailInput label="Email" value="" onChange={() => {}} />);
    const input = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(input.type).toBe('email');
  });

  it('should call onChange when value changes', () => {
    const handleChange = jest.fn();
    render(<EmailInput label="Email" value="" onChange={handleChange} />);

    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(handleChange).toHaveBeenCalled();
  });
});

describe('SubmitButton', () => {
  it('should render button with children', () => {
    render(<SubmitButton>Submit</SubmitButton>);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(
      <SubmitButton loading loadingText="Loading...">
        Submit
      </SubmitButton>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should be disabled when loading', () => {
    render(<SubmitButton loading>Submit</SubmitButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<SubmitButton disabled>Submit</SubmitButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

describe('FormError', () => {
  it('should not render when no error', () => {
    const { container } = render(<FormError error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render error message', () => {
    render(<FormError error="Test error message" />);
    expect(screen.getByText(/test error message/i)).toBeInTheDocument();
  });

  it('should render placeholder when showEmpty is true', () => {
    render(<FormError error={null} showEmpty />);
    expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
  });
});
