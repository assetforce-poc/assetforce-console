import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import type { LoginResult, RegisterResult } from '../src/adapter/types';
import { LoginForm, RegisterForm } from '../src/forms';

describe('LoginForm', () => {
  it('should render login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show validation error for empty fields', async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getAllByLabelText(/password/i)[0];
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.change(passwordInput, { target: { value: 'Test1234!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for short password', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getAllByLabelText(/password/i)[0];
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should call onLogin with credentials', async () => {
    const mockLogin = jest.fn().mockResolvedValue({
      success: true,
      user: { id: '1', email: 'test@example.com' },
    } as LoginResult);

    render(<LoginForm onLogin={mockLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getAllByLabelText(/password/i)[0];
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test1234!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Test1234!',
        rememberMe: false,
      });
    });
  });

  it('should show forgot password link', () => {
    render(<LoginForm />);
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it('should show sign up link', () => {
    render(<LoginForm />);
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('should not show sign up link when showSignUp is false', () => {
    render(<LoginForm showSignUp={false} />);
    expect(screen.queryByText(/don't have an account/i)).not.toBeInTheDocument();
  });
});

describe('RegisterForm', () => {
  it('should render register form', () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should show first name and last name fields by default', () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  });

  it('should show validation error for empty fields', async () => {
    render(<RegisterForm />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for weak password', async () => {
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getAllByLabelText(/password/i)[0];
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'weakpass' } });

    // Accept terms
    const termsCheckbox = screen.getByRole('checkbox');
    fireEvent.click(termsCheckbox);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one uppercase/i)).toBeInTheDocument();
    });
  });

  it('should show validation error when terms not accepted', async () => {
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getAllByLabelText(/password/i)[0];
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test1234!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/you must accept the terms and conditions/i)).toBeInTheDocument();
    });
  });

  it('should call onRegister with data', async () => {
    const mockRegister = jest.fn().mockResolvedValue({
      success: true,
      email: 'test@example.com',
      userId: '1',
    } as RegisterResult);

    render(<RegisterForm onRegister={mockRegister} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getAllByLabelText(/password/i)[0];
    const termsCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test1234!' } });
    fireEvent.click(termsCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Test1234!',
        acceptTerms: true,
      });
    });
  });

  it('should show sign in link', () => {
    render(<RegisterForm />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
});
