import { motion } from 'framer-motion';
import { Home, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { useAppState } from '../hooks/useAppState';

export function DemoCompletePage() {
  const { state } = useAppState();
  const animations = state.settings.animations && !state.settings.reduceMotion;
  return (
    <main className="grid min-h-screen place-items-center bg-brand-gray-light px-4 py-8" dir="rtl">
      <motion.section className="w-full max-w-2xl rounded-[30px] border border-brand-gray-border bg-brand-white p-6 text-center shadow-soft sm:p-10" initial={{ opacity: 0, y: animations ? 18 : 0 }} animate={{ opacity: 1, y: 0 }}>
        <BrandLogo size="large" className="mx-auto" />
        <div className="mx-auto mt-2 inline-flex rounded-full bg-brand-red-soft px-4 py-2 text-sm font-bold text-brand-red">اكتملت الرحلة</div>
        <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">نَبِّهني لا يصحح الحرف فقط، بل يساعدك على تذكره.</h1>
        <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-brand-gray-dark">نبضة، ثم محاولة، ثم قاعدة قصيرة، ثم مراجعة في الوقت المناسب.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/write?demo=1" className="primary-button"><RotateCcw size={18} /> إعادة العرض</Link>
          <Link to="/home" className="secondary-button"><Home size={18} /> العودة للرئيسية</Link>
        </div>
      </motion.section>
    </main>
  );
}
