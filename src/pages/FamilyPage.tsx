import { BookOpenCheck, Clock3, EyeOff, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useAppState } from '../hooks/useAppState';

export function FamilyPage() {
  const { state } = useAppState();
  const categories = Object.entries(state.progress.categories).sort((a, b) => b[1].seen - a[1].seen);
  const learningMinutes = Math.max(0, Math.round(state.progress.totalReviewed * 0.7));
  const topCategory = categories[0]?.[0] ?? 'ستظهر الأنماط بعد أول مراجعة';
  const chartCategories: Array<[string, { seen: number; firstTryCorrect: number; attempts: number; correct: number }]> = categories.length
    ? categories.slice(0, 4)
    : [['لا توجد بيانات بعد', { seen: 0, firstTryCorrect: 0, attempts: 0, correct: 0 }]];

  return (
    <div className="page-wrap">
      <PageHeader eyebrow="مساحة ولي الأمر" title={`متابعة تقدّم ${state.profile.name}`} description="مؤشرات تعليمية مشجعة تساعد الأسرة على الدعم، من دون كشف ما كُتب أو مع من دار الحديث." />

      <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'كلمات راجعها', value: state.progress.totalReviewed, icon: BookOpenCheck },
          { label: 'كلمات أتقنها', value: state.progress.mastered, icon: TrendingUp },
          { label: 'وقت تعلم تقريبي', value: `${learningMinutes} دقيقة`, icon: Clock3 },
          { label: 'أبرز نمط', value: topCategory, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <article key={label} className="surface-card">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gray-light"><Icon size={20} /></span>
            <div className="mt-4 text-sm font-bold text-brand-gray-text">{label}</div>
            <div className="mt-1 text-xl font-extrabold leading-8">{value}</div>
          </article>
        ))}
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <section className="surface-card">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-sm font-bold text-brand-red">مؤشر التحسن</p><h2 className="mt-1 text-2xl font-extrabold">تحسن استخدام التاء المربوطة هذا الأسبوع.</h2></div>
            <span className="shrink-0 rounded-full bg-brand-black px-3 py-1 text-sm font-bold text-brand-white">يتحسن</span>
          </div>
          <div className="mt-6 space-y-5">
            {chartCategories.map(([category, stat]) => {
              const rate = stat.seen ? Math.round((stat.firstTryCorrect / stat.seen) * 100) : 0;
              return (
                <div key={category}>
                  <div className="mb-2 flex justify-between gap-3 text-sm font-bold"><span>{category}</span><span>{rate}٪ من أول محاولة</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-brand-gray-light"><div className="h-full rounded-full bg-brand-red" style={{ width: `${rate}%` }} /></div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-[24px] bg-brand-red-soft p-6">
            <p className="text-sm font-bold text-brand-red">نشاط الأسرة المقترح</p>
            <h2 className="mt-2 text-xl font-extrabold">قائمة المشتريات</h2>
            <p className="mt-2 leading-8 text-brand-gray-dark">اكتبوا معًا قائمة مشتريات من عشر كلمات، ثم ابحثوا عن الكلمات التي تنتهي بتاء مربوطة.</p>
          </section>
          <section className="rounded-[24px] bg-brand-black p-6 text-brand-white">
            <ShieldCheck className="text-brand-red" size={25} />
            <h2 className="mt-3 text-2xl font-extrabold">نَبِّهني يشارك التقدم، لا المحادثات.</h2>
            <ul className="mt-4 space-y-3 text-brand-gray-border">
              <li className="flex gap-2"><EyeOff className="mt-0.5 shrink-0" size={18} /> لا نعرض رسائل الطفل.</li>
              <li className="flex gap-2"><EyeOff className="mt-0.5 shrink-0" size={18} /> لا نعرض أسماء من تحدث معهم.</li>
              <li className="flex gap-2"><EyeOff className="mt-0.5 shrink-0" size={18} /> لا نعرض محتوى خاصًا أو توقيت كل رسالة.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
