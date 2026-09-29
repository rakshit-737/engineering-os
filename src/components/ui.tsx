import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { DocProgress } from '../types';
import { domainInfo, humanize } from '../lib/domains';

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {actions && <div className="actions">{actions}</div>}
    </header>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="progress" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${v}%` }} />
    </div>
  );
}

const STATUS_LABEL: Record<DocProgress, string> = {
  'not-started': 'Not started',
  learning: 'Learning',
  done: 'Done',
  revise: 'Revise',
};
export const STATUSES: DocProgress[] = ['not-started', 'learning', 'done', 'revise'];
export function statusLabel(s: DocProgress) {
  return STATUS_LABEL[s];
}

export function StatusChip({ status }: { status: DocProgress }) {
  if (status === 'not-started') return null;
  return <span className={`chip status-${status}`}>{STATUS_LABEL[status]}</span>;
}

export function DomainChip({ domain }: { domain: string }) {
  const d = domainInfo(domain);
  return (
    <span className="chip">
      <span className="chip-dot" style={{ background: d.color }} aria-hidden="true" />
      {d.label}
    </span>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return <span className="chip">{children}</span>;
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: Error | null; onRetry?: () => void }) {
  return (
    <div className="error-box" role="alert">
      <strong>Could not load content.</strong>
      <p className="muted" style={{ margin: '6px 0 10px' }}>
        {error?.message ?? 'Unknown error'}. If you are offline, cached pages still work.
      </p>
      {onRetry && (
        <button className="btn" onClick={onRetry} type="button">
          Retry
        </button>
      )}
    </div>
  );
}

export function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}…</span>
      <div className="skeleton" style={{ width: '40%', height: 22 }} />
      <div className="skeleton" style={{ width: '90%' }} />
      <div className="skeleton" style={{ width: '75%' }} />
    </div>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Traps Tab inside `ref`, closes on Escape, restores focus on unmount. */
export function useFocusTrap(ref: React.RefObject<HTMLElement | null>, onClose: () => void, active = true) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!active) return;
    const prev = document.activeElement as HTMLElement | null;
    const el = ref.current;
    const first = el?.querySelector<HTMLElement>('[data-autofocus]') ?? el?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab' || !el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const f = items[0]!, l = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === f) {
        e.preventDefault();
        l.focus();
      } else if (!e.shiftKey && document.activeElement === l) {
        e.preventDefault();
        f.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [ref, active]);
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, onClose);
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()} role="presentation">
      <div ref={ref} className={`dialog${wide ? ' dialog-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel }: {
  title: string; message: ReactNode; confirmLabel?: string; danger?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="muted">{message}</p>
      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
        <button type="button" className="btn" onClick={onCancel} data-autofocus>
          Cancel
        </button>
        <button type="button" className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export function DocLink({ slug, title }: { slug: string; title?: string }) {
  return <Link to={`/doc/${encodeURIComponent(slug)}`}>{title ?? humanize(slug)}</Link>;
}
