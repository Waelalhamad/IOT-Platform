import { useState } from 'react';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { useSensorHistory } from '../../hooks/useSensorHistory';
import { useI18n } from '../../i18n/context';
import type { LineChartConfig } from '../../types/widget.types';
import type { SensorHistoryPoint } from '../../types/sensor.types';

interface Props {
  deviceId: string; sensorType: string; config: LineChartConfig;
  isEditMode: boolean; onRemove: () => void;
}

const RANGES = ['1h', '6h', '24h', '7d'] as const;

const CustomTooltip = ({ active, payload, label, unit }: {
  active?: boolean; payload?: { value: number }[]; label?: string; unit?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2.5 rounded-xl text-[11px] font-mono"
      style={{
        background: '#0d1424',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }}>
      <p className="text-lo mb-1">{label ? format(new Date(label), 'MMM d · HH:mm:ss') : ''}</p>
      <p className="text-primary font-bold">{payload[0]?.value?.toFixed(2)}<span className="text-lo font-normal ml-1">{unit}</span></p>
    </div>
  );
};

export default function LineChartWidget({ deviceId, sensorType, config, isEditMode, onRemove }: Props) {
  const { t } = useI18n();
  const cfg = config ?? {} as LineChartConfig;
  const [range, setRange] = useState<'1h' | '6h' | '24h' | '7d'>(cfg.defaultRange ?? '1h');
  const { data, isLoading } = useSensorHistory(deviceId, sensorType, range);
  const unit = cfg.unit ?? '';
  const label = cfg.label ?? sensorType.toUpperCase();

  const chartData = (data ?? [])
    .map((p: SensorHistoryPoint) => ({ ts: p.timestamp, value: typeof p.value === 'number' ? p.value : null }))
    .filter(d => d.value !== null);

  const gradId = `g-${deviceId.slice(-4)}-${sensorType}`;

  return (
    <div className="widget-card relative w-full h-full flex flex-col p-5">
      {isEditMode && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-lg flex items-center justify-center text-red transition-colors"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <XMarkIcon className="w-3.5 h-3.5" />
        </button>
      )}

      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm text-hi">{label}</span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-lo">
            <span className="w-2 h-2 rounded-full bg-primary inline-block"
              style={{ boxShadow: '0 0 6px rgba(14,165,233,0.5)' }} />
            {sensorType}
          </span>
        </div>
        <div className="flex gap-0.5">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={clsx(
                'px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all duration-150',
                r === range
                  ? 'bg-primary text-white'
                  : 'text-lo hover:text-hi',
              )}
              style={r === range
                ? { boxShadow: '0 0 10px rgba(14,165,233,0.3)' }
                : { background: 'rgba(255,255,255,0.04)' }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="h-full flex flex-col gap-2 items-stretch justify-center px-2">
            <div className="h-2 rounded animate-shimmer" />
            <div className="h-2 rounded animate-shimmer w-3/4" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <span className="text-[11px] font-mono text-lo">{t.noDataYet.toUpperCase()}</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 2, bottom: 0, left: -14 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#0ea5e9" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="ts"
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return range === '7d' ? format(d, 'MM/dd') : format(d, 'HH:mm');
                }}
                tick={{ fill: '#3d5070', fontSize: 8, fontFamily: "'JetBrains Mono', monospace" }}
                tickLine={false} axisLine={false} interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#3d5070', fontSize: 8, fontFamily: "'JetBrains Mono', monospace" }}
                tickLine={false} axisLine={false} width={28}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ stroke: 'rgba(14,165,233,0.3)', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Area
                type="monotone" dataKey="value"
                stroke="#0ea5e9" strokeWidth={2}
                fill={`url(#${gradId})`}
                dot={false}
                activeDot={{ r: 4, fill: '#0ea5e9', stroke: '#0d1424', strokeWidth: 2 }}
                animationDuration={350}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
