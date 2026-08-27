import { PageHeader } from '../components/PageHeader/PageHeader';
import { ImpactStack } from '../components/ImpactStack/ImpactStack';
import { CategoryNav } from '../components/Navigation/CategoryNav';
import { Contact } from '../components/Contact/Contact';
import { categoryMeta, workByCategory } from '../data/work';
import { usePageMeta } from '../hooks/usePageMeta';

/* Impact is the sticky stacking chapter experience. */
export default function Impact() {
  const meta = categoryMeta.impact;
  const items = workByCategory('impact');

  usePageMeta({
    title: 'Impact — Maryam Imran',
    description:
      'Sustainability, leadership, community and institutional work — UBT Sustainability Club, Think Sustainability and UI GreenMetric reporting by Maryam Imran.',
    path: '/impact',
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

      <h2 className="sr-only">Impact chapters</h2>
      <ImpactStack items={items} />

      <CategoryNav current="impact" />
      <Contact />
    </>
  );
}
