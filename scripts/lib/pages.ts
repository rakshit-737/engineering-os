/**
 * Pure helpers for the GitHub Pages build step (see vite.config.ts `pagesPlugin`).
 * Kept free of Node APIs so they are unit-testable under the app tsconfig.
 */

/** Inline <script> bodies (no src attribute) in an HTML document. */
export function inlineScripts(html: string): string[] {
  const out: string[] = [];
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) out.push(m[1] ?? '');
  return out;
}

/**
 * Content-Security-Policy for a static SPA with no backend.
 * - script-src: own origin + hashes of the (only) inline theme bootstrap script.
 * - style-src 'unsafe-inline': mermaid injects <style> and style="" into its SVG,
 *   React sets style props. Script execution is still fully locked down.
 * - img-src https: so external images in notes render; data: for mermaid/icons.
 * frame-ancestors / report-uri are ignored in <meta> CSP, so they are omitted.
 */
export function buildCsp(scriptHashes: string[]): string {
  const hashes = scriptHashes.map((h) => ` 'sha256-${h}'`).join('');
  return [
    "default-src 'self'",
    `script-src 'self'${hashes}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
  ].join('; ');
}

export function injectCsp(html: string, csp: string): string {
  const tag = `<meta http-equiv="Content-Security-Policy" content="${csp.replace(/"/g, '&quot;')}" />`;
  // must precede any script so it applies to them
  return html.replace(/<meta charset="UTF-8"\s*\/?>/i, (m) => `${m}\n    ${tag}`);
}

export function stampServiceWorker(sw: string, buildId: string): string {
  if (!/^[\w-]{6,64}$/.test(buildId)) throw new Error(`invalid build id ${buildId}`);
  if (!sw.includes('__BUILD_ID__')) throw new Error('sw.js is missing the __BUILD_ID__ placeholder');
  return sw.replaceAll('__BUILD_ID__', buildId);
}
