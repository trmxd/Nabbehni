interface BrandLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizes = {
  small: 'h-10 w-10',
  medium: 'h-20 w-20',
  large: 'h-44 w-44 sm:h-56 sm:w-56',
};

export function BrandLogo({ size = 'medium', className = '' }: BrandLogoProps) {
  return (
    <img
      src="./assets/nabbehni-logo.png"
      alt="شعار نَبِّهني — لأن كل حرف يفرق"
      className={`${sizes[size]} shrink-0 object-contain ${className}`}
      width={size === 'large' ? 224 : size === 'medium' ? 80 : 40}
      height={size === 'large' ? 224 : size === 'medium' ? 80 : 40}
    />
  );
}
