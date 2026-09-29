import {
  BarChart3, Binary, BookMarked, Boxes, Brain, Briefcase, CalendarCheck, Component, Cpu, FileStack, FileText,
  FlaskConical, FolderKanban, Gauge, GraduationCap, Info, LayoutDashboard, Library, ListChecks, Map, MessageSquareText,
  MessagesSquare, Moon, Network, Puzzle, Scale, Settings, Share2, Shield, Terminal, Workflow, type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  BarChart3, Binary, BookMarked, Boxes, Brain, Briefcase, CalendarCheck, Component, Cpu, FileStack, FileText,
  FlaskConical, FolderKanban, Gauge, GraduationCap, Info, LayoutDashboard, Library, ListChecks, Map, MessageSquareText,
  MessagesSquare, Moon, Network, Puzzle, Scale, Settings, Share2, Shield, Terminal, Workflow,
};

export function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const C = ICONS[name] ?? FileText;
  return <C size={size} aria-hidden="true" />;
}
