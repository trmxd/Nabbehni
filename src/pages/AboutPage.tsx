import { ArrowLeft, Check, Eye, Lightbulb, PenLine, RotateCcw, Watch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { PageHeader } from '../components/PageHeader';

const journey = [
  { title: 'يكتب المستخدم', icon: PenLine },
  { title: 'ينبض الحرف المحتمل خطؤه', icon: Eye },
  { title: 'يحاول المستخدم إصلاحه', icon: RotateCcw },
  { title: 'يفهم القاعدة', icon: Lightbulb },
  { title: 'يراجع الكلمة لاحقًا عبر الساعة', icon: Watch },
];

export function AboutPage() {
  return (
    <div className="page-wrap">
      <div className="mb-5"><BrandLogo size="medium" /></div>
      <PageHeader
        eyebrow="عن المشروع"
        title="طريقة جديدة للتعلم من الخطأ"
        description="تصلح أدوات التدقيق التقليدية الكلمة نيابةً عن المستخدم. أما نَبِّهني فيلفت انتباهه إلى الحرف، ويمنحه فرصة للمحاولة، ثم يشرح القاعدة ويعيد مراجعتها في الوقت المناسب."
        action={<Link to="/choose" className="primary-button">ابدأ التجربة <ArrowLeft size={18} /></Link>}
      />

      <section className="surface-card mb-6">
        <h2 className="text-xl font-extrabold">رحلة الحرف في خمس خطوات</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {journey.map(({ title, icon: Icon }, index) => (
            <div key={title} className="relative rounded-2xl bg-brand-gray-light p-4">
              <span className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-brand-black text-brand-white"><Icon size={19} /></span>
              <span className="text-sm font-bold text-brand-red">{index + 1}</span>
              <h3 className="mt-1 font-extrabold leading-6">{title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[24px] border border-brand-gray-border bg-brand-gray-light p-6">
          <p className="text-sm font-bold text-brand-gray-text">المدقق التقليدي</p>
          <h2 className="mt-1 text-2xl font-extrabold">تصحيح ينتهي عند الكلمة</h2>
          <ul className="mt-5 space-y-3 text-brand-gray-dark">
            {['يضع خطًا أحمر.', 'يعطي الإجابة.', 'ينتهي بعد التصحيح.'].map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true">—</span>{item}</li>)}
          </ul>
        </article>
        <article className="rounded-[24px] border-2 border-brand-black bg-brand-white p-6">
          <p className="text-sm font-bold text-brand-red">نَبِّهني</p>
          <h2 className="mt-1 text-2xl font-extrabold">تعلم يستمر بعد الكلمة</h2>
          <ul className="mt-5 space-y-3">
            {['يلفت الانتباه إلى الحرف.', 'يطلب محاولة المستخدم.', 'يشرح القاعدة.', 'يتذكر نمط الخطأ.', 'يقدم مراجعة لاحقة.'].map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 shrink-0 text-brand-red" size={19} />{item}</li>)}
          </ul>
        </article>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="surface-card">
          <h2 className="font-extrabold">القيمة الأساسية</h2>
          <p className="mt-2 leading-7 text-brand-gray-dark">اكتشاف الخطأ، محاولة المستخدم، فهم القاعدة، منع التكرار.</p>
        </article>
        <article className="surface-card">
          <h2 className="font-extrabold">للأسرة</h2>
          <p className="mt-2 leading-7 text-brand-gray-dark">يساعد نَبِّهني الأسرة على تشجيع الطفل ومتابعة تطوره، من دون الاطلاع على رسائله أو انتهاك خصوصيته.</p>
        </article>
        <article className="surface-card">
          <h2 className="font-extrabold">على الساعة</h2>
          <p className="mt-2 leading-7 text-brand-gray-dark">تقدم الساعة مراجعات قصيرة للكلمات المتكررة، ولا تراقب المحادثات.</p>
        </article>
      </section>

      <p className="mt-6 rounded-2xl bg-brand-red-soft p-4 text-center font-bold text-brand-gray-dark">
        يغطي النموذج الأولي مجموعة مختارة من الأخطاء الشائعة لإثبات تجربة الفكرة.
      </p>
    </div>
  );
}
