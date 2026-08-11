import { BarChart3, BookOpenCheck, Home, PenLine, Settings, ShieldCheck, Watch, Users, Info, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { HeaderBrandMark } from './HeaderBrandMark';
import { PageTransition } from './PageTransition';

const primaryItems = [
  { to: '/home', label: 'الرئيسية', icon: Home },
  { to: '/write', label: 'اكتب', icon: PenLine },
  { to: '/review', label: 'مراجعتي', icon: BookOpenCheck },
  { to: '/fingerprint', label: 'بصمتي', icon: BarChart3 },
  { to: '/settings', label: 'الإعدادات', icon: Settings },
];

const secondaryItems = [
  { to: '/watch', label: 'تجربة الساعة', icon: Watch },
  { to: '/family', label: 'متابعة الأسرة', icon: Users },
  { to: '/about', label: 'كيف يعمل نَبِّهني؟', icon: Info },
];

function DesktopLink({ to, label, icon: Icon }: (typeof primaryItems)[number]) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${
        isActive ? 'bg-brand-black text-brand-white' : 'text-brand-gray-dark hover:bg-brand-gray-light'
      }`}
    >
      <Icon size={20} aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  );
}

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, search } = useLocation();

  return (
    <div className="min-h-screen bg-brand-white lg:grid lg:grid-cols-[260px_1fr]" dir="rtl">
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-[260px] border-l border-brand-gray-border bg-brand-white px-4 py-5 lg:flex lg:flex-col">
        <NavLink to="/home" className="mb-7 flex items-center gap-3 px-2" aria-label="الذهاب إلى الرئيسية">
          <BrandLogo size="small" />
          <div>
            <div className="text-xl font-extrabold leading-none">نَبِّهني</div>
            <div className="mt-1 text-xs text-brand-gray-text">لأن كل حرف يفرق</div>
          </div>
        </NavLink>
        <nav className="space-y-1" aria-label="التنقل الرئيسي">
          {primaryItems.map((item) => <DesktopLink key={item.to} {...item} />)}
        </nav>
        <div className="my-4 border-t border-brand-gray-border" />
        <nav className="space-y-1" aria-label="روابط إضافية">
          {secondaryItems.map((item) => <DesktopLink key={item.to} {...item} />)}
        </nav>
        <div className="mt-auto rounded-2xl bg-brand-red-soft p-4 text-sm leading-6 text-brand-gray-dark">
          <ShieldCheck className="mb-2 text-brand-red" size={20} aria-hidden="true" />
          تجري المعالجة محليًا، ولا تُشارك النصوص مع الأسرة.
        </div>
      </aside>

      <div className="lg:col-start-2">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-brand-gray-border bg-brand-white/95 px-4 backdrop-blur sm:px-6 lg:hidden">
          <NavLink to="/home" className="flex h-full items-center gap-2" aria-label="الذهاب إلى الرئيسية">
            <HeaderBrandMark />
            <span className="font-extrabold">نَبِّهني</span>
          </NavLink>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-brand-gray-border"
            aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          {menuOpen && (
            <div className="absolute inset-x-4 top-[68px] rounded-2xl border border-brand-gray-border bg-brand-white p-3 shadow-soft">
              {secondaryItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-2 font-bold hover:bg-brand-gray-light"
                >
                  <item.icon size={20} /> {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </header>

        <main id="main-content">
          <PageTransition transitionKey={`${pathname}${search}`}><Outlet /></PageTransition>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-brand-gray-border bg-brand-white px-1 pb-[max(.4rem,env(safe-area-inset-bottom))] pt-1 lg:hidden" aria-label="التنقل السفلي">
        {primaryItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex min-h-[58px] flex-col items-center justify-center gap-0.5 rounded-xl text-[12px] font-bold transition ${
              isActive ? 'bg-brand-red-soft text-brand-red' : 'text-brand-gray-dark'
            }`}
          >
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
