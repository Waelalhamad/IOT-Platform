import { useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSensorStore } from '../../store/sensorStore';
import type { GaugeConfig } from '../../types/widget.types';

interface Props {
  deviceId: string; sensorType: string; config: GaugeConfig;
  isEditMode: boolean; onRemove: () => void;
}

export default function GaugeWidget({ deviceId, sensorType, config, isEditMode, onRemove }: Props) {
  const reading = useSensorStore((s) => s.getReading(deviceId, sensorType));
  const raw = typeof reading?.value === 'number' ? reading.value : null;

  const cfg = config ?? {} as GaugeConfig;
  const min = cfg.min ?? 0;
  const max = cfg.max ?? 100;
  const unit = cfg.unit ?? reading?.unit ?? '';
  const label = (cfg as { label?: string }).label ?? sensorType.toUpperCase();

  const { pct, arcColor, valueDash } = useMemo(() => {
    const pct = raw !== null ? Math.max(0, Math.min(1, (raw - min) / (max - min))) : 0;
    const thresholds = cfg.thresholds ?? [];
    let arcColor = '#0ea5e9';
    for (const t of [...thresholds].sort((a, b) => a.value - b.value)) {
      if (raw !== null && raw >= t.value) arcColor = t.color;
    }
    const C = 2 * Math.PI * 40;
    const sweep = 0.75;
    const valueDash = `${pct * sweep * C} ${C}`;
    return { pct, arcColor, valueDash };
  }, [raw, min, max, cfg.thresholds]);

  const C = 2 * Math.PI * 40;
  const sweep = 0.75;
  const bgDash = `${sweep * C} ${C}`;

  return (
    <div className="widget-card relative w-full h-full flex flex-col items-center justify-center p-4">
      {isEditMode && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-lg flex items-center justify-center text-red transition-colors"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <XMarkIcon className="w-3.5 h-3.5" />
        </button>
      )}

      <span className="text-[10px] font-bold uppercase tracking-widest text-lo mb-3 font-mono">{label}</span>

      <div className="relative flex-1 flex items-center justify-center w-full min-h-0">
        <svg viewBox="0 0 100 78" className="w-full max-w-[160px]">
          {/* bg arc */}
          <circle cx="50" cy="56" r="40" fill="none"
            stroke="rgba(255,255,255,0.07)" strokeWidth="7" strokeLinecap="round"
            strokeDasharray={bgDash} transform="rotate(135,50,56)" />
          {/* value arc */}
          <circle cx="50" cy="56" r="40" fill="none"
            stroke={arcColor} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={valueDash} transform="rotate(135,50,56)"
            style={{
              transition: 'stroke-dasharray 0.5s cubic-bezier(0.4,0,0.2,1), stroke 0.3s',
              filter: `drop-shadow(0 0 4px ${arcColor}60)`,
            }}
          />
          {/* Tick marks at 25%, 50%, 75% */}
          {[0.25, 0.5, 0.75].map((p) => {
            const angle = (135 + p * 270) * (Math.PI / 180);
            const r_inner = 34, r_outer = 37;
            const x1 = 50 + r_inner * Math.cos(angle);
            const y1 = 56 + r_inner * Math.sin(angle);
            const x2 = 50 + r_outer * Math.cos(angle);
            const y2 = 56 + r_outer * Math.sin(angle);
            return <line key={p} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />;
          })}
          {/* value text */}
          <text x="50" y="51" textAnchor="middle" fill="#f0f4ff"
            fontSize="13" fontWeight="bold" fontFamily="'JetBrains Mono', monospace">
            {raw !== null ? raw.toFixed(1) : '--'}
          </text>
          <text x="50" y="62" textAnchor="middle" fill="#7a8ba8"
            fontSize="6.5" fontFamily="'JetBrains Mono', monospace">{unit}</text>
          <text x="12"  y="74" fill="#3d5070" fontSize="5.5" fontFamily="'JetBrains Mono', monospace">{min}</text>
          <text x="88" y="74" textAnchor="end" fill="#3d5070" fontSize="5.5" fontFamily="'JetBrains Mono', monospace">{max}</text>
        </svg>
      </div>

      {/* progress bar */}
      <div className="w-full h-1 rounded-full mt-1 overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct * 100}%`,
            backgroundColor: arcColor,
            boxShadow: `0 0 6px ${arcColor}80`,
          }}
        />
      </div>

      {/* Percentage */}
      <p className="text-[9px] font-mono text-lo mt-1.5">{Math.round(pct * 100)}%</p>
    </div>
  );
}
