import type { CSSProperties, ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import './Reveal.css';

/* ============================================================
   MOTION VOCABULARY — deliberately small.

   1. MaskReveal  — text rises out of a clipped container
   2. Reveal      — a quiet lift for blocks
   3. ImageScale  — 1.04 -> 1.00 (lives in Media/Figure)

   Both primitives are an IntersectionObserver plus a CSS
   transition. Under prefers-reduced-motion they render in their
   final state and never transition, so the page is complete and
   correct with animation switched off.
   ============================================================ */

interface RevealProps {
  children: ReactNode;
  /** Seconds. */
  delay?: number;
  className?: string;
  /** Distance travelled, in px. */
  y?: number;
  as?: 'div' | 'span' | 'li' | 'section';
}

export function Reveal({ children, delay = 0, className = '', y = 24, as: Tag = 'div' }: RevealProps) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '0px 0px -12% 0px' });

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  const style: CSSProperties = {
    ['--reveal-delay' as string]: `${delay}s`,
    ['--reveal-y' as string]: `${y}px`,
  };

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------
   MaskReveal — a line of type uncovered by a clipped box.
   ------------------------------------------------------------ */

interface MaskRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  innerClassName?: string;
  /** Plays on mount instead of on scroll (hero use). */
  onMount?: boolean;
}

export function MaskReveal({
  children,
  delay = 0,
  className = '',
  innerClassName = '',
  onMount = false,
}: MaskRevealProps) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>({ rootMargin: '0px 0px -8% 0px' });

  if (reduced) {
    return (
      <span className={`maskreveal maskreveal--static ${className}`}>
        <span className={innerClassName}>{children}</span>
      </span>
    );
  }

  const shown = onMount || inView;

  return (
    <span
      ref={onMount ? undefined : ref}
      className={`maskreveal ${shown ? 'is-in' : ''} ${className}`}
      style={{ ['--reveal-delay' as string]: `${delay}s` }}
    >
      <span className={`maskreveal__inner ${innerClassName}`}>{children}</span>
    </span>
  );
}

/** Convenience wrapper for hero lines that should play immediately. */
export function MaskRevealOnMount(props: Omit<MaskRevealProps, 'onMount'>) {
  return <MaskReveal {...props} onMount />;
}
