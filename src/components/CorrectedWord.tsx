import { motion } from 'framer-motion';

export function CorrectedWord({
  oldWord,
  newWord,
  animate = true,
  compact = false,
}: {
  oldWord: string;
  newWord: string;
  animate?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`relative inline-grid place-items-center bg-brand-gray-light font-extrabold ${compact ? 'min-h-11 min-w-24 rounded-xl px-4 py-1.5 text-2xl' : 'min-h-14 min-w-28 rounded-2xl px-5 py-2 text-3xl'}`} aria-label={`تحولت ${oldWord} إلى ${newWord}`}>
      <motion.span
        className="absolute text-brand-gray-text"
        initial={{ opacity: 0.42, y: 0 }}
        animate={{ opacity: 0, y: animate ? -5 : 0 }}
        transition={{ duration: animate ? 0.45 : 0 }}
      >
        {oldWord}
      </motion.span>
      <motion.span
        className="relative text-brand-black"
        initial={{ opacity: 0, y: animate ? 5 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animate ? 0.35 : 0, delay: animate ? 0.12 : 0 }}
      >
        {newWord}
      </motion.span>
    </div>
  );
}
