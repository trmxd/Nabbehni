import { BriefcaseBusiness, Clock3, GraduationCap, Play, RotateCcw, Smile, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Toggle } from '../components/Toggle';
import { useAppState } from '../hooks/useAppState';
import type { UserMode } from '../types';

const modes: Array<{ id: UserMode; label: string; icon: typeof Smile }> = [
  { id: 'child', label: 'طفل', icon: Smile },
  { id: 'student', label: 'طالب', icon: GraduationCap },
  { id: 'professional', label: 'محترف', icon: BriefcaseBusiness },
];

export function SettingsPage() {
  const { state, updateProfile, updateSettings, resetProgress } = useAppState();
  const navigate = useNavigate();

  const selectMode = (mode: UserMode) => updateProfile(state.profile.name, mode);

  return (
    <div className="page-wrap">
      <PageHeader eyebrow="تحكمك بالتجربة" title="الإعدادات" description="عدّل طريقة العرض ووقت المراجعة، أو ابدأ من جديد ببيانات تجريبية نظيفة." />

      {state.resetNotice && <div role="status" className="mb-5 rounded-2xl bg-brand-red-soft p-4 font-bold">تم مسح البيانات. بقيت تفضيلات العرض واسم المستخدم كما هي.</div>}
      {!state.settings.animations && <div role="status" className="mb-5 rounded-2xl bg-brand-gray-light p-4 font-bold">تم إيقاف الحركات. ستبقى العلامات والأيقونات واضحة من دون نبض.</div>}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface-card">
          <h2 className="text-xl font-extrabold">وضع المستخدم</h2>
          <p className="mt-1 text-brand-gray-dark">يتغير حجم العناصر ونبرة الشرح حسب الوضع.</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {modes.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => selectMode(id)} className={`min-h-24 rounded-2xl border-2 p-3 font-extrabold ${state.profile.mode === id ? 'border-brand-black bg-brand-red-soft' : 'border-brand-gray-border'}`} aria-pressed={state.profile.mode === id}>
                <Icon className="mx-auto mb-2" size={22} /> {label}
              </button>
            ))}
          </div>
        </section>

        <section className="surface-card">
          <h2 className="text-xl font-extrabold">الحركة والتنبيه</h2>
          <div className="mt-5 space-y-3">
            <Toggle checked={state.settings.soundEnabled} onChange={(soundEnabled) => updateSettings({ soundEnabled })} label="تنبيه صوتي لطيف" description="نغمة قصيرة مرة واحدة عند ظهور حرف يحتاج إلى مراجعة." />
            <Toggle checked={state.settings.animations} onChange={(animations) => updateSettings({ animations })} label="تشغيل الحركات" description="تشمل نبضة الحرف وانتقالات البطاقات." />
            <Toggle checked={state.settings.reduceMotion} onChange={(reduceMotion) => updateSettings({ reduceMotion })} label="تقليل الحركة" description="يوقف المؤثرات المتكررة ويحافظ على المؤشرات البصرية." />
            <Toggle checked={state.settings.watchEnabled} onChange={(watchEnabled) => updateSettings({ watchEnabled })} label="محاكاة الساعة" description="تفعيل أو تعطيل المراجعات المصغرة." />
          </div>
        </section>

        <section className="surface-card">
          <h2 className="flex items-center gap-2 text-xl font-extrabold"><Clock3 className="text-brand-red" size={22} /> وقت المراجعة</h2>
          <label className="mt-5 block">
            <span className="mb-2 block font-bold">اختر وقتًا مناسبًا</span>
            <input type="time" value={state.settings.reviewTime} onChange={(event) => updateSettings({ reviewTime: event.target.value })} className="field max-w-xs" aria-label="وقت المراجعة اليومية" />
          </label>
          <div className="mt-4">
            <Toggle checked={state.settings.directCorrection} onChange={(directCorrection) => updateSettings({ directCorrection })} label="اقتراح الصيغة مباشرة للمحترف" description="يعرض الصيغة كاختيار بعد فتح العدسة، ولا يغيّر النص تلقائيًا." />
          </div>
        </section>

        <section className="surface-card">
          <h2 className="text-xl font-extrabold">البيانات والعرض</h2>
          <p className="mt-1 text-brand-gray-dark">يُحذف التقدم التعليمي فقط. لا توجد رسائل كاملة مخزنة أصلًا.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={resetProgress} className="secondary-button border-brand-red text-brand-red"><Trash2 size={18} /> مسح البيانات التجريبية</button>
            <button type="button" onClick={() => navigate('/write?demo=1')} className="primary-button"><Play size={18} /> تشغيل العرض من البداية</button>
            <button type="button" onClick={() => navigate('/')} className="secondary-button sm:col-span-2"><RotateCcw size={18} /> العودة إلى شاشة البداية</button>
          </div>
        </section>
      </div>
    </div>
  );
}
