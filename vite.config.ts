/// <reference types="vitest" />
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { buildCsp, injectCsp, inlineScripts, stampServiceWorker } from './scripts/lib/pages';

const sha256 = (s: string | Buffer, enc: 'base64' | 'hex') => createHash('sha256').update(s).digest(enc);

/**
 * Production-only GitHub Pages hardening:
 *  - CSP <meta> with hashes of inline scripts (dev server needs inline HMR scripts, so build only)
 *  - per-build service-worker cache version
 *  - 404.html = app shell, so mistyped deep paths still boot the app
 */
function pagesPlugin(): Plugin {
  let outDir = 'dist';
  return {
    name: 'eos-pages',
    apply: 'build',
    configResolved(c) {
      outDir = resolve(c.root, c.build.outDir);
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return injectCsp(html, buildCsp(inlineScripts(html).map((s) => sha256(s, 'base64'))));
      },
    },
    closeBundle() {
      const index = join(outDir, 'index.html');
      const sw = join(outDir, 'sw.js');
      if (!existsSync(index) || !existsSync(sw)) return;
      const h = createHash('sha256').update(readFileSync(index));
      for (const f of ['index.json', 'search.json', 'graph.json']) {
        const p = join(outDir, 'content', f);
        if (existsSync(p)) h.update(sha256(readFileSync(p), 'hex'));
      }
      writeFileSync(sw, stampServiceWorker(readFileSync(sw, 'utf8'), h.digest('hex').slice(0, 16)));
      copyFileSync(index, join(outDir, '404.html'));
    },
  };
}

// GitHub Pages serves the site from /engineering-os/. Dev server stays at '/'.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'serve' && !isPreview ? '/' : '/engineering-os/',
  plugins: [react(), pagesPlugin()],
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
  },
}));
