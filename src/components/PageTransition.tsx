import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useAppState } from '../hooks/useAppState';

export function PageTransition({ children, transitionKey = 'screen' }: { children: ReactNode; transitionKey?: string }) {
  const { state } = useAppState();
  const animations = state.settings.animations && !state.settings.reduceMotion;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        className={animations ? 'page-motion-content' : undefined}
        initial={{ opacity: 0, y: animations ? 16 : 0, scale: animations ? 0.992 : 1, filter: animations ? 'blur(3px)' : 'blur(0px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: animations ? -8 : 0, filter: animations ? 'blur(2px)' : 'blur(0px)' }}
        transition={{ duration: animations ? 0.36 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
