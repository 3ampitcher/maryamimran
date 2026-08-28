import { AboutQuote } from '../components/About/AboutQuote';
import { About as AboutSection } from '../components/About/About';
import { Education } from '../components/About/Education';
import { Proof } from '../components/About/Proof';
import { Programs } from '../components/Programs/Programs';
import { ResumeBlock } from '../components/About/ResumeBlock';
import { Contact } from '../components/Contact/Contact';
import { usePageMeta } from '../hooks/usePageMeta';

/* ============================================================
   ABOUT
   ------------------------------------------------------------
   The quote, then the person, then the formal background that
   used to sit on the homepage: education, recognition, programs
   and the resume. This is where someone goes when they want the
   credentials, so this is where the credentials live.
   ============================================================ */

export default function About() {
  usePageMeta({
    title: 'About — Maryam Imran',
    description:
      'Maryam Imran is a Business Analytics & Information Systems student in Jeddah working across business, technology and impact.',
    path: '/about',
  });

  return (
    <>
      <h1 className="sr-only">About Maryam Imran</h1>
      <AboutQuote />
      <AboutSection />
      <Education />
      <Proof />
      <Programs />
      <ResumeBlock />
      <Contact />
    </>
  );
}
