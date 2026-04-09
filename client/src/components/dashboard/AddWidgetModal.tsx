import { useState } from 'react';
import { ChartBarIcon, AdjustmentsHorizontalIcon, Squares2X2Icon, EyeDropperIcon, SignalIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useI18n } from '../../i18n/context';
import type { WidgetType, GridWidget } from '../../types/widget.types';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (widget: Omit<GridWidget, 'i' | 'x' | 'y'>) => void;
}

const WIDGET_TYPES = [
  { type: 'value-card'    as WidgetType, icon: Squares2X2Icon,           w: 3, h: 2 },
  { type: 'gauge'         as WidgetType, icon: AdjustmentsHorizontalIcon, w: 3, h: 3 },
  { type: 'line-chart'    as WidgetType, icon: ChartBarIcon,              w: 6, h: 3 },
  { type: 'color-preview' as WidgetType, icon: EyeDropperIcon,            w: 3, h: 3 },
  { type: 'status-badge'  as WidgetType, icon: SignalIcon,                w: 2, h: 2 },
];

const PRESET_KEYS = ['hcsr04', 'tcs230'] as const;

export default function AddWidgetModal({ open, onClose, onAdd }: Props) {
  const [step, setStep] = useState(1);
  const [wt, setWt]     = useState<(typeof WIDGET_TYPES)[0] | null>(null);
  const [sensor, setSensor]   = useState('');
  const [custom, setCustom]   = useState('');
  const [cfg, setCfg]         = useState<Record<string, unknown>>({});
  const { t } = useI18n();

  const reset = () => { setStep(1); setWt(null); setSensor(''); setCustom(''); setCfg({}); };
  const close = () => { reset(); onClose(); };
  const finalSensor = sensor === 'custom' ? custom : sensor;

  const add = () => {
    if (!wt || !finalSensor) return;
    onAdd({ type: wt.type, sensorType: finalSensor, w: wt.w, h: wt.h, config: cfg });
    close();
  };

  return (
    <Modal open={open} onClose={close} title={t.addWidget.titleStep(step)} size="md">
      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s}
            className={clsx('flex-1 h-0.5 rounded-full transition-all duration-300', s < step ? 'bg-primary' : s === step ? 'bg-primary/40' : 'bg-border')}
            style={s <= step ? { boxShadow: '0 0 6px rgba(14,165,233,0.4)' } : undefined}
          />
        ))}
      </div>

      {/* Step 1 — Widget type */}
      {step === 1 && (
        <div className="grid gap-2">
          {WIDGET_TYPES.map((wtype) => {
            const meta = t.addWidget.widgetLabels[wtype.type];
            return (
              <button
                key={wtype.type}
                onClick={() => { setWt(wtype); setStep(2); }}
                className="flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all duration-150"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(14,165,233,0.3)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(14,165,233,0.07)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'; }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-mid"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <wtype.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-hi">{meta.label}</p>
                  <p className="text-[11px] text-mid mt-0.5">{meta.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 2 — Sensor */}
      {step === 2 && (
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-medium text-lo mb-1 uppercase tracking-wide font-mono">
            {t.addWidget.selectSensor}
          </p>
          {PRESET_KEYS.map((key) => {
            const p = t.addWidget.presets[key];
            return (
              <button
                key={key}
                onClick={() => { setSensor(key); setStep(3); }}
                className="flex items-center justify-between p-4 rounded-xl border transition-all duration-150 text-left"
                style={sensor === key
                  ? { borderColor: 'rgba(14,165,233,0.35)', background: 'rgba(14,165,233,0.08)' }
                  : { borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
              >
                <div>
                  <p className="text-sm font-semibold text-hi">{p.label}</p>
                  <p className="text-[11px] font-mono text-mid mt-0.5">{p.sub}</p>
                </div>
                <span className="text-[10px] font-mono text-lo rounded-lg px-2 py-1"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {key}
                </span>
              </button>
            );
          })}
          <Input
            label={t.addWidget.customSensorLabel}
            placeholder={t.addWidget.customSensorPlaceholder}
            value={custom}
            onChange={(e) => { setSensor('custom'); setCustom(e.target.value); }}
          />
          <div className="flex gap-2 mt-1">
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>{t.back}</Button>
            <Button variant="primary" size="sm" disabled={!finalSensor} onClick={() => setStep(3)}>{t.next}</Button>
          </div>
        </div>
      )}

      {/* Step 3 — Config */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-mono"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-lo">{t.addWidget.summaryType}</span>
            <span className="text-primary font-bold">{wt ? t.addWidget.widgetLabels[wt.type].label.toUpperCase() : ''}</span>
            <span className="text-lo mx-1">·</span>
            <span className="text-lo">{t.addWidget.summarySensor}</span>
            <span className="text-primary font-bold">{finalSensor.toUpperCase()}</span>
          </div>

          {wt?.type === 'gauge' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Input label={t.addWidget.minLabel} type="number" value={(cfg.min as string) ?? '0'}
                  onChange={(e) => setCfg(c => ({ ...c, min: Number(e.target.value) }))} />
                <Input label={t.addWidget.maxLabel} type="number" value={(cfg.max as string) ?? '100'}
                  onChange={(e) => setCfg(c => ({ ...c, max: Number(e.target.value) }))} />
              </div>
              <Input label={t.addWidget.unitLabel} placeholder={t.addWidget.unitPlaceholder}
                value={(cfg.unit as string) ?? ''}
                onChange={(e) => setCfg(c => ({ ...c, unit: e.target.value }))} />
            </>
          )}

          {wt?.type === 'value-card' && (
            <>
              <Input label={t.addWidget.labelLabel} placeholder={finalSensor}
                value={(cfg.label as string) ?? ''}
                onChange={(e) => setCfg(c => ({ ...c, label: e.target.value }))} />
              <Input label={t.addWidget.unitOverrideLabel} placeholder={t.addWidget.unitOverridePlaceholder}
                value={(cfg.unit as string) ?? ''}
                onChange={(e) => setCfg(c => ({ ...c, unit: e.target.value }))} />
            </>
          )}

          {wt?.type === 'line-chart' && (
            <>
              <Input label={t.addWidget.labelLabel} placeholder={finalSensor}
                value={(cfg.label as string) ?? ''}
                onChange={(e) => setCfg(c => ({ ...c, label: e.target.value }))} />
              <div>
                <label className="text-[11px] font-medium text-mid font-mono tracking-wide block mb-2">
                  {t.addWidget.defaultRangeLabel}
                </label>
                <div className="flex gap-1.5">
                  {['1h', '6h', '24h', '7d'].map((r) => (
                    <button key={r} onClick={() => setCfg(c => ({ ...c, defaultRange: r }))}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all"
                      style={cfg.defaultRange === r
                        ? { background: '#0ea5e9', color: '#fff', boxShadow: '0 0 10px rgba(14,165,233,0.3)' }
                        : { background: 'rgba(255,255,255,0.05)', color: '#7a8ba8', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {(wt?.type === 'color-preview' || wt?.type === 'status-badge') && (
            <div className="flex items-center justify-center py-8 rounded-xl border-2 border-dashed"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-[11px] font-mono text-lo">{t.addWidget.noConfigNeeded}</p>
            </div>
          )}

          <div className="flex gap-2 mt-1">
            <Button variant="ghost" size="sm" onClick={() => setStep(2)}>{t.back}</Button>
            <Button variant="primary" size="sm" onClick={add}>{t.addWidget.addWidget}</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
