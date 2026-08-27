import { PageHeader } from '../components/PageHeader/PageHeader';
import { CompleteIndex } from '../components/CompleteIndex/CompleteIndex';
import { Contact } from '../components/Contact/Contact';
import { indexWork } from '../data/work';
import { usePageMeta } from '../hooks/usePageMeta';

/* The permanent archive. */
export default function IndexPage() {
  usePageMeta({
    title: 'Everything — Maryam Imran',
    description:
      'The complete index of projects, roles, programs, talks, writing, competitions and work by Maryam Imran.',
    path: '/index',
  });

  return (
    <>
      <PageHeader
        index="—"
        kicker="Index"
        title="Everything."
        blurb="Projects, roles, programs, talks, writing, competitions and things I’ve worked on."
        count={indexWork.length}
      />

      <section className="section section--flush-top" aria-label="Complete index">
        <h2 className="sr-only">All work</h2>
        <div className="shell">
          <CompleteIndex />
        </div>
      </section>

      <Contact />
    </>
  );
}
