/** Normalise a note name / wikilink target into a slug. */
export function toSlug(name: string): string {
  return name
    .trim()
    .replace(/\.md$/i, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

/** GitHub-like heading id. Must match between build script and renderer. */
export function headingId(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/[`*_~[\]()]/g, '')
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-') || 'section'
  );
}

/** Stateful slugger that de-duplicates ids within one document. */
export function createSlugger() {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = headingId(text);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  };
}
