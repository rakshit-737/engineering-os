import { describe, expect, it } from 'vitest';
import { renderMarkdown, rewriteWikilinks } from './markdown';

const html = (md: string, opts = {}) => renderMarkdown(md, opts).html;

describe('renderMarkdown sanitization', () => {
  it('strips event handlers from raw HTML', () => {
    const out = html('<img src="x" onerror="alert(1)"> <div onclick="alert(2)">hi</div>');
    expect(out).not.toMatch(/onerror|onclick|alert/);
  });
  it('removes script, iframe and style tags', () => {
    const out = html('<script>alert(1)</script><iframe src="https://evil"></iframe><style>body{}</style>ok');
    expect(out).not.toMatch(/<script|<iframe|<style/);
    expect(out).toContain('ok');
  });
  it('drops javascript: and data: URLs', () => {
    const out = html('[x](javascript:alert(1)) <a href="JaVaScRiPt:alert(1)">y</a> [z](data:text/html;base64,AAAA)');
    expect(out).not.toMatch(/javascript:/i);
    expect(out).not.toMatch(/data:text/);
  });
  it('makes external links open safely', () => {
    const out = html('[ext](https://example.com)');
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noopener noreferrer"');
  });
  it('keeps non-checkbox inputs out', () => {
    expect(html('<input type="text" value="x"><input type="password">')).not.toMatch(/<input/);
    expect(html('- [ ] task')).toMatch(/type="checkbox"/);
  });
});

describe('rendering features', () => {
  it('adds de-duplicated heading ids', () => {
    const out = html('## Setup\n## Setup\n### Deep `code` title');
    expect(out).toContain('id="setup"');
    expect(out).toContain('id="setup-1"');
    expect(out).toContain('id="deep-code-title"');
  });
  it('rewrites wikilinks to hash routes, marks missing ones', () => {
    const out = html('[[Hash-Tables]] [[Big O|bigo]] [[Nope]]', { exists: (s: string) => s !== 'nope' });
    expect(out).toContain('href="#/doc/hash-tables"');
    expect(out).toContain('href="#/doc/big-o"');
    expect(out).toContain('>bigo<');
    expect(out).toContain('wikilink-missing');
  });
  it('does not treat code or mermaid [[x]] as wikilinks', () => {
    const md = 'Inline `arr[[0]]` here.\n\n```mermaid\nA[[sub]] --> B\n```\n';
    const rewritten = rewriteWikilinks(md);
    expect(rewritten).toBe(md);
    const r = renderMarkdown(md);
    expect(r.hasMermaid).toBe(true);
    expect(r.html).not.toContain('#/doc/');
  });
  it('rewrites relative .md links via the link map', () => {
    expect(html('[b](../x/B.md)', { linkMap: { '../x/B.md': 'b' } })).toContain('href="#/doc/b"');
  });
  it('escapes code blocks and flags them for highlighting', () => {
    const r = renderMarkdown('```python\nprint("<b>")\n```');
    expect(r.hasCode).toBe(true);
    expect(r.html).toContain('class="language-python"');
    expect(r.html).toContain('&lt;b&gt;');
  });
});
