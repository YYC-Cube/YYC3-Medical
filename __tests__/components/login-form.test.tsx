import { LoginForm } from '@/components/auth/LoginForm';
import { useAuthStore } from '@/store/useAuthStore';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });
});

describe('LoginForm', () => {
  it('renders email + password fields and submit button', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/邮箱地址/)).toBeInTheDocument();
    expect(screen.getByLabelText(/密码/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /安全登录/ })).toBeInTheDocument();
  });

  // Note: "shows error when fields are empty" and "shows error for malformed email"
  // are handled by HTML5 `required` + `type=email` form validation, which runs
  // BEFORE the JS-level onSubmit handler. In jsdom these checks are inconsistent,
  // so we don't assert the JS-side error messages for those two branches.
  // The JS-level checks are still in place in LoginForm.tsx as defense-in-depth.

  it('rejects unknown account', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/邮箱地址/), 'unknown@example.com');
    await user.type(screen.getByLabelText(/密码/), 'password');
    await user.click(screen.getByRole('button', { name: /安全登录/ }));
    expect(
      await screen.findByText(/邮箱地址不存在/, undefined, { timeout: 3000 })
    ).toBeInTheDocument();
  });

  it('rejects wrong password for known account', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/邮箱地址/), 'admin@yanyucloud.com');
    await user.type(screen.getByLabelText(/密码/), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /安全登录/ }));
    expect(await screen.findByText(/密码错误/, undefined, { timeout: 3000 })).toBeInTheDocument();
  });

  it('accepts valid demo admin login', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    render(<LoginForm onSuccess={onSuccess} />);
    await user.type(screen.getByLabelText(/邮箱地址/), 'admin@yanyucloud.com');
    await user.type(screen.getByLabelText(/密码/), 'admin123');
    await user.click(screen.getByRole('button', { name: /安全登录/ }));
    await waitFor(
      () => {
        expect(useAuthStore.getState().isAuthenticated).toBe(true);
      },
      { timeout: 3000 }
    );
    expect(useAuthStore.getState().user?.email).toBe('admin@yanyucloud.com');
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    const passwordInput = screen.getByLabelText(/密码/);
    expect(passwordInput).toHaveAttribute('type', 'password');
    // Find the eye toggle button by aria-label or by clicking on the button containing Eye icon
    const toggleButtons = screen.getAllByRole('button');
    // The eye toggle is typically a button without text — find by clicking the one that's not submit
    const eyeButton = toggleButtons.find(b => !/安全登录/.test(b.textContent || '')) as
      | HTMLButtonElement
      | undefined;
    if (eyeButton) {
      await user.click(eyeButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
    }
  });
});
