import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Routes start at the top. Hash links (e.g. /#contact) scroll to
 * their target instead, so cross-page anchors keep working.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
