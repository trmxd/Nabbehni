interface HeaderBrandMarkProps {
  className?: string;
}

export function HeaderBrandMark({ className = '' }: HeaderBrandMarkProps) {
  return (
    <span
      className={`grid h-11 w-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-brand-white ${className}`}
      aria-hidden="true"
    >
      <img
        src="/assets/nabbehni-header-mark.png"
        alt=""
        className="h-10 w-auto object-contain"
        width="27"
        height="40"
      />
    </span>
  );
}
