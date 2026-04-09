import { useRef, useEffect, useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSensorStore } from '../../store/sensorStore';
import { useI18n } from '../../i18n/context';
import type { ValueCardConfig } from '../../types/widget.types';

interface Props {
  deviceId: string; sensorType: string; config: ValueCardConfig;
  isEditMode: boolean; onRemove: () => void;
}

function useAnimated(value: number) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const start = prev.current, end = value, t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / 380, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (end - start) * e);
      if (p < 1) requestAnimationFrame(tick); else prev.current = end;
    };
    requestAnimationFrame(tick);
  }, [value]);
  return display;
}

const ICON_COLORS: Record<string, { bg: string; color: string }> = {
  hcsr04:  { bg: 'rgba(249,115,22,0.12)',  color: '#f97316' },
  tcs230:  { bg: 'rgba(139,92,246,0.12)',  color: '#8b5cf6' },
  default: { bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6' },
};

export default function ValueCard({ deviceId, sensorType, config, isEditMode, onRemove }: Props) {
  const { t } = useI18n();
  const reading = useSensorStore((s) => s.getReading(deviceId, sensorType));
  const prevVal = useRef<number | null>(null);
  const [hasData, setHasData] = useState(false);
  const [trend, setTrend] = useState<'up' | 'down' | 'flat'>('flat');
  const [live, setLive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const raw = typeof reading?.value === 'number' ? reading.value : null;
  const animated = useAnimated(raw ?? 0);

  useEffect(() => {
    if (raw === null) return;
    setHasData(true);
    if (prevVal.current !== null)
      setTrend(raw > prevVal.current ? 'up' : raw < prevVal.current ? 'down' : 'flat');
    prevVal.current = raw;
    setLive(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLive(false), 3000);
  }, [raw]);

  const cfg = config ?? {} as ValueCardConfig;
  const label = cfg.label ?? sensorType.toUpperCase();
  const unit = cfg.unit ?? reading?.unit ?? '';
  const decimals = raw !== null && raw % 1 !== 0 ? 1 : 0;
  const iconStyle = ICON_COLORS[sensorType] ?? ICON_COLORS.default;

  return (
    <div className="widget-card relative w-full h-full flex flex-col justify-between p-5 overflow-hidden group">
      {/* Subtle top-left glow on live */}
      {live && (
        <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 0% 0%, rgba(16,185,129,0.06) 0%, transparent 70%)' }} />
      )}

      {/* Top row: icon + remove */}
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 rounded-xl flex-shrink-0"
          style={{ background: iconStyle.bg }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={iconStyle.color} strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
        {isEditMode && (
          <button
            onClick={onRemove}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-red transition-colors"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <XMarkIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Label */}
      <span className="text-[10px] font-bold text-lo uppercase tracking-widest font-mono">{label}</span>

      {/* Value */}
      <div className="flex items-baseline gap-1.5 mt-1">
        {hasData ? (
          <>
            <span className="font-mono font-bold text-hi tabular-nums" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)' }}>
              {animated.toFixed(decimals)}
            </span>
            <span className="text-sm font-medium text-mid">{unit}</span>
          </>
        ) : (
          <div className="w-24 h-8 rounded-lg animate-shimmer" />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1">
          {trend === 'up' && (
            <span className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-green">
              <ArrowUpIcon className="w-3 h-3" /> {t.widgets.rising}
            </span>
          )}
          {trend === 'down' && (
            <span className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-red">
              <ArrowDownIcon className="w-3 h-3" /> {t.widgets.falling}
            </span>
          )}
          {trend === 'flat' && hasData && (
            <span className="text-[10px] font-mono text-lo">{t.widgets.stable}</span>
          )}
        </div>
        <span
          className="text-[10px] font-mono font-bold transition-colors duration-300"
          style={{ color: live ? '#10b981' : '#3d5070' }}
        >
          {live ? `● ${t.widgets.live}` : `○ ${t.widgets.idle}`}
        </span>
      </div>
    </div>
  );
}
