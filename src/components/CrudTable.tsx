import { useMemo, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { ConfirmDialog, EmptyState, Modal } from './ui';
import { humanize } from '../lib/domains';

export interface FieldDef<T> {
  key: keyof T & string;
  label: string;
  kind: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'url';
  options?: readonly (string | number)[];
  optionLabel?: (v: string | number) => string;
  required?: boolean;
  inTable?: boolean;
  /** column-only field (e.g. a live toggle); not shown in the edit form */
  formHidden?: boolean;
  wide?: boolean;
  render?: (item: T) => ReactNode;
}

interface Props<T extends { id: string }> {
  noun: string;
  items: T[];
  fields: FieldDef<NoInfer<T>>[];
  onChange: (items: NoInfer<T>[]) => void;
  makeEmpty: () => NoInfer<T>;
  empty: { title: string; text: string };
  filterField?: keyof NoInfer<T> & string;
  defaultSort?: keyof NoInfer<T> & string;
}

export function CrudTable<T extends { id: string }>({ noun, items, fields, onChange, makeEmpty, empty, filterField, defaultSort }: Props<T>) {
  const [editing, setEditing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 }>({ key: defaultSort ?? '', dir: 1 });
  const [filter, setFilter] = useState('');
  const [q, setQ] = useState('');
  const filterDef = fields.find((f) => f.key === filterField);
  const cols = fields.filter((f) => f.inTable);

  const view = useMemo(() => {
    let out = items;
    if (filter && filterField) out = out.filter((i) => String(i[filterField]) === filter);
    if (q.trim()) {
      const s = q.toLowerCase();
      out = out.filter((i) => fields.some((f) => String(i[f.key] ?? '').toLowerCase().includes(s)));
    }
    if (sort.key) {
      out = [...out].sort((a, b) => {
        const av = a[sort.key as keyof T], bv = b[sort.key as keyof T];
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sort.dir;
        const as = String(av ?? ''), bs = String(bv ?? '');
        if (!as && bs) return 1; // empties last
        if (as && !bs) return -1;
        return as.localeCompare(bs) * sort.dir;
      });
    }
    return out;
  }, [items, filter, filterField, q, sort, fields]);

  const save = (item: T) => {
    const exists = items.some((i) => i.id === item.id);
    onChange(exists ? items.map((i) => (i.id === item.id ? item : i)) : [item, ...items]);
    setEditing(null);
  };

  const label = (f: FieldDef<T>, v: unknown) => {
    if (v === '' || v === undefined || v === null) return <span className="subtle">—</span>;
    if (f.kind === 'url' && typeof v === 'string' && /^https?:\/\//i.test(v))
      return <a href={v} target="_blank" rel="noopener noreferrer">{v.replace(/^https?:\/\//, '').slice(0, 40)}</a>;
    if (f.kind === 'select') return f.optionLabel ? f.optionLabel(v as string) : humanize(String(v));
    const s = String(v);
    return s.length > 80 ? `${s.slice(0, 80)}…` : s;
  };

  return (
    <div>
      <div className="filters">
        <button type="button" className="btn btn-primary" onClick={() => setEditing(makeEmpty())}>
          <Plus size={14} aria-hidden="true" /> Add {noun}
        </button>
        {items.length > 0 && (
          <>
            <input className="input" type="search" placeholder={`Filter ${noun}s…`} aria-label={`Filter ${noun}s`} value={q} onChange={(e) => setQ(e.target.value)} />
            {filterDef?.options && (
              <select className="select" aria-label={`Filter by ${filterDef.label}`} value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="">All {filterDef.label.toLowerCase()}</option>
                {filterDef.options.map((o) => (
                  <option key={o} value={String(o)}>{filterDef.optionLabel ? filterDef.optionLabel(o) : humanize(String(o))}</option>
                ))}
              </select>
            )}
          </>
        )}
      </div>
      {items.length === 0 ? (
        <EmptyState title={empty.title} action={<button type="button" className="btn" onClick={() => setEditing(makeEmpty())}>Add your first {noun}</button>}>
          {empty.text}
        </EmptyState>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {cols.map((c) => (
                  <th key={c.key} aria-sort={sort.key === c.key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
                    <button type="button" onClick={() => setSort((s) => ({ key: c.key, dir: s.key === c.key ? ((-s.dir) as 1 | -1) : 1 }))}>
                      {c.label}
                      {sort.key === c.key && (sort.dir === 1 ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />)}
                    </button>
                  </th>
                ))}
                <th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {view.map((item) => (
                <tr key={item.id}>
                  {cols.map((c) => (
                    <td key={c.key}>{c.render ? c.render(item) : label(c, item[c.key])}</td>
                  ))}
                  <td className="actions">
                    <button type="button" className="icon-btn" aria-label={`Edit ${noun}`} onClick={() => setEditing(item)}>
                      <Pencil size={14} aria-hidden="true" />
                    </button>
                    <button type="button" className="icon-btn" aria-label={`Delete ${noun}`} onClick={() => setDeleting(item)}>
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
              {!view.length && (
                <tr><td colSpan={cols.length + 1} className="muted">No {noun}s match the current filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <EditForm
          noun={noun}
          item={editing}
          fields={fields}
          isNew={!items.some((i) => i.id === editing.id)}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title={`Delete ${noun}?`}
          message="This cannot be undone (unless you have an export)."
          confirmLabel="Delete"
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            onChange(items.filter((i) => i.id !== deleting.id));
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}

function EditForm<T extends { id: string }>({ noun, item, fields, isNew, onCancel, onSave }: {
  noun: string; item: T; fields: FieldDef<T>[]; isNew: boolean; onCancel: () => void; onSave: (t: T) => void;
}) {
  const [draft, setDraft] = useState<T>(item);
  const [error, setError] = useState('');
  const set = (k: keyof T, v: unknown) => setDraft((d) => ({ ...d, [k]: v }));
  return (
    <Modal title={`${isNew ? 'Add' : 'Edit'} ${noun}`} onClose={onCancel} wide>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const missing = fields.find((f) => f.required && !String(draft[f.key] ?? '').trim());
          if (missing) return setError(`${missing.label} is required.`);
          onSave(draft);
        }}
      >
        <div className="form-grid">
          {fields.filter((f) => !f.formHidden).map((f, i) => {
            const v = draft[f.key];
            const common = { id: `f-${f.key}`, 'data-autofocus': i === 0 ? true : undefined };
            return (
              <label key={f.key} className={`field${f.wide || f.kind === 'textarea' ? ' span-all' : ''}`} htmlFor={common.id}>
                <span>{f.label}{f.required ? ' *' : ''}</span>
                {f.kind === 'textarea' ? (
                  <textarea {...common} className="textarea" value={String(v ?? '')} onChange={(e) => set(f.key, e.target.value)} />
                ) : f.kind === 'select' ? (
                  <select {...common} className="select" value={String(v)} onChange={(e) => {
                    const opt = f.options?.find((o) => String(o) === e.target.value);
                    set(f.key, opt ?? e.target.value);
                  }}>
                    {f.options?.map((o) => <option key={o} value={String(o)}>{f.optionLabel ? f.optionLabel(o) : humanize(String(o))}</option>)}
                  </select>
                ) : (
                  <input
                    {...common}
                    className="input"
                    type={f.kind === 'date' ? 'date' : f.kind === 'number' ? 'number' : f.kind === 'url' ? 'url' : 'text'}
                    step={f.kind === 'number' ? 'any' : undefined}
                    min={f.kind === 'number' ? 0 : undefined}
                    value={String(v ?? '')}
                    onChange={(e) => set(f.key, f.kind === 'number' ? (e.target.value === '' ? 0 : Number(e.target.value)) : e.target.value)}
                  />
                )}
              </label>
            );
          })}
        </div>
        {error && <p role="alert" style={{ color: 'var(--danger)' }}>{error}</p>}
        <div className="row" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
          <button type="button" className="btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
    </Modal>
  );
}
