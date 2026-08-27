import { useEffect, useState } from 'react';

export interface NavGround {
  /** The background colour of whatever sits directly under the bar. */
  color: string;
  /** True when that ground is dark enough to need light type. */
  dark: boolean;
}

const DEFAULT: NavGround = { color: '#F4F2ED', dark: false };

function parseRgb(value: string): [number, number, number] | null {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(',').map((p) => parseFloat(p.trim()));
  if (parts.length < 3) return null;
  // Fully transparent backgrounds tell us nothing.
  if (parts.length > 3 && parts[3] === 0) return null;
  return [parts[0], parts[1], parts[2]];
}

/** Relative luminance, for deciding between ink and paper type. */
function luminance([r, g, b]: [number, number, number]): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/**
 * Samples the background directly beneath the fixed navigation so the
 * bar can tint itself to match and flip its type colour over dark
 * sections. Sampling the rendered page means new sections work without
 * being registered anywhere.
 */
export function useNavGround(navHeight = 76): NavGround {
  const [ground, setGround] = useState<NavGround>(DEFAULT);

  useEffect(() => {
    let frame = 0;

    const sample = () => {
      frame = 0;
      const x = Math.round(window.innerWidth / 2);
      const y = navHeight + 2;

      let el = document.elementFromPoint(x, y) as HTMLElement | null;
      let found: [number, number, number] | null = null;

      while (el && el !== document.documentElement) {
        // Ignore the bar itself and anything inside it.
        if (el.closest('.nav')) {
          el = el.parentElement;
          continue;
        }
        const rgb = parseRgb(getComputedStyle(el).backgroundColor);
        if (rgb) {
          found = rgb;
          break;
        }
        el = el.parentElement;
      }

      if (!found) {
        setGround((g) => (g.color === DEFAULT.color ? g : DEFAULT));
        return;
      }

      const color = `rgb(${found[0]}, ${found[1]}, ${found[2]})`;
      const dark = luminance(found) < 0.28;
      setGround((g) => (g.color === color && g.dark === dark ? g : { color, dark }));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(sample);
    };

    sample();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [navHeight]);

  return ground;
}
