import { AnimatePresence, motion } from 'framer-motion';
import { Check, Lightbulb, RotateCcw, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { DetectedError } from '../types';
import { isCorrectChoice } from '../utils/detector';
import { CorrectedWord } from './CorrectedWord';
import { SmartWord } from './SmartWord';

interface WordLensProps {
  detection: DetectedError | null;
  anchorElement?: HTMLElement | null;
  onClose: () => void;
  onSolved: (attempts: number) => void;
  animations?: boolean;
  lockOpen?: boolean;
}

interface PopoverPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  arrowLeft: number;
  placement: 'above' | 'below' | 'center';
}

function getQuestion(detection: DetectedError) {
  const interaction = detection.record.interaction;
  if (interaction === 'remove-character') return 'أي خطوة تجعل الكلمة أدق؟';
  if (interaction === 'split-words') return 'كيف نكتب العبارة بوضوح؟';
  if (interaction === 'select-form') return 'أي صيغة تبدو لك صحيحة؟';
  if (detection.difference.type === 'add') return 'أي حرف تحتاج إليه الكلمة؟';
  return detection.difference.index >= Array.from(detection.matchedText).length - 1
    ? 'أي حرف يناسب نهاية الكلمة؟'
    : 'أي حرف يناسب هذا الموضع؟';
}

function getChoices(detection: DetectedError) {
  if (detection.record.interaction === 'remove-character') {
    return [
      { value: 'remove', label: `أحذف «${detection.difference.incorrectSpan}» الزائدة` },
      { value: 'keep', label: 'أُبقي الكلمة كما هي' },
    ];
  }
  return (detection.record.choices ?? [detection.record.correct, detection.record.incorrect])
    .map((choice) => ({ value: choice, label: choice }));
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function WordLens({
  detection,
  anchorElement,
  onClose,
  onSolved,
  animations = true,
  lockOpen = false,
}: WordLensProps) {
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'try-again' | 'correct'>('idle');
  const [showExamples, setShowExamples] = useState(false);
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setAttempts(0);
    setFeedback('idle');
    setShowExamples(false);
    setPosition(null);
  }, [detection?.id]);

  useEffect(() => {
    if (!detection) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !lockOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [detection, lockOpen, onClose]);

  useLayoutEffect(() => {
    if (!detection) return undefined;

    const updatePosition = () => {
      const panel = panelRef.current;
      if (!panel) return;

      const margin = 12;
      const gap = 12;
      const width = Math.min(332, window.innerWidth - margin * 2);
      const panelHeight = Math.min(panel.offsetHeight, window.innerHeight - margin * 2);
      const anchor = anchorElement?.isConnected ? anchorElement.getBoundingClientRect() : null;

      if (!anchor) {
        setPosition({
          top: Math.max(margin, (window.innerHeight - panelHeight) / 2),
          left: Math.max(margin, (window.innerWidth - width) / 2),
          width,
          maxHeight: window.innerHeight - margin * 2,
          arrowLeft: width / 2,
          placement: 'center',
        });
        return;
      }

      const anchorCenter = anchor.left + anchor.width / 2;
      const left = clamp(anchorCenter - width / 2, margin, window.innerWidth - width - margin);
      const availableAbove = Math.max(120, anchor.top - gap - margin);
      const availableBelow = Math.max(120, window.innerHeight - anchor.bottom - gap - margin);
      const fitsAbove = availableAbove >= panelHeight;
      const fitsBelow = availableBelow >= panelHeight;
      const placement = fitsAbove || (!fitsBelow && availableAbove >= availableBelow) ? 'above' : 'below';
      const maxHeight = placement === 'above' ? availableAbove : availableBelow;
      const visiblePanelHeight = Math.min(panelHeight, maxHeight);
      const preferredTop = placement === 'above' ? anchor.top - visiblePanelHeight - gap : anchor.bottom + gap;
      const top = clamp(preferredTop, margin, Math.max(margin, window.innerHeight - visiblePanelHeight - margin));

      setPosition({
        top,
        left,
        width,
        maxHeight,
        arrowLeft: clamp(anchorCenter - left, 22, width - 22),
        placement,
      });
    };

    updatePosition();
    panelRef.current?.focus({ preventScroll: true });
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updatePosition);
    if (panelRef.current) observer?.observe(panelRef.current);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      observer?.disconnect();
    };
  }, [anchorElement, detection, feedback, showExamples]);

  const choices = useMemo(() => detection ? getChoices(detection) : [], [detection]);
  if (!detection || typeof document === 'undefined') return null;

  const choicesAreShort = choices.every((choice) => Array.from(choice.label).length <= 4);
  const choiceGrid = choices.length === 3 && choicesAreShort
    ? 'grid-cols-3'
    : choices.length === 2 && choicesAreShort
      ? 'grid-cols-2'
      : 'grid-cols-1';

  const choose = (choice: string) => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setFeedback(isCorrectChoice(detection.record, choice) ? 'correct' : 'try-again');
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-brand-black/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: animations ? 0.16 : 0 }}
        onMouseDown={(event) => {
          if (!lockOpen && event.target === event.currentTarget) onClose();
        }}
      >
        <motion.section
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="word-lens-title"
          tabIndex={-1}
          className="fixed max-h-[calc(100vh-24px)] overflow-y-auto rounded-[22px] border border-brand-gray-border bg-brand-white p-4 shadow-soft outline-none"
          style={{
            top: position?.top ?? 12,
            left: position?.left ?? 12,
            width: position?.width ?? 'calc(100vw - 24px)',
            maxHeight: position?.maxHeight ?? 'calc(100vh - 24px)',
            visibility: position ? 'visible' : 'hidden',
          }}
          initial={{ opacity: 0, y: animations ? 7 : 0, scale: animations ? 0.97 : 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: animations ? 5 : 0, scale: animations ? 0.98 : 1 }}
          transition={{ duration: animations ? 0.22 : 0, ease: 'easeOut' }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {position && position.placement !== 'center' && (
            <span
              aria-hidden="true"
              className={`absolute h-3 w-3 rotate-45 border-brand-gray-border bg-brand-white ${position.placement === 'above' ? '-bottom-1.5 border-b border-r' : '-top-1.5 border-l border-t'}`}
              style={{ left: position.arrowLeft - 6 }}
            />
          )}

          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-brand-red">عدسة الكلمة</div>
              <h2 id="word-lens-title" className="text-base font-extrabold">جرّب إصلاح الحرف بنفسك</h2>
            </div>
            {!lockOpen && (
              <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-gray-light" aria-label="إغلاق عدسة الكلمة">
                <X size={18} />
              </button>
            )}
          </div>

          {feedback !== 'correct' ? (
            <>
              <div className="mb-3 grid min-h-16 place-items-center rounded-xl border border-brand-gray-border bg-brand-gray-light px-3 py-3">
                <SmartWord detection={detection} animate={animations} compact />
              </div>
              <p className="mb-2 text-center font-bold">{getQuestion(detection)}</p>
              <div className={`grid gap-2 ${choiceGrid}`}>
                {choices.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    onClick={() => choose(choice.value)}
                    className="min-h-11 rounded-xl border-2 border-brand-gray-border bg-brand-white px-3 py-2 font-extrabold transition hover:border-brand-black hover:bg-brand-gray-light"
                    aria-label={`اختيار ${choice.label}`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
              {feedback === 'try-again' && (
                <motion.div
                  role="status"
                  className="mt-3 flex items-start gap-2 rounded-xl bg-brand-red-soft p-3 text-sm text-brand-gray-dark"
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                >
                  <RotateCcw className="mt-0.5 shrink-0 text-brand-red" size={18} />
                  <div>
                    <strong className="block text-brand-black">محاولة جميلة، راجع الحرف.</strong>
                    <span>{detection.record.hint}</span>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-brand-red-soft p-3 text-center">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-black text-brand-white"><Check size={20} /></span>
                <CorrectedWord oldWord={detection.matchedText} newWord={detection.replacementText} animate={animations} compact />
                <p className="font-extrabold">أحسنت، أصبحت «{detection.record.correct}» صحيحة.</p>
              </div>
              <div className="mt-3 flex gap-2 rounded-xl border border-brand-gray-border p-3 text-sm">
                <Lightbulb className="mt-0.5 shrink-0 text-brand-red" size={19} />
                <div>
                  <div className="font-extrabold">لمحة القاعدة</div>
                  <p className="mt-0.5 text-brand-gray-dark">{detection.record.explanation}</p>
                </div>
              </div>
              {detection.record.examples?.length ? (
                <div className="mt-3">
                  <button type="button" onClick={() => setShowExamples((shown) => !shown)} className="secondary-button min-h-10 w-full py-2 text-sm">
                    أعطني مثالًا مشابهًا
                  </button>
                  {showExamples && <p className="mt-2 rounded-xl bg-brand-gray-light p-3 text-center text-sm font-bold">{detection.record.examples.join('، ')}</p>}
                </div>
              ) : null}
              <button type="button" onClick={() => onSolved(attempts)} className="primary-button mt-3 min-h-11 w-full py-2">
                {lockOpen ? 'الحرف التالي' : 'أكمل الكتابة'}
              </button>
            </motion.div>
          )}
        </motion.section>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
