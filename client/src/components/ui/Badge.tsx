import { clsx } from 'clsx';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'accent' | 'muted';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variants: Record<BadgeVariant, { wrap: string; dot: string }> = {
  success: { wrap: 'text-green  bg-green-dim  border border-green/20',   dot: 'bg-green' },
  danger:  { wrap: 'text-red    bg-red-dim    border border-red/20',     dot: 'bg-red' },
  warning: { wrap: 'text-amber  bg-amber-dim  border border-amber/20',   dot: 'bg-amber' },
  accent:  { wrap: 'text-primary bg-primary-dim border border-primary/20', dot: 'bg-primary' },
  muted:   { wrap: 'text-mid   bg-elevated   border border-border',      dot: 'bg-lo' },
};

export default function Badge({ variant = 'muted', children, dot, className }: BadgeProps) {
  const v = variants[variant];
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold tracking-wide',
      v.wrap, className,
    )}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', v.dot)} />}
      {children}
    </span>
  );
}
