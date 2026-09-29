import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { exportState, importState, TODAY_SLOTS } from '../lib/storage';
import { getState, replaceState, resetState, setSlice, useAppState } from '../lib/store';
import { DOMAINS } from '../lib/domains';
import { ConfirmDialog, PageHeader } from '../components/ui';
import type { AppState, ThemePref } from '../types';

export default function Settings() {
  const theme = useAppState((s) => s.theme);
  const config = useAppState((s) => s.todayConfig);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pending, setPending] = useState<AppState | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const doExport = () => {
    const blob = new Blob([exportState(getState())], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `engineering-os-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMsg({ ok: true, text: 'Exported.' });
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 5_000_000) return setMsg({ ok: false, text: 'File is larger than 5 MB; refusing to import.' });
    const r = importState(await f.text());
    if (fileRef.current) fileRef.current.value = '';
    if (!r.ok) return setMsg({ ok: false, text: `Import rejected. ${r.error} Nothing was changed.` });
    setPending(r.state);
  };

  const toggleDomain = (slot: (typeof TODAY_SLOTS)[number], d: string) =>
    setSlice('todayConfig', (c) => {
      const cur = c.domains[slot];
      return { domains: { ...c.domains, [slot]: cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d] } };
    });

  return (
    <>
      <PageHeader title="Settings" description="Everything is stored locally in this browser (localStorage). Export regularly — clearing site data erases it." />
      <section className="card">
        <div className="card-title">Theme</div>
        <div className="row" role="radiogroup" aria-label="Theme">
          {(['system', 'light', 'dark'] as ThemePref[]).map((t) => (
            <label key={t} className="checkbox-row" style={{ marginRight: 12 }}>
              <input type="radio" name="theme" checked={theme === t} onChange={() => setSlice('theme', t)} /> {t[0]!.toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>
      </section>

      <section className="card section">
        <div className="card-title">Data</div>
        <div className="row">
          <button type="button" className="btn" onClick={doExport}><Download size={14} aria-hidden="true" /> Export JSON</button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}><Upload size={14} aria-hidden="true" /> Import JSON</button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" aria-label="Import file" onChange={(e) => void onFile(e.target.files?.[0])} tabIndex={-1} />
          <span className="spacer" />
          <button type="button" className="btn btn-danger" onClick={() => setConfirmReset(true)}>Reset all data…</button>
        </div>
        {msg && <p role="status" style={{ color: msg.ok ? 'var(--success)' : 'var(--danger)', marginBottom: 0 }}>{msg.text}</p>}
        <p className="subtle">Imports are validated against a strict schema; malformed files are rejected without touching your data.</p>
      </section>

      <section className="card section" id="today-config">
        <div className="card-title">Today planner domains</div>
        <p className="subtle" style={{ marginTop: 0 }}>Which domains each slot draws suggestions from. Review always draws from notes marked Revise or Learning.</p>
        {TODAY_SLOTS.filter((s) => s !== 'review').map((slot) => (
          <fieldset key={slot} style={{ border: 'none', padding: 0, margin: '0 0 12px' }}>
            <legend className="slot-label" style={{ marginBottom: 6 }}>{slot.toUpperCase()}</legend>
            <div className="row">
              {DOMAINS.map((d) => (
                <label key={d.id} className="chip" style={{ cursor: 'pointer' }}>
                  <input type="checkbox" checked={config.domains[slot].includes(d.id)} onChange={() => toggleDomain(slot, d.id)} /> {d.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </section>

      {confirmReset && (
        <ConfirmDialog
          title="Reset all data?"
          message="This permanently deletes progress, projects, applications, journal and every other record stored in this browser. Export first if unsure."
          confirmLabel="Reset everything"
          danger
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            resetState();
            setConfirmReset(false);
            setMsg({ ok: true, text: 'All data reset.' });
          }}
        />
      )}
      {pending && (
        <ConfirmDialog
          title="Replace current data?"
          message={`The file is valid: ${Object.keys(pending.docStatus).length} note statuses, ${pending.projects.length} projects, ${pending.applications.length} applications. Importing replaces everything currently stored.`}
          confirmLabel="Import"
          onCancel={() => setPending(null)}
          onConfirm={() => {
            replaceState(pending);
            setPending(null);
            setMsg({ ok: true, text: 'Import complete.' });
          }}
        />
      )}
    </>
  );
}
