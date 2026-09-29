import DOMPurify from 'dompurify';

/**
 * Single place that owns the DOMPurify configuration and hooks. Every HTML string
 * that reaches innerHTML / dangerouslySetInnerHTML must go through one of these.
 */

const SAFE_URI = /^(?:(?:https?|mailto):|#|\/|\.{0,2}\/|[^:]*$)/i;

let hooked = false;
function ensureHooks(): void {
  if (hooked) return;
  hooked = true;
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    // nodeName is lowercase for SVG <a>, uppercase for HTML <A>
    if (node.nodeName.toLowerCase() === 'a') {
      const href = node.getAttribute('href') ?? node.getAttribute('xlink:href') ?? '';
      if (/^https?:\/\//i.test(href)) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      } else {
        node.removeAttribute('target');
      }
    }
    if (node.nodeName === 'INPUT' && node.getAttribute('type') !== 'checkbox') node.remove();
  });
}

/** Markdown-rendered HTML: no styles, forms, frames, scripts; only http(s)/mailto/relative URLs. */
export function sanitizeHtml(html: string): string {
  ensureHooks();
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'form', 'iframe', 'object', 'embed', 'script', 'base', 'meta', 'link'],
    FORBID_ATTR: ['style'],
    ALLOWED_URI_REGEXP: SAFE_URI,
  });
}

/**
 * Mermaid output. Mermaid needs <style> and style attributes (hence CSP style-src
 * 'unsafe-inline'); scripts, event handlers and javascript: URLs are still removed.
 */
export function sanitizeSvg(svg: string): string {
  ensureHooks();
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true, html: true },
    ADD_TAGS: ['foreignObject'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'base'],
    ALLOWED_URI_REGEXP: SAFE_URI,
  });
}
