export interface NavItem {
  label: string;
  to: string;
  icon: string;
  keywords?: string;
}
export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  { items: [
    { label: 'Dashboard', to: '/', icon: 'LayoutDashboard', keywords: 'home overview' },
    { label: 'Today', to: '/today', icon: 'CalendarCheck', keywords: 'plan daily' },
  ] },
  { title: 'Knowledge', items: [
    { label: 'All knowledge', to: '/knowledge', icon: 'Library', keywords: 'docs browse' },
    { label: 'CS Core', to: '/cs-core', icon: 'Cpu' },
    { label: 'Cybersecurity', to: '/cybersecurity', icon: 'Shield', keywords: 'security' },
    { label: 'AI', to: '/ai', icon: 'Brain', keywords: 'ml llm machine learning' },
    { label: 'Systems', to: '/system-design', icon: 'Network', keywords: 'distributed hld' },
    { label: 'Developer', to: '/domain/developer', icon: 'Terminal', keywords: 'tooling cheat sheets' },
  ] },
  { title: 'Build', items: [
    { label: 'Projects', to: '/projects', icon: 'FolderKanban', keywords: 'project lab' },
    { label: 'System Design', to: '/system-design', icon: 'Boxes', keywords: 'hld case study' },
    { label: 'LLD', to: '/lld', icon: 'Component', keywords: 'low level design oop gof' },
    { label: 'Patterns', to: '/domain/patterns', icon: 'Puzzle' },
  ] },
  { title: 'Code', items: [
    { label: 'DSA', to: '/dsa', icon: 'Binary', keywords: 'algorithms leetcode' },
    { label: 'Libraries', to: '/knowledge?type=cheatsheet', icon: 'BookMarked', keywords: 'python java c++ stl cheat sheet' },
  ] },
  { title: 'Research', items: [{ label: 'Research', to: '/research', icon: 'FlaskConical', keywords: 'papers experiments' }] },
  { title: 'Academic', items: [{ label: 'Academic', to: '/academic', icon: 'GraduationCap', keywords: 'courses cgpa exams' }] },
  { title: 'Career', items: [
    { label: 'Roadmaps', to: '/knowledge?type=roadmap', icon: 'Map' },
    { label: 'Applications', to: '/career', icon: 'Briefcase', keywords: 'jobs tracker' },
    { label: 'Interviews', to: '/domain/career', icon: 'MessagesSquare' },
  ] },
  { title: 'Tools', items: [
    { label: 'Command Center', to: '/command-center', icon: 'Gauge', keywords: 'tasks goals habits journal' },
    { label: 'Checklists', to: '/checklists', icon: 'ListChecks' },
    { label: 'Templates', to: '/knowledge?type=template', icon: 'FileStack' },
    { label: 'Prompts', to: '/domain/prompts', icon: 'MessageSquareText' },
    { label: 'Automation', to: '/domain/automation', icon: 'Workflow' },
    { label: 'ADRs', to: '/domain/adr', icon: 'Scale', keywords: 'decision records' },
    { label: 'Graph', to: '/graph', icon: 'Share2', keywords: 'knowledge graph' },
    { label: 'Metrics', to: '/metrics', icon: 'BarChart3' },
    { label: 'Settings', to: '/settings', icon: 'Settings', keywords: 'export import reset theme' },
  ] },
  { items: [{ label: 'About', to: '/about', icon: 'Info', keywords: 'philosophy' }] },
];

export const ALL_NAV: NavItem[] = (() => {
  const seen = new Set<string>();
  return NAV.flatMap((g) => g.items).filter((i) => (seen.has(i.label) ? false : (seen.add(i.label), true)));
})();
