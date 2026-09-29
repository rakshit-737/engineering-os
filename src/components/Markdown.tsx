import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { renderMarkdown } from '../lib/markdown';
import { highlightWithin, renderMermaidWithin } from '../lib/enhance';
import { setSlice, useAppState } from '../lib/store';
import { useResolvedTheme } from '../lib/theme';

interface Props {
  slug: string;
  body: string;
  linkMap: Record<string, string>;
  exists: (slug: string) => boolean;
}

/** Renders sanitized Markdown and binds task checkboxes to progress state (`slug#index`). */
export function Markdown({ slug, body, linkMap, exists }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useResolvedTheme();
  const checks = useAppState((s) => s.checks);
  const navigate = useNavigate();
  const rendered = useMemo(() => renderMarkdown(body, { linkMap, exists }), [body, linkMap, exists]);

  // Enhance after the sanitized HTML is in the DOM.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (rendered.hasCode) void highlightWithin(el);
    if (rendered.hasMermaid) void renderMermaidWithin(el, theme === 'dark' ? 'dark' : 'default');
  }, [rendered, theme]);

  // Sync checkbox state.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((box, i) => {
      box.disabled = false;
      box.dataset.idx = String(i);
      box.checked = !!checks[`${slug}#${i}`];
      const li = box.closest('li');
      const text = li?.textContent?.trim().slice(0, 120) ?? `Item ${i + 1}`;
      box.setAttribute('aria-label', text);
    });
  }, [checks, slug, rendered]);

  // Native listener: React's synthetic onChange does not fire for inputs created via innerHTML.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onChange = (e: Event) => {
      const t = e.target as HTMLInputElement;
      if (t.type !== 'checkbox' || t.dataset.idx === undefined) return;
      const key = `${slug}#${t.dataset.idx}`;
      const val = t.checked;
      setSlice('checks', (c) => {
        const next = { ...c };
        if (val) next[key] = true;
        else delete next[key];
        return next;
      });
    };
    el.addEventListener('change', onChange);
    return () => el.removeEventListener('change', onChange);
  }, [slug]);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a) return;
    const href = a.getAttribute('href') ?? '';
    if (href.startsWith('#/anchor/')) {
      e.preventDefault();
      document.getElementById(decodeURIComponent(href.slice(9)))?.scrollIntoView({ behavior: 'smooth' });
    } else if (href.startsWith('#/')) {
      e.preventDefault();
      navigate(href.slice(1));
    }
  };

  return (
    // Click/change handlers delegate for links and checkboxes rendered from Markdown.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      ref={ref}
      className="prose"
      onClick={onClick}
      // Safe: output of marked passed through DOMPurify in renderMarkdown().
      dangerouslySetInnerHTML={{ __html: rendered.html }}
    />
  );
}
