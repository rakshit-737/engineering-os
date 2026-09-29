import { Marked, type Tokens } from 'marked';
import DOMPurify from 'dompurify';
import { createSlugger, toSlug } from './slug';

export interface RenderOptions {
  /** relative .md href -> slug (from build step) */
  linkMap?: Record<string, string>;
  /** returns true if a slug exists; unresolved wikilinks render as plain text */
  exists?: (slug: string) => boolean;
}

export interface RenderResult {
  html: string;
  hasMermaid: boolean;
  hasCode: boolean;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * Replace [[Target]] / [[Target|label]] with markdown links, skipping fenced code
 * blocks and inline code spans (mermaid `A[[x]]` shapes, `arr[[0]]`).
 */
export function rewriteWikilinks(md: string, exists?: (slug: string) => boolean): string {
  const lines = md.split('\n');
  let fence: string | null = null;
  const out: string[] = [];
  for (const line of lines) {
    const f = line.match(/^\s*(```+|~~~+)/);
    if (f) {
      const marker = f[1]!.slice(0, 3);
      if (fence === null) fence = marker;
      else if (marker === fence) fence = null;
      out.push(line);
      continue;
    }
    if (fence !== null) {
      out.push(line);
      continue;
    }
    // split by inline code spans; only rewrite outside them
    const parts = line.split(/(`+[^`]*`+)/);
    out.push(
      parts
        .map((p, i) =>
          i % 2 === 1
            ? p
            : p.replace(/\[\[([^\]|#\n]+)(#[^\]|\n]*)?(?:\|([^\]\n]+))?\]\]/g, (_m, target: string, _anchor, label?: string) => {
                const slug = toSlug(target);
                const text = (label ?? target).trim().replace(/[[\]]/g, '');
                if (exists && !exists(slug)) return `<span class="wikilink-missing" title="Missing note">${escapeHtml(text)}</span>`;
                return `[${text}](#/doc/${encodeURIComponent(slug)})`;
              }),
        )
        .join(''),
    );
  }
  return out.join('\n');
}

let hooked = false;
function ensureHooks() {
  if (hooked) return;
  hooked = true;
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      const href = node.getAttribute('href') ?? '';
      if (/^https?:\/\//i.test(href)) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      } else {
        node.removeAttribute('target');
      }
    }
    if (node.tagName === 'INPUT' && node.getAttribute('type') !== 'checkbox') node.remove();
  });
}

export function renderMarkdown(md: string, opts: RenderOptions = {}): RenderResult {
  ensureHooks();
  const slugger = createSlugger();
  let hasMermaid = false;
  let hasCode = false;
  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({
    renderer: {
      heading(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Heading) {
        const inner = this.parser.parseInline(token.tokens);
        const id = slugger(token.text.replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_s, a: string, b: string) => b || a));
        return `<h${token.depth} id="${escapeHtml(id)}">${inner}</h${token.depth}>\n`;
      },
      code(token: Tokens.Code) {
        const lang = (token.lang ?? '').trim().split(/\s+/)[0]?.toLowerCase() ?? '';
        if (lang === 'mermaid') {
          hasMermaid = true;
          return `<pre class="mermaid-src" data-mermaid="1">${escapeHtml(token.text)}</pre>\n`;
        }
        hasCode = true;
        const cls = lang ? ` class="language-${escapeHtml(lang.replace(/[^\w+-]/g, ''))}"` : '';
        return `<pre class="code-block"><code${cls}>${escapeHtml(token.text)}</code></pre>\n`;
      },
      link(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Link) {
        let href = token.href;
        const text = this.parser.parseInline(token.tokens);
        const mdTarget = opts.linkMap?.[href.split('#')[0] ?? ''];
        if (mdTarget) href = `#/doc/${encodeURIComponent(mdTarget)}`;
        else if (/^#(?!\/)/.test(href)) href = `#/anchor/${href.slice(1)}`;
        const title = token.title ? ` title="${escapeHtml(token.title)}"` : '';
        return `<a href="${escapeHtml(href)}"${title}>${text}</a>`;
      },
    },
  });
  const raw = marked.parse(rewriteWikilinks(md, opts.exists), { async: false }) as string;
  const html = DOMPurify.sanitize(raw, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'form', 'iframe', 'object', 'embed', 'script'],
    FORBID_ATTR: ['style'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|#|\/|\.{0,2}\/|[^:]*$)/i,
  });
  return { html, hasMermaid, hasCode };
}
