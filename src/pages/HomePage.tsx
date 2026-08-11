import {
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  Clock3,
  Info,
  PenLine,
  ShieldCheck,
  Sparkles,
  Users,
  Watch,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { StatusPill } from '../components/StatusPill';
import { useAppState } from '../hooks/useAppState';

const cards = [
  { to: '/write', title: 'اكتب الآن', description: 'اكتب جملة ودع الحرف يلفت انتباهك.', icon: PenLine, featured: true },
  { to: '/review', title: 'مراجعتي اليومية', description: 'ثلاث كلمات في جلسة قصيرة وهادئة.', icon: BookOpenCheck },
  { to: '/fingerprint', title: 'بصمتي الإملائية', description: 'اعرف الأنماط التي تتحسن معك.', icon: BarChart3 },
  { to: '/watch', title: 'تجربة الساعة', description: 'راجع كلمة متكررة في ثوانٍ.', icon: Watch },
  { to: '/family', title: 'متابعة الأسرة', description: 'تقدم تعليمي واضح من دون عرض الرسائل.', icon: Users },
  { to: '/about', title: 'كيف يعمل نَبِّهني؟', description: 'اكتشف رحلة الحرف من التنبيه إلى الإتقان.', icon: Info },
];

const modeCopy = {
  child: 'لنراجع حروفك اليوم.',
  student: 'مراجعة سريعة، ثم أكمل يومك.',
  professional: 'لنراجع كتابتك بهدوء ودقة.',
};

export function HomePage() {
  const { state } = useAppState();
  const navigate = useNavigate();
  const categories = Object.entries(state.progress.categories).sort((a, b) => b[1].seen - a[1].seen);
  const mostCommon = categories[0]?.[0] ?? 'لا توجد بيانات بعد';

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="مساحتك التعليمية"
        title={`مرحبًا يا ${state.profile.name}، ${modeCopy[state.profile.mode]}`}
        description="ابدأ من الكتابة، أو خصّص دقيقة لمراجعة الكلمات التي ظهرت سابقًا."
        action={<StatusPill tone="alert"><Sparkles size={15} className="ml-1" /> وضع {state.profile.mode === 'child' ? 'الطفل' : state.profile.mode === 'student' ? 'الطالب' : 'المحترف'}</StatusPill>}
      />

      {state.resetNotice && (
        <div role="status" className="mb-6 flex items-center gap-3 rounded-2xl bg-brand-red-soft p-4 font-bold text-brand-gray-dark">
          <ShieldCheck className="text-brand-red" size={21} /> تم مسح البيانات التجريبية. يمكنك البدء ببصمة جديدة.
        </div>
      )}

      <section className="mb-7 grid gap-3 sm:grid-cols-3" aria-label="ملخص التقدم">
        <div className="surface-card">
          <div className="text-sm font-bold text-brand-gray-text">كلمات راجعتها</div>
          <div className="mt-2 text-3xl font-extrabold">{state.progress.totalReviewed}</div>
        </div>
        <div className="surface-card">
          <div className="text-sm font-bold text-brand-gray-text">أكثر نمط ظهر</div>
          <div className="mt-2 text-xl font-extrabold leading-8">{mostCommon}</div>
        </div>
        <div className="surface-card grid grid-cols-2 gap-3">
          <div>
            <div className="text-sm font-bold text-brand-gray-text">كلمات أتقنتها</div>
            <div className="mt-2 text-3xl font-extrabold">{state.progress.mastered}</div>
          </div>
          <div className="border-r border-brand-gray-border pr-3">
            <div className="text-sm font-bold text-brand-gray-text">سلسلة التعلم</div>
            <div className="mt-2 text-3xl font-extrabold">{state.progress.streak} <span className="text-base">أيام</span></div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="خدمات نَبِّهني">
        {cards.map(({ to, title, description, icon: Icon, featured }) => (
          <Link key={to} to={to} className={`app-feature-card group rounded-[24px] border p-5 transition hover:-translate-y-0.5 hover:shadow-soft ${featured ? 'border-brand-black bg-brand-black text-brand-white' : 'border-brand-gray-border bg-brand-white text-brand-black'}`}>
            <div className={`mb-6 grid h-12 w-12 place-items-center rounded-2xl ${featured ? 'bg-brand-white text-brand-black' : 'bg-brand-gray-light text-brand-gray-dark group-hover:bg-brand-red-soft group-hover:text-brand-red'}`}>
              <Icon size={24} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-extrabold">{title}</h2>
            <p className={`mt-2 leading-7 ${featured ? 'text-brand-gray-border' : 'text-brand-gray-dark'}`}>{description}</p>
            <span className={`mt-5 inline-flex items-center gap-2 text-sm font-bold ${featured ? 'text-brand-white' : 'text-brand-red'}`}>
              افتح المساحة <ArrowLeft size={16} />
            </span>
          </Link>
        ))}
      </section>

      <section className="app-callout-motion mt-7 grid gap-4 rounded-[28px] bg-brand-red-soft p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-brand-red"><Clock3 size={20} /> عرض أمام اللجنة</div>
          <h2 className="mt-2 text-2xl font-extrabold">شاهد رحلة حرف كاملة</h2>
          <p className="mt-2 max-w-2xl text-brand-gray-dark">سنضع مثالًا جاهزًا، ثم نمر عبر النبضة وعدسة الكلمة والشرح والبصمة وتنبيه الساعة.</p>
        </div>
        <button type="button" onClick={() => navigate('/write?demo=1')} className="primary-button w-full sm:w-auto">
          <Sparkles size={19} /> شغّل العرض التوضيحي
        </button>
      </section>
    </div>
  );
}
