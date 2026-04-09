import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PencilSquareIcon, CheckIcon, PlusIcon, CpuChipIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useDevices } from '../hooks/useDevices';
import { useDashboard } from '../hooks/useDashboard';
import { useDashboardStore } from '../store/dashboardStore';
import { useWebSocket } from '../hooks/useWebSocket';
import { useI18n } from '../i18n/context';
import DraggableGrid from '../components/dashboard/DraggableGrid';
import AddWidgetModal from '../components/dashboard/AddWidgetModal';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { WidgetSkeleton } from '../components/ui/Skeleton';
import type { GridWidget } from '../types/widget.types';

export default function Dashboard() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const { t } = useI18n();

  const { data: devices, isLoading: devicesLoading } = useDevices();
  const device = devices?.find((d) => d._id === deviceId);
  const store = useDashboardStore();
  const { widgets, isLoading, isSaving, onLayoutChange, addWidget, removeWidget } = useDashboard(deviceId ?? '');
  const { isConnected } = useWebSocket(deviceId ?? '');
  const isEditMode = store.isEditMode;
  const isDirty = store.isDirty;

  if (!deviceId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-12 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CpuChipIcon className="w-8 h-8 text-lo" />
        </div>
        <div>
          <p className="text-sm font-semibold text-mid mb-1">{t.dashboard.noDevice}</p>
          <p className="text-xs text-lo">{t.dashboard.noDeviceHint}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/devices')}>
          {t.dashboard.goToDevices}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* ── Topbar ── */}
      <div className="flex items-center gap-4 px-5 h-16 flex-shrink-0"
        style={{ background: '#0d1424', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          onClick={() => navigate('/devices')}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-mid hover:text-hi transition-colors flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />

        <div className="flex items-center gap-3 min-w-0 flex-1">
          {devicesLoading ? (
            <div className="h-4 w-32 rounded animate-shimmer" />
          ) : (
            <>
              <span className="font-mono font-bold text-sm text-hi truncate">{device?.name ?? t.unknownDevice}</span>
              <Badge variant={device?.status === 'online' ? 'success' : 'muted'} dot>
                {device?.status === 'online' ? t.online.toUpperCase() : t.offline.toUpperCase()}
              </Badge>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: isConnected ? '#10b981' : '#3d5070', boxShadow: isConnected ? '0 0 6px #10b981' : 'none' }} />
            <span className={`text-[10px] font-mono font-bold ${isConnected ? 'text-green' : 'text-lo'}`}>
              {isConnected ? t.connected.toUpperCase() : t.disconnected.toUpperCase()}
            </span>
          </div>

          {isDirty && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-mid">
              {isSaving ? <Spinner size="sm" /> : <span className="w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0" />}
              <span>{isSaving ? t.saving : t.unsaved}</span>
            </div>
          )}

          {isEditMode && (
            <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
              <PlusIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.dashboard.addWidget}</span>
            </Button>
          )}

          <Button variant={isEditMode ? 'primary' : 'secondary'} size="sm"
            onClick={() => store.setEditMode(!isEditMode)}>
            {isEditMode
              ? <><CheckIcon className="w-3.5 h-3.5" />{t.done}</>
              : <><PencilSquareIcon className="w-3.5 h-3.5" />{t.dashboard.edit}</>
            }
          </Button>
        </div>
      </div>

      {/* Edit banner */}
      {isEditMode && (
        <div className="flex items-center gap-2.5 px-5 py-2 text-[10px] font-mono font-bold text-primary flex-shrink-0 tracking-wider"
          style={{ background: 'rgba(14,165,233,0.08)', borderBottom: '1px solid rgba(14,165,233,0.15)' }}>
          <span className="animate-blink">▋</span>
          {t.dashboard.editMode}
        </div>
      )}

      {/* ── Grid area ── */}
      <div className={`flex-1 min-h-0 overflow-auto p-5 bg-base ${isEditMode ? 'edit-mode' : ''}`}>
        {isLoading ? (
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ height: 160 }}>
                <WidgetSkeleton />
              </div>
            ))}
          </div>
        ) : widgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 rounded-3xl border-2 border-dashed mx-auto max-w-4xl"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(13,20,36,0.5)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}>
              <PlusIcon className="w-8 h-8 text-lo" />
            </div>
            <p className="text-sm font-mono font-bold text-mid mb-2">{t.dashboard.noWidgets}</p>
            <p className="text-xs text-lo mb-8 text-center max-w-[28ch] leading-relaxed">
              {t.dashboard.noWidgetsHint}
            </p>
            <Button variant="primary" size="md" onClick={() => { store.setEditMode(true); setShowAdd(true); }}>
              <PlusIcon className="w-4 h-4" />{t.dashboard.addFirstWidget}
            </Button>
          </div>
        ) : (
          <DraggableGrid
            widgets={widgets}
            deviceId={deviceId}
            isEditMode={isEditMode}
            onLayoutChange={onLayoutChange}
            onRemoveWidget={removeWidget}
          />
        )}
      </div>

      <AddWidgetModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={(w: Omit<GridWidget, 'i' | 'x' | 'y'>) => addWidget(w)}
      />
    </div>
  );
}
