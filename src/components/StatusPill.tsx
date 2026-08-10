import type { ReactNode } from 'react';

export function StatusPill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'alert' | 'dark' }) {
  const styles = {
    neutral: 'bg-brand-gray-light text-brand-gray-dark',
    alert: 'bg-brand-red-soft text-brand-red',
    dark: 'bg-brand-black text-brand-white',
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${styles[tone]}`}>{children}</span>;
}
