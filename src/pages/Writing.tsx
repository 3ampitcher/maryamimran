import { PageHeader } from '../components/PageHeader/PageHeader';
import { Writing as WritingSection } from '../components/Writing/Writing';
import { Contact } from '../components/Contact/Contact';
import { writingSorted } from '../data/writing';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Writing() {
  usePageMeta({
    title: 'Writing — Maryam Imran',
    description:
      'Writing by Maryam Imran on ambition, building things early, entrepreneurship, student leadership and learning publicly.',
    path: '/writing',
  });

  return (
    <>
      <PageHeader
        index="—"
        kicker="Writing"
        title="Writing."
        blurb="Short pieces, mostly written to work something out rather than to conclude it."
        count={writingSorted.length}
      />

      <WritingSection showQuote sectionIndex="—" heading="All pieces" />
      <Contact />
    </>
  );
}
