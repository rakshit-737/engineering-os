import { describe, expect, it } from 'vitest';
import { sanitizeHtml, sanitizeSvg } from './sanitize';

describe('sanitizeHtml', () => {
  it('forces target/rel on external links and strips target elsewhere', () => {
    const out = sanitizeHtml('<a href="https://x.dev">x</a><a href="#/doc/a" target="_blank">a</a>');
    expect(out).toContain('<a href="https://x.dev" target="_blank" rel="noopener noreferrer">');
    expect(out).toContain('<a href="#/doc/a">a</a>');
  });

  it('drops script URLs, handlers, styles and dangerous tags', () => {
    const out = sanitizeHtml(
      '<a href="javascript:alert(1)">j</a><a href="data:text/html,x">d</a><img src=x onerror="alert(1)"><p style="x">p</p>' +
        '<iframe src="https://e"></iframe><form><input type="text"></form><base href="https://evil/"><style>*{}</style><input type="checkbox" checked>',
    );
    expect(out).not.toMatch(/javascript:|data:|onerror|style|iframe|<form|type="text"|<base/i);
    expect(out).toContain('type="checkbox"');
  });

  it('prevents DOM clobbering via id/name', () => {
    expect(sanitizeHtml('<h2 id="location">x</h2><img name="cookie">')).not.toMatch(/id="location"|name="cookie"/);
  });
});

describe('sanitizeSvg (mermaid output)', () => {
  it('keeps mermaid styling but removes script vectors', () => {
    const out = sanitizeSvg(
      '<svg xmlns="http://www.w3.org/2000/svg"><style>.n{fill:red}</style><g onload="alert(1)"><rect style="fill:red"/></g>' +
        '<script>alert(1)</script><a href="javascript:alert(1)"><text>x</text></a><a href="https://ok.dev"><text>y</text></a></svg>',
    );
    expect(out).toContain('<style>');
    expect(out).toContain('style="fill:red"');
    expect(out).not.toMatch(/onload|<script|javascript:/);
    expect(out).toMatch(/href="https:\/\/ok\.dev"[^>]*target="_blank"|target="_blank"[^>]*href="https:\/\/ok\.dev"/);
  });
});
