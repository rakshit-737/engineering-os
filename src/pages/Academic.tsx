import type { AcademicItem, Course } from '../types';
import { setSlice, useAppState } from '../lib/store';
import { newId } from '../lib/storage';
import { cgpa, GRADE_POINTS } from '../lib/progress';
import { CrudTable, type FieldDef } from '../components/CrudTable';
import { PageHeader } from '../components/ui';
import { Link } from 'react-router-dom';

const COURSE_FIELDS: FieldDef<Course>[] = [
  { key: 'semester', label: 'Semester', kind: 'text', inTable: true },
  { key: 'code', label: 'Code', kind: 'text', inTable: true },
  { key: 'name', label: 'Course', kind: 'text', required: true, inTable: true },
  { key: 'credits', label: 'Credits', kind: 'number', inTable: true },
  { key: 'grade', label: 'Grade (O, A+, A… or 0–10)', kind: 'text', inTable: true },
];

const ITEM_FIELDS: FieldDef<AcademicItem>[] = [
  { key: 'kind', label: 'Kind', kind: 'select', options: ['exam', 'assignment', 'lab'], inTable: true },
  { key: 'course', label: 'Course', kind: 'text', inTable: true },
  { key: 'title', label: 'Title', kind: 'text', required: true, inTable: true },
  { key: 'due', label: 'Due', kind: 'date', inTable: true },
  { key: 'status', label: 'Status', kind: 'select', options: ['pending', 'submitted', 'graded'], inTable: true },
];

export default function Academic() {
  const courses = useAppState((s) => s.courses);
  const items = useAppState((s) => s.academicItems);
  const all = cgpa(courses);
  const bySem = new Map<string, Course[]>();
  for (const c of courses) {
    const k = c.semester || 'Unassigned';
    bySem.set(k, [...(bySem.get(k) ?? []), c]);
  }
  return (
    <>
      <PageHeader
        title="Academic"
        description={<>Courses, exams and assignments, with a credit-weighted CGPA calculator (10-point scale). Study systems live in the <Link to="/domain/academic">academic notes</Link>.</>}
      />
      <div className="grid grid-3" style={{ marginBottom: 20 }}>
        <div className="card"><div className="subtle">CGPA</div><div className="stat">{all.cgpa ?? '—'}</div></div>
        <div className="card"><div className="subtle">Graded credits</div><div className="stat">{all.credits}</div></div>
        <div className="card">
          <div className="subtle">SGPA by semester</div>
          {bySem.size ? [...bySem].map(([s, list]) => (
            <div key={s} className="row" style={{ justifyContent: 'space-between' }}><span>{s}</span><strong>{cgpa(list).cgpa ?? '—'}</strong></div>
          )) : <span className="subtle">Add courses to compute.</span>}
        </div>
      </div>
      <h2 className="section-title">Courses</h2>
      <CrudTable
        noun="course" items={courses} fields={COURSE_FIELDS} defaultSort="semester"
        onChange={(l) => setSlice('courses', l)}
        makeEmpty={(): Course => ({ id: newId(), code: '', name: '', credits: 3, grade: '', semester: '', createdAt: new Date().toISOString() })}
        empty={{ title: 'No courses', text: `Add courses with credits and grades. Letter grades map to ${Object.entries(GRADE_POINTS).map(([g, p]) => `${g}=${p}`).join(', ')}.` }}
      />
      <section className="section">
        <h2 className="section-title">Exams, assignments & labs</h2>
        <CrudTable
          noun="item" items={items} fields={ITEM_FIELDS} filterField="kind" defaultSort="due"
          onChange={(l) => setSlice('academicItems', l)}
          makeEmpty={(): AcademicItem => ({ id: newId(), kind: 'assignment', course: '', title: '', due: '', status: 'pending', createdAt: new Date().toISOString() })}
          empty={{ title: 'Nothing due', text: 'Track exams, assignments and lab records with due dates so they sort to the top.' }}
        />
      </section>
    </>
  );
}
