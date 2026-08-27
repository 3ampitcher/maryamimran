import { Hero } from '../components/Hero/Hero';
import { Intro } from '../components/Intro/Intro';
import { WorkHub } from '../components/WorkHub/WorkHub';
import { CrossDisciplinary } from '../components/CrossDisciplinary/CrossDisciplinary';
import { Speaking } from '../components/Speaking/Speaking';
import { Writing } from '../components/Writing/Writing';
import { Programs } from '../components/Programs/Programs';
import { Recognition } from '../components/Recognition/Recognition';
import { Now } from '../components/Now/Now';
import { Contact } from '../components/Contact/Contact';
import { IndexTeaser } from '../components/CompleteIndex/IndexTeaser';
import { usePageMeta } from '../hooks/usePageMeta';
import { site } from '../data/site';

/* ============================================================
   HOME
   ------------------------------------------------------------
   A long-scroll introduction to the whole platform. The rhythm
   alternates deliberately: portrait -> huge type -> category
   rows -> map -> horizontal gallery -> editorial list -> type
   list -> data -> dark close. No two adjacent sections share a
   layout.
   ============================================================ */

export default function Home() {
  usePageMeta({ title: site.title, description: site.description, path: '/' });

  return (
    <>
      <Hero />
      <Intro />
      <WorkHub />
      <CrossDisciplinary />
      <Speaking />
      <Writing limit={4} />
      <Programs />
      <Recognition />
      <IndexTeaser />
      <Now />
      <Contact />
    </>
  );
}
