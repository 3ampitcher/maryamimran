import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navigation } from './components/Navigation/Navigation';
import { Footer } from './components/Footer/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { PageTransition } from './components/Motion/PageTransition';
import Home from './pages/Home';

/* Route-level code splitting — the home page ships in the first chunk,
   everything else loads on navigation. */
const Business = lazy(() => import('./pages/Business'));
const Technology = lazy(() => import('./pages/Technology'));
const Impact = lazy(() => import('./pages/Impact'));
const IndexPage = lazy(() => import('./pages/Index'));
const Writing = lazy(() => import('./pages/Writing'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));

export function App() {
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          // Move focus as well as scroll — and keep the link working under
          // HashRouter, where a bare "#main" would be read as a route.
          e.preventDefault();
          const main = document.getElementById('main');
          if (!main) return;
          main.setAttribute('tabindex', '-1');
          main.focus({ preventScroll: true });
          main.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Navigation />

      <main id="main">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/business"
              element={
                <PageTransition>
                  <Business />
                </PageTransition>
              }
            />
            <Route
              path="/technology"
              element={
                <PageTransition>
                  <Technology />
                </PageTransition>
              }
            />
            <Route
              path="/impact"
              element={
                <PageTransition>
                  <Impact />
                </PageTransition>
              }
            />
            <Route
              path="/index"
              element={
                <PageTransition>
                  <IndexPage />
                </PageTransition>
              }
            />
            <Route
              path="/writing"
              element={
                <PageTransition>
                  <Writing />
                </PageTransition>
              }
            />
            <Route
              path="/about"
              element={
                <PageTransition>
                  <About />
                </PageTransition>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

/** Holds the viewport height so lazy routes don't collapse the page. */
function RouteFallback() {
  return <div style={{ minHeight: '80vh' }} aria-busy="true" aria-live="polite" />;
}
