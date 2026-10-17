import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NewRoastPage from '../pages/NewRoastPage';
import { createRoast, listRoasts } from '../services/roastApi';
import { authedValue, axiosError, makeRoast } from './utils/fixtures';
import { renderWithProviders } from './utils/renderWithProviders';

vi.mock('../services/roastApi', () => ({
  createRoast: vi.fn(),
  listRoasts: vi.fn(),
}));

const mockCreate = vi.mocked(createRoast);
const mockList = vi.mocked(listRoasts);

const renderPage = () =>
  renderWithProviders(<NewRoastPage />, {
    route: '/roast/new',
    auth: authedValue(),
    extraRoutes: <Route path="/roasts/:id" element={<div data-testid="result-page" />} />,
  });

const urlInput = (): HTMLElement => screen.getByLabelText(/GitHub repo URL/);
const submitButton = (): HTMLElement => screen.getByRole('button', { name: /Roast Me/ });

describe('NewRoastPage', () => {
  beforeEach(() => {
    mockCreate.mockReset();
    mockList.mockReset();
    mockList.mockResolvedValue({ items: [], total: 0, page: 1, size: 5 });
  });

  it('shows an inline error for an invalid URL and does not call createRoast', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(urlInput(), 'https://gitlab.com/foo/bar');
    await user.click(submitButton());
    expect(await screen.findByText(/Enter a valid GitHub repo URL/)).toBeInTheDocument();
    expect(urlInput()).toHaveAttribute('aria-invalid', 'true');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('requires a URL', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(submitButton());
    expect(await screen.findByText('Please enter a repo URL!')).toBeInTheDocument();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('validates on blur and clears the error once fixed', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(urlInput(), 'nope');
    await user.tab();
    expect(await screen.findByText(/Enter a valid GitHub repo URL/)).toBeInTheDocument();
    await user.clear(urlInput());
    await user.type(urlInput(), 'https://github.com/a/b');
    expect(screen.queryByText(/Enter a valid GitHub repo URL/)).not.toBeInTheDocument();
  });

  it('submits {repo_url, intensity} and navigates to /roasts/:id', async () => {
    const user = userEvent.setup();
    mockCreate.mockResolvedValue(makeRoast({ id: 77, status: 'pending' }));
    renderPage();
    await user.type(urlInput(), '  https://github.com/octo/todo-app  ');
    await user.click(screen.getByText('Extra Spicy'));
    await user.click(submitButton());
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/roasts/77'));
    expect(mockCreate).toHaveBeenCalledWith({ repo_url: 'https://github.com/octo/todo-app', intensity: 'extra_spicy' });
    expect(screen.getByTestId('result-page')).toBeInTheDocument();
  });

  it('defaults intensity to medium', async () => {
    const user = userEvent.setup();
    mockCreate.mockResolvedValue(makeRoast({ id: 5 }));
    renderPage();
    await user.type(urlInput(), 'https://github.com/octo/todo-app');
    await user.click(submitButton());
    await waitFor(() => expect(mockCreate).toHaveBeenCalledWith({ repo_url: 'https://github.com/octo/todo-app', intensity: 'medium' }));
  });

  it('shows the server error and stays on the page', async () => {
    const user = userEvent.setup();
    mockCreate.mockRejectedValue(axiosError(429, { detail: 'Rate limit: 10 roasts per hour' }));
    renderPage();
    await user.type(urlInput(), 'https://github.com/octo/todo-app');
    await user.click(submitButton());
    expect(await screen.findByTestId('server-error')).toHaveTextContent('Rate limit: 10 roasts per hour');
    expect(screen.getByTestId('location')).toHaveTextContent('/roast/new');
    expect(submitButton()).not.toBeDisabled();
  });

  it('lists recent roasts with scores and statuses', async () => {
    mockList.mockResolvedValue({
      items: [
        makeRoast({ id: 1, repo_name: 'alpha', overall_score: 91 }),
        makeRoast({ id: 2, repo_name: 'beta', status: 'analyzing', overall_score: null }),
      ],
      total: 2,
      page: 1,
      size: 5,
    });
    renderPage();
    expect(await screen.findByText('octo/alpha')).toBeInTheDocument();
    expect(screen.getByText('91/100')).toBeInTheDocument();
    expect(screen.getByText('analyzing')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'octo/beta' })).toHaveAttribute('href', '/roasts/2');
    expect(mockList).toHaveBeenCalledWith({ page: 1, size: 5 });
  });

  it('shows empty and error states for recent roasts', async () => {
    const { unmount } = renderPage();
    expect(await screen.findByText(/No roasts yet/)).toBeInTheDocument();
    unmount();
    mockList.mockRejectedValue(axiosError(500, { detail: 'list failed' }));
    renderPage();
    expect(await screen.findByText('list failed')).toBeInTheDocument();
  });
});
