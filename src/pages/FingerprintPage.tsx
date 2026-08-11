import { ArrowLeft, BarChart3, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { useAppState } from '../hooks/useAppState';
import type { CategoryProgress } from '../types';

const categories = [
  { label: 'التاء المربوطة والهاء', keys: ['التاء المربوطة والهاء', 'الهمزات والتاء المربوطة', 'كلمات يومية وأكاديمية'] },
  { label: 'الهمزات', keys: ['الهمزات', 'الهمزات والتاء المربوطة', 'همزة القطع', 'همزة الوصل', 'الهمزة المتوسطة والمتطرفة', 'أخطاء الهمزة الشائعة', 'كلمات متعددة المواضع'] },
  { label: 'الألف المقصورة والياء', keys: ['الألف المقصورة والياء'] },
  { label: 'الضاد والظاء', keys: ['الضاد والظاء'] },
  { label: 'الحروف والألفات الزائدة', keys: ['الألف الزائدة', 'الألف الزائدة أو الناقصة', 'الحروف الزائدة', 'الحروف والألفات الزائدة'] },
  { label: 'الفصل والوصل', keys: ['الفصل والوصل'] },
  { label: 'علامات الترقيم', keys: ['علامات الترقيم'], future: true },
];

function combine(stats: Record<string, CategoryProgress>, keys: string[]): CategoryProgress {
  return keys.reduce((total, key) => {
    const current = stats[key];
    if (!current) return total;
    return {
      seen: total.seen + current.seen,
      attempts: total.attempts + current.attempts,
      correct: total.correct + current.correct,
      firstTryCorrect: total.firstTryCorrect + current.firstTryCorrect,
    };
  }, { seen: 0, attempts: 0, correct: 0, firstTryCorrect: 0 });
}

function getLevel(stat: CategoryProgress) {
  const rate = stat.seen ? stat.firstTryCorrect / stat.seen : 0;
  if (stat.seen >= 5 && rate >= 0.8) return { label: 'متقن', width: 100, dark: true };
  if (stat.seen >= 2 && rate >= 0.45) return { label: 'يتحسن', width: 68, dark: false };
  return { label: 'يحتاج إلى مراجعة', width: stat.seen ? 35 : 8, dark: false };
}

export function FingerprintPage() {
  const { state } = useAppState();
  const navigate = useNavigate();
  const rows = categories.map((category) => ({ ...category, stat: combine(state.progress.categories, category.keys) }));
  const highest = [...rows].filter((row) => !row.future).sort((a, b) => b.stat.seen - a.stat.seen)[0];
  const hasData = rows.some((row) => row.stat.seen > 0);

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="تحليل شخصي"
        title="بصمتي الإملائية"
        description="صورة مبسطة للأنماط التي ظهرت معك، من دون الاحتفاظ بالجمل أو الرسائل."
        action={<button type="button" onClick={() => navigate('/review?custom=1')} className="primary-button">ابدأ مراجعة مخصصة <ArrowLeft size={18} /></button>}
      />

      {!hasData ? (
        <section className="surface-card py-12 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-gray-light"><BarChart3 size={26} /></span>
          <h2 className="mt-4 text-xl font-extrabold">لا توجد بيانات تقدم بعد</h2>
          <p className="mt-2 text-brand-gray-dark">صحح أول كلمة، وسنبدأ بناء بصمتك التعليمية محليًا.</p>
          <button type="button" onClick={() => navigate('/write')} className="primary-button mt-5">اكتب الآن</button>
        </section>
      ) : (
        <>
          <section className="mb-5 grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
            <div className="rounded-[24px] bg-brand-black p-6 text-brand-white">
              <div className="text-sm font-bold text-brand-gray-border">لمحتك هذا الأسبوع</div>
              <h2 className="mt-2 text-2xl font-extrabold leading-10">أكثر ما يحتاج إلى تدريب هذا الأسبوع: <span className="text-brand-red">{highest?.label ?? 'التاء المربوطة'}</span>.</h2>
              <p className="mt-3 text-brand-gray-border">كل مراجعة قصيرة تساعد الحرف على الثبات في الذاكرة.</p>
            </div>
            <div className="surface-card flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-red-soft text-brand-red"><CalendarClock size={23} /></span>
              <div><div className="text-sm font-bold text-brand-gray-text">آخر مراجعة</div><div className="mt-1 font-extrabold">{state.progress.lastReviewDate ?? 'لم تبدأ بعد'}</div></div>
            </div>
          </section>

          <section className="surface-card overflow-hidden p-0 sm:p-0">
            <div className="hidden grid-cols-[1.5fr_.55fr_.7fr_1fr] gap-4 border-b border-brand-gray-border bg-brand-gray-light px-6 py-4 text-sm font-bold text-brand-gray-text md:grid">
              <span>الفئة</span><span>مرات الظهور</span><span>من أول محاولة</span><span>المستوى</span>
            </div>
            <div className="divide-y divide-brand-gray-border">
              {rows.map(({ label, stat, future }) => {
                const level = getLevel(stat);
                const firstTryRate = stat.seen ? Math.round((stat.firstTryCorrect / stat.seen) * 100) : 0;
                return (
                  <article key={label} className="grid gap-3 px-5 py-5 md:grid-cols-[1.5fr_.55fr_.7fr_1fr] md:items-center md:gap-4 md:px-6">
                    <div><h3 className="font-extrabold">{label}</h3>{future && <span className="text-xs font-bold text-brand-gray-text">قسم مستقبلي</span>}</div>
                    <div className="flex justify-between md:block"><span className="text-sm text-brand-gray-text md:hidden">مرات الظهور</span><strong>{stat.seen}</strong></div>
                    <div className="flex justify-between md:block"><span className="text-sm text-brand-gray-text md:hidden">من أول محاولة</span><strong>{firstTryRate}٪</strong></div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm font-bold"><span>{future ? 'قريبًا' : level.label}</span><span>{future ? 0 : level.width}٪</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-brand-gray-light" role="progressbar" aria-label={`مستوى ${label}`} aria-valuenow={future ? 0 : level.width} aria-valuemin={0} aria-valuemax={100}>
                        <div className={`h-full rounded-full ${level.dark ? 'bg-brand-black' : 'bg-brand-red'}`} style={{ width: `${future ? 0 : level.width}%` }} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
