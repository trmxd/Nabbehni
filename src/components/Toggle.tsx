export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (checked: boolean) => void; label: string; description?: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-brand-gray-border p-4">
      <span>
        <span className="block font-extrabold text-brand-black">{label}</span>
        {description && <span className="mt-1 block text-sm text-brand-gray-text">{description}</span>}
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
      <span className="relative h-7 w-12 shrink-0 rounded-full bg-brand-gray-border transition peer-checked:bg-brand-black peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-red">
        <span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-brand-white shadow-sm transition-transform peer-checked:-translate-x-5" />
      </span>
    </label>
  );
}
