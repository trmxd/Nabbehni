import { motion } from 'framer-motion';
import { Sparkle } from 'lucide-react';
import type { DetectedError } from '../types';

interface SmartWordProps {
  detection: DetectedError;
  onClick?: (anchorElement: HTMLButtonElement) => void;
  animate?: boolean;
  compact?: boolean;
  writingSurface?: boolean;
}

export function SmartWord({ detection, onClick, animate = true, compact = false, writingSurface = false }: SmartWordProps) {
  const characters = Array.from(detection.matchedText);
  const { difference } = detection;
  const targetLength = Math.max(1, Array.from(difference.incorrectSpan).length);
  const targetStart = difference.index;
  const targetEnd = targetStart + targetLength;
  const prefix = characters.slice(0, targetStart).join('');
  const target = characters.slice(targetStart, targetEnd).join('');
  const needsGap = difference.type === 'add' || difference.type === 'split';
  const suffix = characters.slice(needsGap ? targetStart : targetEnd).join('');
  const sizeClasses = writingSurface
    ? 'font-medium text-[1.35rem] sm:text-2xl'
    : `font-bold ${compact ? 'text-2xl' : 'text-[1.35rem] sm:text-2xl'}`;

  return (
    <button
      type="button"
      onClick={(event) => onClick?.(event.currentTarget)}
      data-detection-id={detection.id}
      className={`pointer-events-auto relative m-0 inline border-0 bg-transparent p-0 align-baseline text-brand-black focus-visible:outline-brand-red ${sizeClasses}`}
      style={{ textDecoration: 'none', fontFamily: 'inherit', lineHeight: 'inherit' }}
      aria-label={`مراجعة كلمة ${detection.matchedText}: هناك حرف يحتاج إلى مراجعة`}
    >
      {prefix}
      {needsGap ? (
        <span className="relative inline-block w-0" aria-label={difference.type === 'split' ? 'موضع يحتاج إلى فصل' : 'موضع يحتاج إلى حرف'}>
          <motion.span
            className="absolute bottom-[-0.1em] right-[-2px] h-[1.25em] w-1 rounded-full bg-brand-red"
            animate={animate ? { opacity: [0.35, 1, 0.35], scaleY: [0.8, 1.15, 0.8] } : undefined}
            transition={{ duration: 0.5, repeat: 2 }}
          />
        </span>
      ) : (
        <motion.span
          className={`relative rounded-md text-brand-red ${difference.type === 'remove' ? 'opacity-60' : ''}`}
          animate={animate ? {
            backgroundColor: ['var(--color-red-soft)', 'var(--color-white)', 'var(--color-red-soft)'],
            boxShadow: ['0 0 0 0 transparent', '0 0 0 6px var(--color-red-halo)', '0 0 0 0 transparent'],
          } : undefined}
          transition={{ duration: 0.55, repeat: 2 }}
        >
          {target}
        </motion.span>
      )}
      {suffix}
      <span className="absolute -left-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-brand-red text-brand-white" aria-hidden="true">
        <Sparkle size={10} />
      </span>
    </button>
  );
}
