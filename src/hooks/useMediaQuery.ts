import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True on pointer-fine devices, where hover is a real interaction. */
export function useHasHover(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}
