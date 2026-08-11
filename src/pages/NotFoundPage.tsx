import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-brand-gray-light px-4" dir="rtl">
      <section className="max-w-md rounded-[28px] bg-brand-white p-7 text-center shadow-soft">
        <div className="text-sm font-bold text-brand-red">صفحة غير موجودة</div>
        <h1 className="mt-2 text-3xl font-extrabold">يبدو أن هذا المسار يحتاج إلى مراجعة.</h1>
        <p className="mt-3 text-brand-gray-dark">لا بأس، يمكنك العودة إلى المساحة الرئيسية والمحاولة من جديد.</p>
        <Link to="/home" className="primary-button mt-6 w-full"><Home size={18} /> العودة للرئيسية</Link>
      </section>
    </main>
  );
}
