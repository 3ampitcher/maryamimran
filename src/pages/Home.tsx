import { Hero } from '../components/Hero/Hero';
import { Intro } from '../components/Intro/Intro';
import { WorkHub } from '../components/WorkHub/WorkHub';
import { Speaking } from '../components/Speaking/Speaking';
import { Contact } from '../components/Contact/Contact';
import { usePageMeta } from '../hooks/usePageMeta';
import { site } from '../data/site';

/* ============================================================
   HOME
   ------------------------------------------------------------
   Five movements, nothing else:

     hero -> intro -> business / technology / impact
          -> speaking -> contact

   Writing, Programs, Recognition and the full archive all still
   exist — they live on /writing, /about and /index rather than
   competing for attention here. Nothing was deleted to get this
   shorter; it was relocated.
   ============================================================ */

export default function Home() {
  usePageMeta({ title: site.title, description: site.description, path: '/' });

  return (
    <>
      <Hero />
      <Intro />
      <WorkHub />
      <Speaking />
      <Contact />
    </>
  );
}
