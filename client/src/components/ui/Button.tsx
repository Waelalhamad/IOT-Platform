import { clsx } from 'clsx';
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import Spinner from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variants = {
  primary:   'bg-primary text-white font-semibold hover:bg-sky-400 active:bg-sky-600',
  secondary: 'text-hi border border-border hover:border-border-hi hover:bg-elevated',
  danger:    'text-red border border-red/20 bg-red-dim hover:bg-red hover:text-white hover:border-red',
  ghost:     'text-mid hover:text-hi hover:bg-elevated',
};

const sizes = {
  sm: 'h-7 px-3 text-[11px] gap-1.5',
  md: 'h-9 px-4 text-xs gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', loading, disabled, children, className, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center rounded-xl font-mono tracking-wide',
        'transition-all duration-150 select-none cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variant === 'primary' && 'shadow-sm',
        variants[variant], sizes[size], className,
      )}
      style={variant === 'primary' ? { boxShadow: '0 0 16px rgba(14,165,233,0.25)' } : undefined}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
export default Button;
