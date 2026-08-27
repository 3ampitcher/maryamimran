import { AboutQuote } from '../components/About/AboutQuote';
import { About as AboutSection } from '../components/About/About';
import { Now } from '../components/Now/Now';
import { Recognition } from '../components/Recognition/Recognition';
import { Contact } from '../components/Contact/Contact';
import { usePageMeta } from '../hooks/usePageMeta';

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
      <Recognition />
      <Now />
      <Contact />
    </>
  );
}
