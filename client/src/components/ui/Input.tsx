import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, hint, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-medium text-mid font-mono tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lo pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full h-10 rounded-xl border font-body text-sm text-hi',
            'bg-elevated outline-none transition-all duration-150',
            'placeholder:text-lo',
            'pr-3.5',
            icon ? 'pl-10' : 'pl-3.5',
            error
              ? 'border-red/40 focus:border-red focus:ring-2 focus:ring-red/10'
              : 'border-border hover:border-border-hi focus:border-primary focus:ring-2 focus:ring-primary/10',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-red mt-0.5">{error}</p>}
      {hint && !error && <p className="text-[11px] text-lo mt-0.5">{hint}</p>}
    </div>
  )
);
Input.displayName = 'Input';
export default Input;
