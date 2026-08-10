import { Check, ChevronLeft, Clock3, Home, Lightbulb, RotateCcw } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { spellingErrors } from '../data/errors';
import { useAppState } from '../hooks/useAppState';
import type { SpellingError } from '../types';
import { compareWords, isCorrectChoice } from '../utils/detector';

function choicesFor(record: SpellingError) {
  if (record.interaction === 'remove-character') return [
    { value: 'remove', label: `أحذف «${compareWords(record.incorrect, record.correct).incorrectSpan}» الزائدة` },
    { value: 'keep', label: 'أبقي الكلمة كما هي' },
  ];
  return (record.choices ?? [record.correct, record.incorrect]).map((choice) => ({ value: choice, label: choice }));
}

export function ReviewPage() {
  const { state, recordAnswer } = useAppState();
  const [searchParams] = useSearchParams();
  const custom = searchParams.get('custom') === '1';
  const questions = useMemo(() => {
    const previous = Object.values(state.progress.words)
      .sort((a, b) => b.appearances - a.appearances)
      .map((word) => spellingErrors.find((record) => record.incorrect === word.incorrect))
      .filter((record): record is SpellingError => Boolean(record));
    const fallbackWords = ['مدرسه', 'هاذا', 'الى'];
    const fallback = fallbackWords
      .map((incorrect) => spellingErrors.find((record) => record.incorrect === incorrect))
      .filter((record): record is SpellingError => Boolean(record));
    return [...previous, ...fallback].filter((record, index, array) => array.findIndex((item) => item.id === record.id) === index).slice(0, 3);
  }, [state.progress.words]);
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'wrong' | 'correct'>('idle');
  const [correctCount, setCorrectCount] = useState(0);
  const [needsTomorrow, setNeedsTomorrow] = useState<string | null>(null);
  const sessionId = useRef(`مراجعة-${Date.now()}`);
  const finished = index >= questions.length;
  const current = questions[index];

  const answer = (value: string) => {
    if (!current || feedback === 'correct') return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (isCorrectChoice(current, value)) {
      setFeedback('correct');
      setCorrectCount((count) => count + 1);
      recordAnswer(current, nextAttempts, sessionId.current);
      if (nextAttempts > 1) setNeedsTomorrow(current.correct);
    } else {
      setFeedback('wrong');
      setNeedsTomorrow(current.correct);
    }
  };

  const next = () => {
    setIndex((currentIndex) => currentIndex + 1);
    setAttempts(0);
    setFeedback('idle');
  };

  if (finished) {
    return (
      <div className="page-wrap">
        <section className="mx-auto max-w-2xl rounded-[28px] border border-brand-gray-border bg-brand-white p-6 text-center shadow-soft sm:p-9">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-black text-brand-white"><Check size={27} /></span>
          <p className="mt-5 text-sm font-bold text-brand-red">اكتملت الجلسة</p>
          <h1 className="mt-1 text-3xl font-extrabold">أنهيت مراجعتك في أقل من دقيقة.</h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-brand-gray-light p-4"><div className="text-sm text-brand-gray-text">الإجابات الصحيحة</div><div className="mt-1 text-2xl font-extrabold">{correctCount} من {questions.length}</div></div>
            <div className="rounded-2xl bg-brand-red-soft p-4"><div className="text-sm text-brand-gray-text">تحتاج لمراجعة غدًا</div><div className="mt-1 text-2xl font-extrabold">{needsTomorrow ?? 'لا توجد'}</div></div>
          </div>
          <Link to="/home" className="primary-button mt-6 w-full"><Home size={18} /> العودة للرئيسية</Link>
        </section>
      </div>
    );
  }

  const options = choicesFor(current);
  return (
    <div className="page-wrap">
      <PageHeader eyebrow={custom ? 'مراجعة مخصصة من بصمتك' : 'جلسة اليوم'} title="ثلاث كلمات، أقل من دقيقة" description="راجع بهدوء. كل سؤال مبني على نمط ظهر في بصمتك." />
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between text-sm font-bold">
          <span>الكلمة {index + 1} من {questions.length}</span>
          <span className="flex items-center gap-1 text-brand-gray-text"><Clock3 size={16} /> جلسة قصيرة</span>
        </div>
        <div className="mb-5 grid grid-cols-3 gap-2" aria-label="تقدم المراجعة">
          {questions.map((question, questionIndex) => <span key={question.id} className={`h-2 rounded-full ${questionIndex <= index ? 'bg-brand-red' : 'bg-brand-gray-border'}`} />)}
        </div>

        <section className="surface-card text-center">
          <div className="text-sm font-bold text-brand-red">{current.category}</div>
          <div className="mx-auto mt-5 inline-flex min-h-20 items-center rounded-2xl bg-brand-gray-light px-7 py-4 text-4xl font-extrabold">{current.incorrect}</div>
          <h2 className="mt-5 text-xl font-extrabold">{current.interaction === 'remove-character' ? 'ما الخطوة الأنسب؟' : current.interaction === 'split-words' ? 'كيف نفصل العبارة؟' : 'أي حرف أو صيغة تكمل الكلمة؟'}</h2>
          <div className={`mt-5 grid gap-3 ${options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {options.map((option) => <button key={option.value} type="button" onClick={() => answer(option.value)} disabled={feedback === 'correct'} className="min-h-14 rounded-2xl border-2 border-brand-gray-border px-3 py-3 text-lg font-extrabold hover:border-brand-black disabled:opacity-60">{option.label}</button>)}
          </div>

          {feedback === 'wrong' && (
            <div role="status" className="mt-4 flex items-start gap-3 rounded-2xl bg-brand-red-soft p-4 text-right">
              <RotateCcw className="mt-0.5 shrink-0 text-brand-red" size={19} />
              <div><strong>اقتربت من الإجابة.</strong><p className="text-brand-gray-dark">{current.hint}</p></div>
            </div>
          )}
          {feedback === 'correct' && (
            <div role="status" className="mt-4 rounded-2xl bg-brand-red-soft p-5 text-right">
              <div className="flex items-center gap-2 font-extrabold"><Check className="text-brand-red" size={20} /> رائع، تذكرت القاعدة.</div>
              <div className="mt-3 flex gap-3 rounded-xl bg-brand-white p-3"><Lightbulb className="mt-0.5 shrink-0 text-brand-red" size={18} /><p>{current.explanation}</p></div>
              <button type="button" onClick={next} className="primary-button mt-4 w-full">{index === questions.length - 1 ? 'أظهر النتيجة' : 'الكلمة التالية'} <ChevronLeft size={18} /></button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
