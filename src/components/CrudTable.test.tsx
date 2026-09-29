import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CrudTable, type FieldDef } from './CrudTable';
import { StartHere } from '../pages/Dashboard';
import type { DocMeta } from '../types';

interface Row { id: string; name: string; status: string }
const fields: FieldDef<Row>[] = [
  { key: 'name', label: 'Name', kind: 'text', inTable: true },
  { key: 'status', label: 'Status', kind: 'select', options: ['a', 'b'], inTable: true },
];

describe('CrudTable', () => {
  afterEach(cleanup);
  it('labels cells for stacked mobile cards and names row actions', () => {
    render(
      <CrudTable<Row> noun="project" items={[{ id: '1', name: 'Rate limiter', status: 'a' }]} fields={fields}
        onChange={vi.fn()} makeEmpty={() => ({ id: '2', name: '', status: 'a' })} empty={{ title: 'x', text: 'y' }} />,
    );
    expect(screen.getByRole('button', { name: 'Edit project Rate limiter' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Delete project Rate limiter' })).toBeTruthy();
    expect(screen.getByText('Rate limiter').closest('td')?.getAttribute('data-label')).toBe('Name');
    expect(screen.getByRole('combobox', { name: 'Sort by' })).toBeTruthy();
  });
});

describe('Dashboard StartHere', () => {
  afterEach(cleanup);
  it('gives a first-time visitor concrete next steps', () => {
    const docs = [{ slug: 'tcp', title: 'TCP', domain: 'cs-core' }] as unknown as DocMeta[];
    render(<MemoryRouter><StartHere docs={docs} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Start here' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Plan today' }).getAttribute('href')).toBe('/today');
    expect(screen.getByRole('link', { name: 'Read a first note' }).getAttribute('href')).toBe('/doc/tcp');
  });
});
