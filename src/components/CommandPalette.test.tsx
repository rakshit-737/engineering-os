import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CommandPalette, __resetPaletteSearch } from './CommandPalette';
import { Layout } from './Layout';
import { fixtureSearch } from '../test/fixtures';

function Where() {
  return <div data-testid="where">{useLocation().pathname}</div>;
}

function setup(onClose = vi.fn()) {
  const loader = vi.fn(async () => fixtureSearch);
  render(
    <MemoryRouter initialEntries={['/']}>
      <CommandPalette onClose={onClose} loader={loader} />
      <Routes><Route path="*" element={<Where />} /></Routes>
    </MemoryRouter>,
  );
  return { onClose, loader };
}

describe('CommandPalette', () => {
  beforeEach(() => __resetPaletteSearch());
  afterEach(cleanup);

  it('focuses the combobox and exposes listbox semantics', () => {
    setup();
    const input = screen.getByRole('combobox');
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('aria-controls', 'palette-list');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('moves selection with arrow keys (wrapping) and tracks aria-activedescendant', async () => {
    setup();
    const input = screen.getByRole('combobox');
    await userEvent.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant', 'pi-1');
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    const n = screen.getAllByRole('option').length;
    expect(input).toHaveAttribute('aria-activedescendant', `pi-${n - 1}`);
  });

  it('searches docs and opens the selected one with Enter', async () => {
    const { onClose } = setup();
    await userEvent.type(screen.getByRole('combobox'), 'rate');
    await screen.findByRole('option', { name: /Rate Limiting/ });
    await userEvent.keyboard('{Enter}');
    expect(onClose).toHaveBeenCalled();
    expect(screen.getByTestId('where')).toHaveTextContent('/doc/rate-limiting');
  });

  it('filters navigation commands', async () => {
    setup();
    await userEvent.type(screen.getByRole('combobox'), 'metr');
    expect(screen.getByRole('option', { name: /Metrics/ })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Dashboard/ })).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const { onClose } = setup();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('opens from Ctrl+K and "/" in the layout and closes on Escape', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(fixtureSearch))));
    window.scrollTo = vi.fn();
    render(<MemoryRouter><Layout><p>page</p></Layout></MemoryRouter>);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    await userEvent.keyboard('{Control>}k{/Control}');
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('combobox')).not.toBeInTheDocument());
    await userEvent.keyboard('/');
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});
