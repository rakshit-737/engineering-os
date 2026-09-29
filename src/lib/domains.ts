export interface DomainInfo {
  id: string;
  label: string;
  /** Pulse bucket shown on the dashboard */
  pulse: 'build' | 'learn' | 'research' | 'career' | 'academic' | 'other';
  color: string;
  blurb: string;
}

export const DOMAINS: DomainInfo[] = [
  { id: 'cs-core', label: 'CS Core', pulse: 'learn', color: '#3b82f6', blurb: 'Operating systems, networks, DBMS, architecture, algorithms.' },
  { id: 'dsa', label: 'DSA', pulse: 'learn', color: '#8b5cf6', blurb: 'Algorithm patterns and worked problems.' },
  { id: 'system-design', label: 'System Design', pulse: 'build', color: '#0ea5e9', blurb: 'HLD concepts and case studies.' },
  { id: 'lld', label: 'LLD', pulse: 'build', color: '#14b8a6', blurb: 'Object-oriented design, SOLID and GoF patterns.' },
  { id: 'ai', label: 'AI / ML', pulse: 'learn', color: '#ec4899', blurb: 'ML fundamentals and LLM engineering.' },
  { id: 'cybersecurity', label: 'Cybersecurity', pulse: 'learn', color: '#ef4444', blurb: 'Security knowledge, playbooks and labs.' },
  { id: 'projects', label: 'Projects', pulse: 'build', color: '#f59e0b', blurb: 'Project lab, templates and maturity model.' },
  { id: 'patterns', label: 'Patterns', pulse: 'build', color: '#10b981', blurb: 'Reusable engineering patterns.' },
  { id: 'developer', label: 'Developer', pulse: 'build', color: '#64748b', blurb: 'Tooling, cheat sheets, dev templates.' },
  { id: 'research', label: 'Research', pulse: 'research', color: '#a855f7', blurb: 'Research workflow and templates.' },
  { id: 'academic', label: 'Academic', pulse: 'academic', color: '#84cc16', blurb: 'Courses, exams and study systems.' },
  { id: 'career', label: 'Career', pulse: 'career', color: '#f97316', blurb: 'Roadmaps, resume, interviews.' },
  { id: 'checklists', label: 'Checklists', pulse: 'other', color: '#06b6d4', blurb: 'Engineering checklists.' },
  { id: 'adr', label: 'ADRs', pulse: 'other', color: '#78716c', blurb: 'Architecture decision records.' },
  { id: 'prompts', label: 'Prompts', pulse: 'other', color: '#d946ef', blurb: 'Prompt library.' },
  { id: 'automation', label: 'Automation', pulse: 'build', color: '#22c55e', blurb: 'Scripts and CI templates.' },
  { id: 'command-center', label: 'Command Center', pulse: 'other', color: '#6366f1', blurb: 'Dashboards, reviews, goals, journals.' },
];

const byId = new Map(DOMAINS.map((d) => [d.id, d]));

export function domainInfo(id: string): DomainInfo {
  return byId.get(id) ?? { id, label: id, pulse: 'other', color: '#94a3b8', blurb: '' };
}

export function humanize(s: string): string {
  if (!s) return '';
  return s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Top-level folder number -> domain. */
const FOLDER_DOMAINS: Record<string, string> = {
  '00': 'command-center', '02': 'prompts', '03': 'dsa', '04': 'academic', '05': 'research',
  '06': 'cybersecurity', '07': 'developer', '08': 'automation', '09': 'ai', '10': 'career',
  '11': 'projects', '12': 'system-design', '13': 'patterns', '14': 'checklists', '15': 'adr', '16': 'projects',
};

/** Infer domain from a repo-relative path like `01-Obsidian-Vault/10-CS-Core/Foo.md`. */
export function inferDomain(relPath: string): string {
  const parts = relPath.split(String.fromCharCode(92)).join('/').split('/');
  const top = parts[0] ?? '';
  const num = top.slice(0, 2);
  if (num === '01') {
    const sub = (parts[1] ?? '').toLowerCase();
    if (/cs-core/.test(sub)) return 'cs-core';
    if (/cyber/.test(sub)) return 'cybersecurity';
    if (/ai|ml/.test(sub)) return 'ai';
    if (/interview/.test(sub)) return 'dsa';
    if (/research/.test(sub)) return 'research';
    if (/cheat/.test(sub)) return 'developer';
    return 'command-center';
  }
  if (num === '12' && parts.length > 2 && (parts[1] ?? '').toLowerCase() === 'lld') return 'lld';
  return FOLDER_DOMAINS[num] ?? 'command-center';
}
