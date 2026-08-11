import { motion } from 'framer-motion';
import { ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { useAppState } from '../hooks/useAppState';

export function SplashPage() {
  const { state } = useAppState();
  const animations = state.settings.animations && !state.settings.reduceMotion;

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-brand-white px-5 py-10" dir="rtl">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-red-soft" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: animations ? 18 : 0, scale: animations ? 0.97 : 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: animations ? 0.55 : 0, ease: 'easeOut' }}
        >
          <BrandLogo size="large" />
        </motion.div>
        <div className="mt-2 inline-flex rounded-full bg-brand-red-soft px-4 py-2 text-sm font-bold text-brand-red">لأن كل حرف يفرق</div>
        <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-6xl">تعلّم من الحرف، لا من التصحيح فقط</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-brand-gray-dark sm:text-xl">
          مساعد ذكي يحول أخطاء الكتابة العربية إلى لحظات تعلم تفاعلية.
        </p>
        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <Link to="/choose" className="primary-button flex-1">
            ابدأ التجربة <ArrowLeft size={19} aria-hidden="true" />
          </Link>
          <Link to="/about" className="secondary-button flex-1">
            <Info size={19} aria-hidden="true" /> تعرّف إلى الفكرة
          </Link>
        </div>
        <p className="mt-7 flex items-center gap-2 text-sm text-brand-gray-text">
          <span className="h-2 w-2 rounded-full bg-brand-red" aria-hidden="true" />
          نموذج تجريبي يعمل محليًا ويحترم الخصوصية
        </p>
      </div>
    </main>
  );
}
