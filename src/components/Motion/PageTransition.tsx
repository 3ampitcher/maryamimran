import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';

/**
 * A restrained crossfade between routes — enough to feel considered,
 * short enough that it never delays reading.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
