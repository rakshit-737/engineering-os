import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { Tabs } from './ui';
import { domainHref, HUBS } from './hubs';

afterEach(cleanup);

describe('Layout route focus', () => {
  it('moves focus to the new page h1 after navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout>
          <Routes>
            <Route path="/" element={<Link to="/next">go next</Link>} />
            <Route path="/next" element={<h1>Next page</h1>} />
          </Routes>
        </Layout>
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByText('go next'));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Next page' })));
  });
});

function TabsHarness() {
  const [v, setV] = useState<'a' | 'b' | 'c'>('a');
  return <Tabs label="Sections" idPrefix="t" tabs={[['a', 'A'], ['b', 'B'], ['c', 'C']] as const} value={v} onChange={setV} />;
}

describe('Tabs', () => {
  it('uses roving tabindex and arrow keys', async () => {
    render(<TabsHarness />);
    const [a, b, c] = screen.getAllByRole('tab') as [HTMLElement, HTMLElement, HTMLElement];
    expect(a.tabIndex).toBe(0);
    expect(b.tabIndex).toBe(-1);
    a.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(b.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(b);
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(c);
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(a);
  });
});

describe('hubs', () => {
  it('routes hub domains to their hub page and others to /domain', () => {
    expect(HUBS).toContain('dsa');
    expect(domainHref('dsa')).toBe('/dsa');
    expect(domainHref('career')).toBe('/domain/career');
  });
});
