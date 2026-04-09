import { clsx } from 'clsx';

interface SpinnerProps { size?: 'sm' | 'md' | 'lg'; className?: string; }

const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-8 h-8' };

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={clsx(
        'rounded-full border-[2.5px] border-primary/20 border-t-primary animate-spin',
        sizes[size], className,
      )}
    />
  );
}
