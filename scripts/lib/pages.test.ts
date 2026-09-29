import { describe, expect, it } from 'vitest';
import { buildCsp, injectCsp, inlineScripts, stampServiceWorker } from './pages';

describe('pages build helpers', () => {
  const html = '<head>\n<meta charset="UTF-8" />\n<script>var a=1;</script>\n<script type="module" src="/x.js"></script>\n</head>';

  it('finds only inline scripts', () => {
    expect(inlineScripts(html)).toEqual(['var a=1;']);
  });

  it('builds a CSP that forbids inline/eval script but allows the hashed bootstrap', () => {
    const csp = buildCsp(['abc=']);
    expect(csp).toContain("script-src 'self' 'sha256-abc='");
    expect(csp).not.toMatch(/script-src[^;]*unsafe-(inline|eval)/);
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
  });

  it('injects the CSP meta immediately after charset, before any script', () => {
    const out = injectCsp(html, buildCsp([]));
    expect(out.indexOf('Content-Security-Policy')).toBeGreaterThan(out.indexOf('charset'));
    expect(out.indexOf('Content-Security-Policy')).toBeLessThan(out.indexOf('<script'));
  });

  it('stamps the service worker version and rejects bad input', () => {
    expect(stampServiceWorker("const VERSION = 'eos-__BUILD_ID__';", 'abc123def')).toBe("const VERSION = 'eos-abc123def';");
    expect(() => stampServiceWorker('no placeholder', 'abc123def')).toThrow(/placeholder/);
    expect(() => stampServiceWorker('__BUILD_ID__', "x'; evil")).toThrow(/invalid/);
  });
});
