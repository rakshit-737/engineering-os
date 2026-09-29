import { sanitizeSvg } from './sanitize';
/** Lazy post-render enhancements: syntax highlighting and mermaid diagrams. */

type HljsCore = typeof import('highlight.js/lib/core').default;
let hljsPromise: Promise<HljsCore> | null = null;

function loadHljs(): Promise<HljsCore> {
  hljsPromise ??= (async () => {
    const [core, py, java, cpp, ts, js, bash, sql, yaml, json] = await Promise.all([
      import('highlight.js/lib/core'),
      import('highlight.js/lib/languages/python'),
      import('highlight.js/lib/languages/java'),
      import('highlight.js/lib/languages/cpp'),
      import('highlight.js/lib/languages/typescript'),
      import('highlight.js/lib/languages/javascript'),
      import('highlight.js/lib/languages/bash'),
      import('highlight.js/lib/languages/sql'),
      import('highlight.js/lib/languages/yaml'),
      import('highlight.js/lib/languages/json'),
    ]);
    const h = core.default;
    h.registerLanguage('python', py.default);
    h.registerLanguage('java', java.default);
    h.registerLanguage('cpp', cpp.default);
    h.registerLanguage('typescript', ts.default);
    h.registerLanguage('javascript', js.default);
    h.registerLanguage('bash', bash.default);
    h.registerLanguage('sql', sql.default);
    h.registerLanguage('yaml', yaml.default);
    h.registerLanguage('json', json.default);
    h.registerAliases(['py'], { languageName: 'python' });
    h.registerAliases(['c++', 'c', 'cc', 'h', 'hpp'], { languageName: 'cpp' });
    h.registerAliases(['ts', 'tsx'], { languageName: 'typescript' });
    h.registerAliases(['js', 'jsx', 'mjs'], { languageName: 'javascript' });
    h.registerAliases(['sh', 'shell', 'zsh', 'console'], { languageName: 'bash' });
    h.registerAliases(['yml'], { languageName: 'yaml' });
    return h;
  })();
  return hljsPromise;
}

export async function highlightWithin(root: HTMLElement): Promise<void> {
  const blocks = root.querySelectorAll<HTMLElement>('pre.code-block code[class*="language-"]');
  if (!blocks.length) return;
  const h = await loadHljs();
  blocks.forEach((el) => {
    const lang = /language-([\w+-]+)/.exec(el.className)?.[1];
    if (!lang || !h.getLanguage(lang) || el.dataset.highlighted) return;
    // highlight.js escapes input; output only contains its own span markup
    h.highlightElement(el);
  });
}

let mermaidCounter = 0;
export async function renderMermaidWithin(root: HTMLElement, theme: 'dark' | 'default'): Promise<void> {
  const blocks = root.querySelectorAll<HTMLElement>('pre[data-mermaid], .mermaid-diagram[data-src]');
  if (!blocks.length) return;
  const mermaid = (await import('mermaid')).default;
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme, fontFamily: 'inherit' });
  for (const el of Array.from(blocks)) {
    const src = el.dataset.src ?? el.textContent ?? '';
    el.dataset.src = src;
    try {
      const { svg } = await mermaid.render(`mmd-${++mermaidCounter}`, src);
      const fig = document.createElement('div');
      fig.className = 'mermaid-diagram';
      fig.setAttribute('role', 'img');
      fig.setAttribute('aria-label', 'Diagram');
      fig.dataset.src = src;
      // mermaid runs with securityLevel 'strict'; sanitize again as defence in depth
      fig.innerHTML = sanitizeSvg(svg);
      el.replaceWith(fig);
    } catch {
      el.classList.add('mermaid-error');
      el.setAttribute('title', 'Diagram failed to render; showing source');
    }
  }
}
