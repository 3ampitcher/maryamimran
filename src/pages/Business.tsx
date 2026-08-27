import { PageHeader } from '../components/PageHeader/PageHeader';
import { WorkIndex } from '../components/WorkIndex/WorkIndex';
import { CategoryNav } from '../components/Navigation/CategoryNav';
import { Contact } from '../components/Contact/Contact';
import { categoryMeta, workByCategory } from '../data/work';
import { usePageMeta } from '../hooks/usePageMeta';

/* Business is the interactive index experience. */
export default function Business() {
  const meta = categoryMeta.business;
  const items = workByCategory('business');

  usePageMeta({
    title: 'Business — Maryam Imran',
    description:
      'Startups, analytics, entrepreneurship, marketing and strategy — Tiin, operations, competitions and marketing work by Maryam Imran.',
    path: '/business',
  });

  return (
    <>
      <PageHeader
        index={meta.index}
        title={meta.title}
        disciplines={meta.disciplines}
        blurb={meta.blurb}
        count={items.length}
      />

      <section className="section section--flush-top" aria-label="Business work">
        <h2 className="sr-only">Business work</h2>
        <div className="shell">
          <WorkIndex items={items} />
        </div>
      </section>

      <CategoryNav current="business" />
      <Contact />
    </>
  );
}
