import { useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSensorStore } from '../../store/sensorStore';
import { useI18n } from '../../i18n/context';
import CopyButton from '../ui/CopyButton';

interface Props { deviceId: string; isEditMode: boolean; onRemove: () => void; }

function toHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

export default function ColorPreviewWidget({ deviceId, isEditMode, onRemove }: Props) {
  const { t } = useI18n();
  const reading = useSensorStore((s) => s.getReading(deviceId, 'tcs230'));
  const rgb = reading?.value && typeof reading.value === 'object' && 'r' in reading.value
    ? reading.value as { r: number; g: number; b: number } : null;
  const hex = useMemo(() => rgb ? toHex(rgb.r, rgb.g, rgb.b) : null, [rgb]);

  const channels = [
    { label: 'R', val: rgb?.r ?? 0, color: '#ef4444', bg: 'rgba(239,68,68,0.10)' },
    { label: 'G', val: rgb?.g ?? 0, color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
    { label: 'B', val: rgb?.b ?? 0, color: '#3b82f6', bg: 'rgba(59,130,246,0.10)' },
  ];

  return (
    <div className="widget-card relative w-full h-full flex flex-col overflow-hidden">
      {isEditMode && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-lg flex items-center justify-center text-red transition-colors"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <XMarkIcon className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Label */}
      <div className="px-5 pt-4 pb-2 flex-shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-lo font-mono">
          {t.widgets.tcs230Label}
        </span>
      </div>

      {/* Swatch — CSS transition on background-color */}
      <div
        className="mx-5 rounded-xl flex-1 min-h-0 relative overflow-hidden"
        style={{
          backgroundColor: hex ?? '#111827',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: hex ? `0 4px 28px ${hex}40` : 'none',
          transition: 'background-color 0.6s cubic-bezier(0.4,0,0.2,1), box-shadow 0.6s ease',
        }}
      >
        {!hex && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse-dot" style={{ background: '#3d5070' }} />
            <span className="text-[10px] font-mono text-lo">{t.widgets.awaitingData}</span>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="px-5 py-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-mono font-bold uppercase" style={{ color: hex ?? '#3d5070' }}>
            {hex ?? '—— —— ——'}
          </span>
          {hex && <CopyButton text={hex} />}
        </div>

        <div className="flex flex-col gap-1.5">
          {channels.map(({ label, val, color, bg }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-4 text-[10px] font-mono font-bold" style={{ color }}>{label}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: bg }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(val / 255) * 100}%`,
                    backgroundColor: color,
                    boxShadow: `0 0 4px ${color}60`,
                    transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
              </div>
              <span className="w-7 text-right text-[10px] font-mono tabular-nums text-mid">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
