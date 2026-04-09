import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSensorStore } from '../../store/sensorStore';
import { formatDistanceToNow } from 'date-fns';
import { useDevices } from '../../hooks/useDevices';
import { useI18n } from '../../i18n/context';

interface Props { deviceId: string; isEditMode: boolean; onRemove: () => void; }

export default function StatusBadgeWidget({ deviceId, isEditMode, onRemove }: Props) {
  const { t } = useI18n();
  const liveStatus = useSensorStore((s) => s.deviceStatus[deviceId]);
  const { data: devices } = useDevices();
  const device = devices?.find((d) => d._id === deviceId);
  const status = liveStatus ?? device?.status ?? 'offline';
  const lastSeen = device?.lastSeen;
  const online = status === 'online';

  return (
    <div
      className="widget-card relative w-full h-full flex flex-col items-center justify-center transition-all duration-500"
      style={online ? {
        background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, #0d1424 60%)',
        borderColor: 'rgba(16,185,129,0.2)',
      } : undefined}
    >
      {isEditMode && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-lg flex items-center justify-center text-red transition-colors"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <XMarkIcon className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Pulse ring */}
      <div className="relative mb-4">
        <div
          className="w-14 h-14 rounded-full"
          style={{
            backgroundColor: online ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)',
          }}
          // Use CSS class for animation instead of inline style
        />
        {online && (
          <div className="absolute inset-0 rounded-full animate-glow-ring" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-6 h-6 rounded-full"
            style={{
              backgroundColor: online ? '#10b981' : '#ef4444',
              boxShadow: online ? '0 0 16px rgba(16,185,129,0.6)' : '0 0 10px rgba(239,68,68,0.4)',
            }}
          />
          {online && <div className="absolute w-6 h-6 rounded-full animate-pulse-dot"
            style={{ backgroundColor: '#10b981' }} />}
        </div>
      </div>

      <p className="text-base font-mono font-bold tracking-[0.15em] mb-1"
        style={{ color: online ? '#10b981' : '#ef4444' }}>
        {status.toUpperCase()}
      </p>

      {lastSeen && (
        <p className="text-[10px] font-mono text-mid text-center px-3">
          {online
            ? t.connected.toUpperCase()
            : `${t.devices.lastSeen.toUpperCase()} ${formatDistanceToNow(new Date(lastSeen), { addSuffix: true }).toUpperCase()}`}
        </p>
      )}

      <p className="mt-2 text-[10px] font-mono text-lo truncate max-w-full px-4">
        {device?.name ?? deviceId}
      </p>
    </div>
  );
}
