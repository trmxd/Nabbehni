import { Delete, Space } from 'lucide-react';

const rows = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج'],
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  ['ئ', 'ء', 'ؤ', 'ر', 'ى', 'ة', 'و', 'ز', 'ظ', 'د', 'ذ'],
];

export function VirtualKeyboard({ onType, onBackspace }: { onType: (value: string) => void; onBackspace: () => void }) {
  return (
    <section className="rounded-[24px] border border-brand-gray-border bg-brand-gray-light p-2 sm:p-4" aria-label="محاكاة لوحة المفاتيح العربية">
      <div className="mb-2 flex items-center justify-between px-1 text-xs font-bold text-brand-gray-text">
        <span>محاكاة لوحة المفاتيح الذكية</span>
        <span className="inline-flex items-center gap-1 text-brand-red"><span className="h-2 w-2 rounded-full bg-brand-red" /> تعمل محليًا</span>
      </div>
      <div className="space-y-1.5" dir="rtl">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-11 gap-1 sm:gap-1.5">
            {row.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => onType(letter)}
                className="grid min-h-9 place-items-center rounded-lg bg-brand-white text-sm font-bold shadow-sm transition active:bg-brand-red-soft sm:min-h-11 sm:text-base"
                aria-label={`اكتب حرف ${letter}`}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
        <div className="grid grid-cols-[1fr_3fr_1fr] gap-1.5">
          <button type="button" onClick={onBackspace} className="grid min-h-10 place-items-center rounded-lg bg-brand-white" aria-label="حذف آخر حرف"><Delete size={18} /></button>
          <button type="button" onClick={() => onType(' ')} className="grid min-h-10 place-items-center rounded-lg bg-brand-white" aria-label="مسافة"><Space size={19} /></button>
          <button type="button" onClick={() => onType('،')} className="grid min-h-10 place-items-center rounded-lg bg-brand-white font-bold" aria-label="فاصلة عربية">،</button>
        </div>
      </div>
    </section>
  );
}
