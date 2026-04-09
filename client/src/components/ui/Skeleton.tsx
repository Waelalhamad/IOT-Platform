import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={clsx('animate-shimmer rounded-lg', className)}
      style={style}
    />
  );
}

/** Skeleton for a device card row */
export function DeviceCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: '#0d1424',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-center gap-4">
        {/* Status icon */}
        <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
        {/* Info */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
          <Skeleton className="h-3 w-48" />
        </div>
        {/* Actions */}
        <div className="flex gap-2">
          <Skeleton className="h-7 w-16 rounded-xl" />
          <Skeleton className="h-7 w-7 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton for a widget card */
export function WidgetSkeleton() {
  return (
    <div
      className="w-full h-full rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: '#0d1424',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex justify-between">
        <Skeleton className="w-9 h-9 rounded-xl" />
      </div>
      <Skeleton className="h-2.5 w-16" />
      <Skeleton className="h-8 w-24 mt-1" />
      <div className="mt-auto flex justify-between">
        <Skeleton className="h-2.5 w-12" />
        <Skeleton className="h-2.5 w-10" />
      </div>
    </div>
  );
}

/** Skeleton for the dashboard topbar device name area */
export function TopbarSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-14 rounded-full" />
    </div>
  );
}
