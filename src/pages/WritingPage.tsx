import { motion } from 'framer-motion';
import { AlertCircle, Check, Eraser, Keyboard, Play, RotateCcw, ShieldCheck, Sparkles, Watch } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnalyzedText } from '../components/AnalyzedText';
import { PageHeader } from '../components/PageHeader';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { WordLens } from '../components/WordLens';
import { pickRandomWritingExample, writingExamples } from '../data/writingExamples';
import { useAppState } from '../hooks/useAppState';
import type { DetectedError } from '../types';
import { applyCorrection, detectErrors } from '../utils/detector';
import { playErrorSound } from '../utils/errorSound';

const exampleText = writingExamples[0].text;

function findDetectionAnchor(detectionId: string) {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-detection-id]'))
    .find((element) => element.dataset.detectionId === detectionId) ?? null;
}

export function WritingPage() {
  const { state, recordAnswer } = useAppState();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isDemo = searchParams.get('demo') === '1';
  const requestedExample = writingExamples.find((example) => example.id === searchParams.get('example'));
  const [text, setText] = useState(isDemo ? exampleText : requestedExample?.text ?? '');
  const [detections, setDetections] = useState<DetectedError[]>([]);
  const [activeDetection, setActiveDetection] = useState<DetectedError | null>(null);
  const [lensAnchor, setLensAnchor] = useState<HTMLElement | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [technicalError, setTechnicalError] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(true);
  const [demoFinished, setDemoFinished] = useState(false);
  const [lastCorrected, setLastCorrected] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const writingOverlayRef = useRef<HTMLDivElement>(null);
  const demoOpened = useRef(false);
  const previousDetectionKeys = useRef<Set<string>>(new Set());
  const sessionId = useRef(`جلسة-${Date.now()}`);
  const animations = state.settings.animations && !state.settings.reduceMotion;

  const analyze = useCallback((value: string) => {
    try {
      const nextDetections = detectErrors(value);
      const nextKeys = new Set(nextDetections.map((detection) => detection.record.id));
      const hasNewDetection = nextDetections.some((detection) => !previousDetectionKeys.current.has(detection.record.id));
      previousDetectionKeys.current = nextKeys;
      setDetections(nextDetections);
      if (hasNewDetection && state.settings.soundEnabled) void playErrorSound();
      setTechnicalError(false);
    } catch {
      setTechnicalError(true);
    } finally {
      setIsAnalyzing(false);
    }
  }, [state.settings.soundEnabled]);

  useEffect(() => {
    setIsAnalyzing(Boolean(text.trim()));
    const timer = window.setTimeout(() => analyze(text), 600);
    return () => window.clearTimeout(timer);
  }, [text, analyze]);

  useEffect(() => {
    if (!isDemo || !detections.length || demoOpened.current || activeDetection) return;
    let openTimer: number | undefined;
    const timer = window.setTimeout(() => {
      const anchor = findDetectionAnchor(detections[0].id);
      anchor?.scrollIntoView({ block: 'center', behavior: animations ? 'smooth' : 'auto' });
      openTimer = window.setTimeout(() => {
        demoOpened.current = true;
        setLensAnchor(anchor);
        setActiveDetection(detections[0]);
      }, animations ? 380 : 0);
    }, animations ? 700 : 100);
    return () => {
      window.clearTimeout(timer);
      if (openTimer) window.clearTimeout(openTimer);
    };
  }, [activeDetection, animations, detections, isDemo]);

  const chooseRandomExample = () => {
    const example = pickRandomWritingExample(text);
    if (isDemo) {
      navigate(`/write?example=${encodeURIComponent(example.id)}`, { replace: true });
      return;
    }
    setText(example.text);
    setLastCorrected(null);
    setActiveDetection(null);
    setLensAnchor(null);
    setDemoFinished(false);
    textareaRef.current?.focus();
  };

  const clearText = () => {
    setText('');
    setDetections([]);
    setActiveDetection(null);
    setLensAnchor(null);
    setLastCorrected(null);
    setDemoFinished(false);
    textareaRef.current?.focus();
  };

  const insertText = (value: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setText((current) => current + value);
      return;
    }
    const start = textarea.selectionStart ?? text.length;
    const end = textarea.selectionEnd ?? text.length;
    setText(`${text.slice(0, start)}${value}${text.slice(end)}`);
    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + value.length, start + value.length);
    });
  };

  const backspace = () => {
    const textarea = textareaRef.current;
    const cursor = textarea?.selectionStart ?? text.length;
    const end = textarea?.selectionEnd ?? cursor;
    if (cursor !== end) setText(`${text.slice(0, cursor)}${text.slice(end)}`);
    else if (cursor > 0) setText(`${text.slice(0, cursor - 1)}${text.slice(cursor)}`);
  };

  const selectDetection = (detection: DetectedError, anchorElement: HTMLButtonElement) => {
    setLensAnchor(anchorElement);
    setActiveDetection(detection);
  };

  const solved = (attempts: number) => {
    if (!activeDetection) return;
    const solvedRecord = activeDetection.record;
    recordAnswer(solvedRecord, attempts, sessionId.current);
    const nextText = applyCorrection(text, activeDetection);
    const nextDetections = detectErrors(nextText);
    setText(nextText);
    setDetections(nextDetections);
    setLastCorrected(solvedRecord.correct);
    setActiveDetection(null);
    setLensAnchor(null);

    if (isDemo) {
      if (nextDetections.length) {
        window.setTimeout(() => {
          setLensAnchor(findDetectionAnchor(nextDetections[0].id));
          setActiveDetection(nextDetections[0]);
        }, animations ? 650 : 50);
      } else {
        setDemoFinished(true);
      }
    }
  };

  const status = !text.trim()
    ? { icon: Keyboard, title: 'ابدأ بكتابة جملة عربية.', description: 'لن يُرسل ما تكتبه إلى أي خادم.', tone: 'neutral' }
    : technicalError
      ? { icon: AlertCircle, title: 'تعذر تحليل النص الآن.', description: 'أعد المحاولة؛ سيبقى نصك على هذا الجهاز.', tone: 'alert' }
      : isAnalyzing
        ? { icon: Sparkles, title: 'أراجع الحروف بهدوء…', description: 'يبدأ التحليل بعد توقفك عن الكتابة.', tone: 'neutral' }
        : detections.length === 0
          ? { icon: Check, title: 'رائع، لم نجد حروفًا تحتاج إلى مراجعة.', description: lastCorrected ? `أصبحت «${lastCorrected}» صحيحة.` : 'استمر في الكتابة بثقة.', tone: 'success' }
          : { icon: AlertCircle, title: 'هناك حرف يحتاج إلى مراجعة.', description: detections.length === 1 ? 'وجدنا كلمة واحدة تستحق لمحة.' : `وجدنا ${detections.length} كلمات تستحق لمحة.`, tone: 'alert' };

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow={isDemo ? 'العرض التوضيحي' : 'مساحة الكتابة الذكية'}
        title={isDemo ? 'اتبع نبضة الحرف' : 'اكتب كما تفكر'}
        description={isDemo ? 'سنراجع فاطمه أولًا، ثم المدرسه، من دون إظهار التصحيح قبل محاولتك.' : 'نَبِّهني يلفت انتباهك إلى الجزء المحتمل، ويترك لك فرصة الإصلاح.'}
        action={!isDemo && <button type="button" onClick={() => navigate('/write?demo=1')} className="secondary-button"><Play size={18} /> شغّل العرض التوضيحي</button>}
      />

      {isDemo && (
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl bg-brand-red-soft p-4 text-sm font-bold text-brand-gray-dark">
          <span className="rounded-full bg-brand-black px-3 py-1 text-brand-white">1</span><span>اكتب</span><span aria-hidden="true">←</span>
          <span className="rounded-full bg-brand-white px-3 py-1">2</span><span>لاحظ</span><span aria-hidden="true">←</span>
          <span className="rounded-full bg-brand-white px-3 py-1">3</span><span>حاول</span><span aria-hidden="true">←</span>
          <span className="rounded-full bg-brand-white px-3 py-1">4</span><span>تذكّر</span>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-5">
          <section className="surface-card">
            <label htmlFor="smart-writing" className="mb-3 flex items-center justify-between gap-3 font-extrabold">
              <span>مساحة الكتابة</span>
              <span className="text-sm font-normal text-brand-gray-text">المعالجة بعد 600 ميلي ثانية</span>
            </label>
            <div className="relative isolate overflow-hidden rounded-2xl focus-within:ring-4 focus-within:ring-brand-red-soft">
              <textarea
                ref={textareaRef}
                id="smart-writing"
                value={text}
                onChange={(event) => { setText(event.target.value); setLastCorrected(null); }}
                onScroll={(event) => {
                  if (writingOverlayRef.current) writingOverlayRef.current.style.transform = `translateY(-${event.currentTarget.scrollTop}px)`;
                }}
                className="relative min-h-40 w-full resize-y rounded-2xl border border-brand-gray-border bg-brand-white p-4 text-[1.35rem] font-medium leading-9 text-transparent caret-brand-black outline-none transition placeholder:text-brand-gray-text focus:border-brand-black sm:min-h-48 sm:text-2xl"
                style={text ? { color: 'transparent', WebkitTextFillColor: 'transparent', caretColor: 'var(--color-black)' } : undefined}
                placeholder="اكتب جملة هنا…"
                aria-describedby="writing-help privacy-note"
                spellCheck={false}
              />
              {text && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl p-4" aria-label="النص مع الحروف التي تحتاج إلى مراجعة">
                  <div ref={writingOverlayRef}>
                    <AnalyzedText
                      text={text}
                      detections={detections}
                      onSelect={selectDetection}
                      animations={animations}
                      writingSurface
                    />
                  </div>
                </div>
              )}
            </div>
            <p id="writing-help" className="mt-2 text-sm text-brand-gray-text">
              يظهر التنبيه فوق الحرف داخل النص؛ اضغط الكلمة لفتح العدسة في مكانها.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={chooseRandomExample}
                className="secondary-button"
                aria-label="اختيار مثال عشوائي من عشرة أمثلة جاهزة"
              >
                <Sparkles size={18} /> مثال عشوائي من ١٠
              </button>
              <button type="button" onClick={clearText} className="secondary-button"><Eraser size={18} /> مسح النص</button>
              <button type="button" onClick={() => setKeyboardVisible((visible) => !visible)} className="secondary-button"><Keyboard size={18} /> {keyboardVisible ? 'إخفاء اللوحة' : 'إظهار اللوحة'}</button>
            </div>
          </section>

          {keyboardVisible && <VirtualKeyboard onType={insertText} onBackspace={backspace} />}
        </div>

        <aside className="space-y-4">
          <section className="surface-card xl:sticky xl:top-8">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold">حالة الكتابة</h2>
              {detections.length > 0 && <span className="rounded-full bg-brand-red-soft px-3 py-1 text-xs font-bold text-brand-red">التنبيه داخل النص</span>}
            </div>
            <div className={`flex items-start gap-3 rounded-2xl p-4 ${status.tone === 'alert' ? 'bg-brand-red-soft' : 'bg-brand-gray-light'}`} role="status" aria-live="polite">
              <status.icon size={21} className={`mt-0.5 shrink-0 ${status.tone === 'alert' ? 'text-brand-red' : 'text-brand-black'}`} />
              <div>
                <div className="font-extrabold">{status.title}</div>
                <div className="text-sm text-brand-gray-dark">{status.description}</div>
                {technicalError && <button type="button" onClick={() => analyze(text)} className="mt-2 inline-flex items-center gap-1 font-bold text-brand-red"><RotateCcw size={15} /> إعادة المحاولة</button>}
              </div>
            </div>
            <p id="privacy-note" className="mt-4 flex items-start gap-2 text-sm leading-6 text-brand-gray-text">
              <ShieldCheck className="mt-0.5 shrink-0" size={17} />
              تجري المعالجة محليًا في هذا النموذج، ولا تُشارك النصوص مع الأسرة.
            </p>
          </section>
        </aside>
      </div>

      {demoFinished && (
        <motion.section
          className="mt-6 grid gap-4 rounded-[28px] border-2 border-brand-black bg-brand-white p-5 sm:p-7 lg:grid-cols-2"
          initial={{ opacity: 0, y: animations ? 15 : 0 }} animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="text-sm font-bold text-brand-red">تحدّثت بصمتك الإملائية</div>
            <h2 className="mt-1 text-2xl font-extrabold">صححت كلمتين بالتاء المربوطة</h2>
            <p className="mt-2 text-brand-gray-dark">سجّل نَبِّهني نوع الخطأ والكلمة التعليمية فقط، ولم يحتفظ بالجملة.</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-brand-gray-light"><div className="h-full w-3/4 rounded-full bg-brand-red" /></div>
          </div>
          <div className="rounded-[24px] bg-brand-black p-5 text-brand-white">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-gray-border"><Watch size={18} /> تنبيه الساعة التالي</div>
            <p className="text-xl font-extrabold">أيّهما صحيح؟</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <span className="rounded-xl bg-brand-white px-3 py-2 text-center font-bold text-brand-black">مدرسة</span>
              <span className="rounded-xl border border-brand-gray-dark px-3 py-2 text-center font-bold">مدرسه</span>
            </div>
          </div>
          <button type="button" onClick={() => navigate('/demo-complete')} className="primary-button lg:col-span-2">أكمل العرض <Check size={18} /></button>
        </motion.section>
      )}

      <WordLens
        detection={activeDetection}
        anchorElement={lensAnchor}
        onClose={() => {
          setActiveDetection(null);
          setLensAnchor(null);
        }}
        onSolved={solved}
        animations={animations}
        lockOpen={isDemo}
      />
    </div>
  );
}
