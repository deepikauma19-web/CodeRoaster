import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PublicRoastPage from '../pages/PublicRoastPage';
import { getPublicRoast } from '../services/shareApi';
import { axiosError, makePublicRoast } from './utils/fixtures';
import { renderWithProviders } from './utils/renderWithProviders';

vi.mock('../services/shareApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/shareApi')>();
  return { ...actual, getPublicRoast: vi.fn() };
});

const mockGetPublic = vi.mocked(getPublicRoast);

const renderPage = (slug = 'abc123') =>
  renderWithProviders(<PublicRoastPage />, { route: `/r/${slug}`, path: '/r/:shareSlug' });

describe('PublicRoastPage', () => {
  beforeEach(() => {
    mockGetPublic.mockReset();
    document.title = 'Code Roaster';
  });

  it('shows a skeleton while loading', () => {
    mockGetPublic.mockReturnValue(new Promise(() => undefined));
    renderPage();
    expect(screen.getByTestId('public-roast-skeleton')).toBeInTheDocument();
  });

  it('renders the public roast', async () => {
    mockGetPublic.mockResolvedValue(makePublicRoast());
    renderPage('abc123');
    expect(await screen.findByRole('heading', { name: 'octo/todo-app' })).toBeInTheDocument();
    expect(mockGetPublic).toHaveBeenCalledWith('abc123');
    expect(screen.getByTestId('author-chip')).toHaveTextContent('Deepa');
    expect(screen.getByRole('img', { name: 'Score 35 out of 100: Burnt 🔥' })).toBeInTheDocument();
    expect(screen.getByTestId('score-breakdown')).toBeInTheDocument();
    expect(screen.getByTestId('roast-card')).toHaveTextContent('Semma comedy da.');
    expect(screen.getByText('Remove API key')).toBeInTheDocument();
    // Read-only tips: no checkboxes on the public page.
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Intensity: Extra Spicy')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Un repo-vum roast pannalaama/ })).toHaveAttribute('href', '/login');
    await waitFor(() => expect(document.title).toBe('octo/todo-app – 35/100 | Code Roaster'));
  });

  it('handles a roast without score or text', async () => {
    mockGetPublic.mockResolvedValue(
      makePublicRoast({ overall_score: null, score_breakdown: null, roast_text: null, tips: [] }),
    );
    renderPage();
    expect(await screen.findByTestId('tips-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('score-gauge')).not.toBeInTheDocument();
    expect(screen.queryByTestId('roast-card')).not.toBeInTheDocument();
  });

  it('404 shows the unavailable state', async () => {
    mockGetPublic.mockRejectedValue(axiosError(404, { detail: 'Not found' }));
    renderPage('gone');
    expect(await screen.findByTestId('public-roast-unavailable')).toHaveTextContent(/private-aa irukku illa delete/);
    await waitFor(() => expect(document.title).toBe('Roast not found | Code Roaster'));
  });

  it('other errors show a load failure with message', async () => {
    mockGetPublic.mockRejectedValue(axiosError(500, { detail: 'kaboom' }));
    renderPage();
    expect(await screen.findByTestId('public-roast-unavailable')).toHaveTextContent('Roast load panna mudiyala');
    expect(screen.getByText('kaboom')).toBeInTheDocument();
  });
});
