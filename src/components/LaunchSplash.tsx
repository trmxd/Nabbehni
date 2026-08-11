import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { BrandLogo } from './BrandLogo';

export function LaunchSplash() {
  const { state } = useAppState();
  const [visible, setVisible] = useState(true);
  const animations = state.settings.animations && !state.settings.reduceMotion;

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), animations ? 1550 : 650);
    return () => window.clearTimeout(timer);
  }, [animations]);

  useEffect(() => {
    if (!visible) return undefined;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="يتم تشغيل نَبِّهني"
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-brand-white px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: animations ? 0.32 : 0 }}
        >
          <motion.div
            className="relative z-10 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: animations ? 18 : 0, scale: animations ? 0.96 : 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: animations ? 0.48 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={animations ? { scale: [1, 1.025, 1] } : undefined}
              transition={{ duration: 0.7, delay: 0.38, ease: 'easeInOut' }}
            >
              <BrandLogo size="large" />
            </motion.div>
            <p className="-mt-3 text-lg font-extrabold">لأن كل حرف يفرق</p>
            <div className="mt-7 h-1.5 w-32 overflow-hidden rounded-full bg-brand-gray-light" aria-hidden="true">
              <motion.div
                className="h-full rounded-full bg-brand-red"
                initial={{ width: '12%' }}
                animate={{ width: '100%' }}
                transition={{ duration: animations ? 1.05 : 0, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
          <motion.span
            className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-red-soft"
            initial={{ scale: animations ? 0.7 : 1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: animations ? 0.55 : 0 }}
            aria-hidden="true"
          />
          <motion.span
            className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full border-[24px] border-brand-gray-light"
            initial={{ scale: animations ? 0.8 : 1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: animations ? 0.6 : 0, delay: animations ? 0.08 : 0 }}
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
