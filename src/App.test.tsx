import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { mockFetch } from './test/fixtures';
import { __resetStoreForTests, getState } from './lib/store';
import { __clearContentCache } from './lib/content';

function renderAt(hash: string) {
  window.location.hash = hash;
  return render(
    <HashRouter>
      <App />
    </HashRouter>,
  );
}

describe('routing under HashRouter', () => {
  beforeEach(() => {
    __clearContentCache();
    mockFetch();
    __resetStoreForTests();
    window.scrollTo = vi.fn();
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders the dashboard at #/', async () => {
    renderAt('#/');
    expect(await screen.findByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
    expect(await screen.findByText('Engineering pulse')).toBeInTheDocument();
  });

  it('renders the about page with the philosophy', async () => {
    renderAt('#/about');
    expect(await screen.findByText('Build instead of merely consuming.')).toBeInTheDocument();
  });

  it('renders a hub page', async () => {
    renderAt('#/system-design');
    expect(await screen.findByRole('heading', { level: 1, name: 'System Design' })).toBeInTheDocument();
    expect(await screen.findByText('Rate Limiting')).toBeInTheDocument();
  });

  it('renders a doc, and task checkboxes update progress state', async () => {
    renderAt('#/doc/rate-limiting');
    expect(await screen.findByRole('heading', { level: 1, name: 'Rate Limiting' })).toBeInTheDocument();
    const edit = screen.getByRole('link', { name: /edit on github/i });
    expect(edit).toHaveAttribute('href', 'https://github.com/rakshit-737/engineering-os/blob/master/12-System-Design/Rate-Limiting.md');
    const box = await screen.findByRole('checkbox', { name: /add a limiter/i });
    await userEvent.click(box);
    expect(getState().checks['rate-limiting#0']).toBe(true);
  });

  it('shows a helpful message for an unknown doc', async () => {
    renderAt('#/doc/does-not-exist');
    expect(await screen.findByText('Note not found')).toBeInTheDocument();
  });

  it('renders the 404 route with navigation links', async () => {
    renderAt('#/nowhere');
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Knowledge' }).length).toBeGreaterThan(0);
  });

  it('shows a retry on content fetch failure', async () => {
    __clearContentCache();
    vi.stubGlobal('fetch', vi.fn(async () => new Response('x', { status: 500, statusText: 'Server Error' })));
    renderAt('#/checklists');
    expect(await screen.findByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
});
