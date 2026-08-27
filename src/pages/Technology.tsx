import { PageHeader } from '../components/PageHeader/PageHeader';
import { TechnologyGrid } from '../components/TechnologyGrid/TechnologyGrid';
import { CategoryNav } from '../components/Navigation/CategoryNav';
import { Contact } from '../components/Contact/Contact';
import { categoryMeta, workByCategory } from '../data/work';
import { usePageMeta } from '../hooks/usePageMeta';

/* Technology is the visual grid / lab. */
export default function Technology() {
  const meta = categoryMeta.technology;
  const items = workByCategory('technology');

  usePageMeta({
    title: 'Technology — Maryam Imran',
    description:
      'AI, robotics, emerging technology and prototyping — VITA, agentic AI, Arduino and Raspberry Pi work by Maryam Imran.',
    path: '/technology',
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

      <section className="section section--flush-top" aria-label="Technology work">
        <h2 className="sr-only">Technology work</h2>
        <div className="shell">
          <TechnologyGrid items={items} />
        </div>
      </section>

      <CategoryNav current="technology" />
      <Contact />
    </>
  );
}
