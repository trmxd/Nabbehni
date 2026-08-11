import { BriefcaseBusiness, GraduationCap, Smile, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { useAppState } from '../hooks/useAppState';
import type { UserMode } from '../types';

const modes: Array<{ id: UserMode; title: string; description: string; icon: typeof Smile }> = [
  { id: 'child', title: 'طفل', description: 'شرح مبسط وحركات أوضح واختيارات قليلة.', icon: Smile },
  { id: 'student', title: 'طالب', description: 'تجربة أسرع وكلمات دراسية وجامعية.', icon: GraduationCap },
  { id: 'professional', title: 'محترف', description: 'واجهة هادئة لمراجعة الرسائل والتقارير.', icon: BriefcaseBusiness },
];

export function ProfilePage() {
  const { state, updateProfile } = useAppState();
  const [mode, setMode] = useState<UserMode>(state.profile.mode);
  const navigate = useNavigate();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    updateProfile('سالم', mode);
    navigate('/home');
  };

  return (
    <main className="min-h-screen bg-brand-gray-light px-4 py-6 sm:px-6 sm:py-10" dir="rtl">
      <form onSubmit={submit} className="mx-auto max-w-4xl rounded-[28px] border border-brand-gray-border bg-brand-white p-5 shadow-soft sm:p-9">
        <div className="mb-7 flex items-center gap-3">
          <BrandLogo size="medium" />
          <div>
            <p className="text-sm font-bold text-brand-red">تسجيل دخول تجريبي</p>
            <h1 className="text-3xl font-extrabold">كيف تحب أن تتعلم؟</h1>
            <p className="mt-1 text-brand-gray-dark">يمكنك تغيير الوضع لاحقًا من الإعدادات.</p>
          </div>
        </div>

        <fieldset>
          <legend className="mb-3 font-extrabold">اختر وضع الاستخدام</legend>
          <div className="grid gap-3 md:grid-cols-3">
            {modes.map(({ id, title, description, icon: Icon }) => (
              <label key={id} className={`mode-sensitive cursor-pointer rounded-2xl border-2 p-5 transition ${mode === id ? 'border-brand-black bg-brand-red-soft' : 'border-brand-gray-border hover:border-brand-gray-text'}`}>
                <input type="radio" name="mode" value={id} checked={mode === id} onChange={() => setMode(id)} className="sr-only" />
                <span className={`mb-4 grid h-11 w-11 place-items-center rounded-xl ${mode === id ? 'bg-brand-black text-brand-white' : 'bg-brand-gray-light text-brand-gray-dark'}`}>
                  <Icon size={23} aria-hidden="true" />
                </span>
                <span className="block text-xl font-extrabold">{title}</span>
                <span className="mt-1 block leading-7 text-brand-gray-dark">{description}</span>
                {mode === id && <span className="mt-4 inline-block text-sm font-bold text-brand-red">الوضع المحدد</span>}
              </label>
            ))}
          </div>
        </fieldset>

        <p className="mt-7 max-w-xl rounded-2xl bg-brand-gray-light p-4 font-medium text-brand-gray-dark">
          لا نطلب اسمًا أو بريدًا إلكترونيًا أو أي بيانات شخصية. يُستخدم الاسم التجريبي «سالم» داخل العرض فقط.
        </p>

        <button type="submit" className="primary-button mt-7 w-full sm:w-auto">
          ابدأ مع نَبِّهني <ArrowLeft size={19} />
        </button>
      </form>
    </main>
  );
}
