import { PageHeader } from '../components/ui';

export const PRINCIPLES = [
  'Build instead of merely consuming.',
  'Document instead of relying on memory.',
  'Automate repeated work.',
  'Understand systems deeply.',
  'Prefer fundamentals over hype.',
  'Learn by implementation.',
  'Treat security as an engineering property.',
  'Treat AI as an engineering tool, not a substitute for understanding.',
  'Every project should teach something.',
  'Every repeated task should become a system.',
];

export default function About() {
  return (
    <>
      <PageHeader
        title="About Engineering OS"
        description="A personal engineering operating system: Markdown notes as the source of truth, with a static interface for learning, building, research and career work."
      />
      <section className="card">
        <div className="card-title">Philosophy</div>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          {PRINCIPLES.map((p) => <li key={p}>{p}</li>)}
        </ol>
      </section>
      <section className="section prose" style={{ fontSize: 14 }}>
        <h2>How it works</h2>
        <p>
          Every note lives as Markdown in the repository. A build step extracts frontmatter, links and headings into JSON; this site
          reads that JSON. Your progress, projects and logs stay in your browser’s localStorage — nothing is sent anywhere. Use
          Settings → Export to back it up.
        </p>
        <p>
          Source: <a href="https://github.com/rakshit-737/engineering-os" target="_blank" rel="noopener noreferrer">github.com/rakshit-737/engineering-os</a>
        </p>
      </section>
    </>
  );
}
