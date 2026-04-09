import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon, TrashIcon, ChartBarIcon, CpuChipIcon,
  ClockIcon, ExclamationTriangleIcon, ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { useDevices, useCreateDevice, useDeleteDevice, useRegenKey } from '../hooks/useDevices';
import { useI18n } from '../i18n/context';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import CopyButton from '../components/ui/CopyButton';
import { DeviceCardSkeleton } from '../components/ui/Skeleton';
import type { DeviceCredentials } from '../types/device.types';

function CredRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-mono font-bold tracking-widest text-lo mb-1">{label}</p>
        <p className="text-xs font-mono text-hi truncate">{value}</p>
      </div>
      <CopyButton text={value} />
    </div>
  );
}

export default function Devices() {
  const navigate = useNavigate();
  const { data: devices, isLoading } = useDevices();
  const createDevice = useCreateDevice();
  const deleteDevice = useDeleteDevice();
  const regenKey     = useRegenKey();
  const { t } = useI18n();

  const [showAdd, setShowAdd]   = useState(false);
  const [name, setName]         = useState('');
  const [creds, setCreds]       = useState<DeviceCredentials | null>(null);
  const [delId, setDelId]       = useState<string | null>(null);
  const [regenId, setRegenId]   = useState<string | null>(null);
  const [regenCreds, setRegenCreds] = useState<{ apiKey: string; mqttPassword: string; mqttUsername: string } | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) return;
    const res = await createDevice.mutateAsync(name.trim());
    setName(''); setShowAdd(false);
    setCreds(res.data.data);
  };

  const handleDelete = (id: string) => { deleteDevice.mutate(id); setDelId(null); };

  const handleRegen = async () => {
    if (!regenId) return;
    const res = await regenKey.mutateAsync(regenId);
    setRegenId(null);
    setRegenCreds(res.data.data);
  };

  const deviceCount = devices?.length ?? 0;
  const countLabel = deviceCount === 1 ? t.devices.countSingular : t.devices.countPlural(deviceCount);

  return (
    <div className="w-full min-w-0 px-6 py-8">
      <div className="mx-auto max-w-3xl">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-hi mb-1">{t.devices.title}</h1>
            <p className="text-sm text-mid">{countLabel}</p>
          </div>
          <Button variant="primary" size="md" onClick={() => setShowAdd(true)}>
            <PlusIcon className="w-4 h-4" />{t.devices.addDevice}
          </Button>
        </div>

        {/* ── Device list ── */}
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => <DeviceCardSkeleton key={i} />)}
          </div>
        ) : !devices?.length ? (
          <div className="flex flex-col items-center justify-center py-28 rounded-3xl border-2 border-dashed"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(13,20,36,0.5)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}>
              <CpuChipIcon className="w-8 h-8 text-lo" />
            </div>
            <p className="text-sm font-semibold text-mid mb-2">{t.devices.noDevices}</p>
            <p className="text-xs text-lo mb-8 text-center max-w-[24ch] leading-relaxed">
              {t.devices.noDevicesHint}
            </p>
            <Button variant="primary" size="md" onClick={() => setShowAdd(true)}>
              <PlusIcon className="w-4 h-4" />{t.devices.addDevice}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {devices.map((device) => (
              <div
                key={device._id}
                className="rounded-2xl p-5 transition-all duration-200"
                style={{
                  background: '#0d1424',
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.13)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={device.status === 'online'
                      ? { background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)' }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <CpuChipIcon className="w-5 h-5"
                      style={{ color: device.status === 'online' ? '#10b981' : '#3d5070' }} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                      <span className="font-semibold text-sm text-hi">{device.name}</span>
                      <Badge variant={device.status === 'online' ? 'success' : 'muted'} dot>
                        {device.status === 'online' ? t.online.toUpperCase() : t.offline.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-[11px] font-mono text-mid">{device.mqttTopic}</span>
                      {device.lastSeen && (
                        <span className="text-[11px] font-mono text-lo flex items-center gap-1.5">
                          <ClockIcon className="w-3 h-3" />
                          {formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ms-2">
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/dashboard/${device._id}`)}>
                      <ChartBarIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t.devices.openDashboard}</span>
                    </Button>
                    <Button variant="secondary" size="sm" title={t.devices.regenTooltip}
                      onClick={() => setRegenId(device._id)}>
                      <ArrowPathIcon className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setDelId(device._id)}>
                      <TrashIcon className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Add Device Modal ── */}
      <Modal open={showAdd} onClose={() => { setShowAdd(false); setName(''); }} title={t.devices.addModal.title}>
        <div className="flex flex-col gap-5">
          <p className="text-sm text-mid leading-relaxed">{t.devices.addModal.hint}</p>
          <Input label={t.devices.addModal.nameLabel} placeholder={t.devices.addModal.namePlaceholder}
            value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }} autoFocus />
          <Button variant="primary" size="md" onClick={handleCreate}
            loading={createDevice.isPending} disabled={!name.trim()}>
            {t.devices.addModal.submit}
          </Button>
        </div>
      </Modal>

      {/* ── Credentials Modal (on create) ── */}
      <Modal open={!!creds} onClose={() => setCreds(null)} title={t.devices.credsModal.title} size="md">
        {creds && (
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3.5 p-4 rounded-xl"
              style={{ border: '1px solid rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.08)' }}>
              <ExclamationTriangleIcon className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber mb-1">{t.devices.credsModal.warning}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(245,158,11,0.7)' }}>
                  {t.devices.credsModal.warningHint}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <CredRow label={t.devices.credsModal.deviceId}    value={creds._id} />
              <CredRow label={t.devices.credsModal.mqttUsername} value={creds.mqttUsername} />
              <CredRow label={t.devices.credsModal.mqttPassword} value={creds.mqttPassword} />
              <CredRow label={t.devices.credsModal.mqttTopic}   value={creds.mqttTopic} />
              <CredRow label={t.devices.credsModal.apiKey}      value={creds.apiKey} />
            </div>
            <div className="rounded-xl px-4 py-4 text-[11px] font-mono"
              style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-primary font-bold mb-2">{t.devices.credsModal.quickStart}</p>
              <p className="text-mid leading-relaxed">{t.devices.credsModal.quickStartDesc}</p>
              <p className="text-lo mt-2 break-all leading-relaxed">
                {'{"sensors":[{"type":"hcsr04","value":24.5,"unit":"cm"}]}'}
              </p>
            </div>
            <Button variant="primary" size="md"
              onClick={() => { setCreds(null); navigate(`/dashboard/${creds._id}`); }}>
              {t.devices.credsModal.goToDashboard}
            </Button>
          </div>
        )}
      </Modal>

      {/* ── Regen Confirm Modal ── */}
      <Modal open={!!regenId} onClose={() => setRegenId(null)} title={t.devices.regenModal.title} size="sm">
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3.5 p-4 rounded-xl"
            style={{ border: '1px solid rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.08)' }}>
            <ExclamationTriangleIcon className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(245,158,11,0.8)' }}>
              {t.devices.regenModal.warning}
            </p>
          </div>
          <div className="flex gap-2.5">
            <Button variant="ghost" size="sm" onClick={() => setRegenId(null)} className="flex-1">{t.cancel}</Button>
            <Button variant="primary" size="sm" loading={regenKey.isPending} onClick={handleRegen} className="flex-1">
              {t.devices.regenModal.submit}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Regen Result Modal ── */}
      <Modal open={!!regenCreds} onClose={() => setRegenCreds(null)} title={t.devices.regenResultModal.title} size="md">
        {regenCreds && (
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3.5 p-4 rounded-xl"
              style={{ border: '1px solid rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.08)' }}>
              <ExclamationTriangleIcon className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(245,158,11,0.7)' }}>
                {t.devices.regenResultModal.warning}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <CredRow label={t.devices.credsModal.mqttUsername} value={regenCreds.mqttUsername} />
              <CredRow label={t.devices.credsModal.mqttPassword} value={regenCreds.mqttPassword} />
              <CredRow label={t.devices.credsModal.apiKey}       value={regenCreds.apiKey} />
            </div>
            <Button variant="primary" size="md" onClick={() => setRegenCreds(null)}>
              {t.devices.regenResultModal.done}
            </Button>
          </div>
        )}
      </Modal>

      {/* ── Delete Modal ── */}
      <Modal open={!!delId} onClose={() => setDelId(null)} title={t.devices.deleteModal.title} size="sm">
        <div className="flex flex-col gap-5">
          <p className="text-sm text-mid leading-relaxed">{t.devices.deleteModal.warning}</p>
          <div className="flex gap-2.5">
            <Button variant="ghost" size="sm" onClick={() => setDelId(null)} className="flex-1">{t.cancel}</Button>
            <Button variant="danger" size="sm" loading={deleteDevice.isPending}
              onClick={() => delId && handleDelete(delId)} className="flex-1">
              {t.devices.deleteModal.submit}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
