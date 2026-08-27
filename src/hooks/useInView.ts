import { useEffect, useRef, useState } from 'react';

interface Options {
  /** Stop observing after the first intersection. */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/**
 * A plain IntersectionObserver in-view flag.
 *
 * The reveal primitives use this rather than a library's viewport
 * detection so the trigger is one small, predictable piece of code —
 * and so elements are visible by default if IO is unavailable.
 */
export function useInView<T extends HTMLElement>({
  once = true,
  rootMargin = '0px 0px -10% 0px',
  threshold = 0,
}: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver: show everything rather than hide it.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}
