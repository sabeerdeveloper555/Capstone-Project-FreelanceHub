import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Clients from '../pages/Clients';
import { AuthContext } from '../context/AuthContext';
import * as clientService from '../services/clientService';

vi.mock('../services/clientService', () => ({
  getClients: vi.fn(),
  createClient: vi.fn(),
  updateClient: vi.fn(),
  deleteClient: vi.fn(),
}));

const renderWithAuth = (ui, auth = {}, initialEntries = ['/']) => render(
  <AuthContext.Provider value={{
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    initializeAuth: vi.fn(),
    ...auth,
  }}>
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
  </AuthContext.Provider>
);

describe('authentication pages', () => {
  it('renders the login form controls', () => {
    renderWithAuth(<Login />);

    expect(screen.getByRole('heading', { name: 'Sign in to your account' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('shows login validation errors for empty credentials', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Login />);

    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });

  it('renders registration fields and validates a short password', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Register />);

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Role')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Full Name'), 'Test User');
    await user.type(screen.getByLabelText('Email Address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), '123');
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(await screen.findByText('Password must be at least 6 characters long.')).toBeInTheDocument();
  });
});

describe('protected application routes', () => {
  it('redirects an unauthenticated user to login', async () => {
    renderWithAuth(<App />, { isLoading: false, isAuthenticated: false }, ['/dashboard']);

    expect(await screen.findByRole('heading', { name: 'Sign in to your account' })).toBeInTheDocument();
  });
});

describe('clients page', () => {
  it('shows the empty state when the API returns no clients', async () => {
    clientService.getClients.mockResolvedValue([]);

    renderWithAuth(<Clients />, {
      user: { name: 'Freelancer', role: 'freelancer' },
      token: 'test-token',
      isAuthenticated: true,
    });

    await waitFor(() => expect(clientService.getClients).toHaveBeenCalledTimes(1));
    expect(await screen.findByText('No clients yet')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Add Client/ })).not.toHaveLength(0);
  });
});
