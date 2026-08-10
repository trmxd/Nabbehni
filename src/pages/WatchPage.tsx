import { motion } from 'framer-motion';
import { Bell, BellOff, Check, ChevronLeft, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Toggle } from '../components/Toggle';
import { useAppState } from '../hooks/useAppState';

const watchQuestions = [
  { prompt: 'أيّهما صحيح؟', context: '', options: ['مدرسة', 'مدرسه'], correct: 'مدرسة' },
  { prompt: 'هل تتذكر الصواب؟', context: 'هذه ثالث مرة تظهر فيها كلمة «لاكن».', options: ['لكن', 'لاكن'], correct: 'لكن' },
];

export function WatchPage() {
  const { state, updateSettings } = useAppState();
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'wrong' | 'correct'>('idle');
  const [shake, setShake] = useState(0);
  const [alertMode, setAlertMode] = useState('repeat');
  const question = watchQuestions[index];
  const animations = state.settings.animations && !state.settings.reduceMotion;

  const answer = (option: string) => {
    setFeedback(option === question.correct ? 'correct' : 'wrong');
    setShake((value) => value + 1);
  };

  const next = () => {
    setIndex((current) => (current + 1) % watchQuestions.length);
    setFeedback('idle');
  };

  return (
    <div className="page-wrap">
      <PageHeader eyebrow="رفيق مصغّر" title="محاكاة الساعة الذكية" description="سؤال واحد، وخياران فقط، لمراجعة الكلمات المتكررة في لحظة مناسبة." />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr] xl:items-start">
        <section className="surface-card grid min-h-[560px] place-items-center overflow-hidden bg-brand-gray-light">
          {!state.settings.watchEnabled ? (
            <div className="max-w-sm text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-white"><BellOff size={26} /></span>
              <h2 className="mt-4 text-2xl font-extrabold">تم إيقاف الساعة</h2>
              <p className="mt-2 text-brand-gray-dark">لن تظهر مراجعات مصغرة حتى تعيد تفعيل المحاكاة.</p>
              <button type="button" onClick={() => updateSettings({ watchEnabled: true })} className="primary-button mt-5">تفعيل محاكاة الساعة</button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="h-20 w-28 rounded-t-[34px] bg-brand-black" aria-hidden="true" />
              <motion.div
                key={shake}
                animate={feedback !== 'idle' && animations ? { x: [0, -3, 3, -2, 2, 0] } : undefined}
                transition={{ duration: 0.34 }}
                className="relative z-10 w-[286px] rounded-[58px] border-[12px] border-brand-black bg-brand-black p-3 shadow-soft"
                aria-label="نموذج ساعة ذكية"
              >
                <div className="min-h-[300px] rounded-[38px] bg-brand-white p-5 text-center">
                  <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-brand-gray-border" />
                  <div className="text-xs font-bold text-brand-red">مراجعة نَبِّهني</div>
                  {question.context && <p className="mt-3 text-sm leading-6 text-brand-gray-dark">{question.context}</p>}
                  <h2 className="mt-3 text-xl font-extrabold">{question.prompt}</h2>
                  {feedback === 'idle' || feedback === 'wrong' ? (
                    <div className="mt-5 grid gap-2">
                      {question.options.map((option) => <button key={option} type="button" onClick={() => answer(option)} className="min-h-12 rounded-2xl border-2 border-brand-gray-border bg-brand-white text-lg font-extrabold hover:border-brand-black">{option}</button>)}
                    </div>
                  ) : (
                    <div className="mt-5">
                      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-brand-red text-brand-white"><Check size={22} /></span>
                      <p className="mt-3 font-extrabold">أحسنت، تذكرت الكلمة.</p>
                      <button type="button" onClick={next} className="mt-4 inline-flex items-center gap-1 font-bold text-brand-red">مثال آخر <ChevronLeft size={16} /></button>
                    </div>
                  )}
                  {feedback === 'wrong' && <p role="status" className="mt-3 rounded-xl bg-brand-red-soft p-2 text-sm font-bold">محاولة جميلة، راجع الحرف مرة أخرى.</p>}
                </div>
              </motion.div>
              <div className="h-20 w-28 rounded-b-[34px] bg-brand-black" aria-hidden="true" />
            </div>
          )}
        </section>

        <div className="space-y-5">
          <section className="surface-card">
            <h2 className="flex items-center gap-2 text-xl font-extrabold"><Bell className="text-brand-red" size={22} /> متى يصل التنبيه؟</h2>
            <div className="mt-4 space-y-2">
              {[
                { value: 'after', label: 'بعد انتهاء الكتابة' },
                { value: 'evening', label: 'مراجعة مسائية' },
                { value: 'repeat', label: 'عند تكرار الخطأ ثلاث مرات' },
                { value: 'off', label: 'إيقاف تنبيهات الساعة' },
              ].map((option) => (
                <label key={option.value} className={`flex min-h-13 cursor-pointer items-center gap-3 rounded-2xl border p-4 font-bold ${alertMode === option.value ? 'border-brand-black bg-brand-red-soft' : 'border-brand-gray-border'}`}>
                  <input type="radio" name="watch-alert" value={option.value} checked={alertMode === option.value} onChange={() => { setAlertMode(option.value); if (option.value === 'off') updateSettings({ watchEnabled: false }); }} className="h-5 w-5 accent-brand-red" />
                  {option.label}
                </label>
              ))}
            </div>
          </section>
          <Toggle checked={state.settings.watchEnabled} onChange={(watchEnabled) => updateSettings({ watchEnabled })} label="تفعيل محاكاة الساعة" description="يمكنك إيقافها في أي وقت." />
          <section className="rounded-[24px] bg-brand-black p-5 text-brand-white">
            <LockKeyhole className="text-brand-red" size={23} />
            <h2 className="mt-3 text-xl font-extrabold">الخصوصية أولًا</h2>
            <p className="mt-2 leading-7 text-brand-gray-border">الساعة لا تقرأ رسائلك. تستقبل فقط نوع الكلمة التي تحتاج إلى مراجعة.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
