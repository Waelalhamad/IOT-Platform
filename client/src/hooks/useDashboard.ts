import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import api from '../services/api';
import { useDashboardStore } from '../store/dashboardStore';
import toast from 'react-hot-toast';
import { useI18n } from '../i18n/context';
import type { GridWidget } from '../types/widget.types';

interface RGLLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  [key: string]: unknown;
}

export function useDashboard(deviceId: string) {
  const store = useDashboardStore();
  const { t } = useI18n();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { isLoading } = useQuery({
    queryKey: ['dashboard', deviceId],
    queryFn: async () => {
      const { data } = await api.get(`/dashboard?deviceId=${deviceId}`);
      store.setWidgets(deviceId, data.data.widgets ?? []);
      return data.data;
    },
    enabled: !!deviceId,
  });

  const saveMutation = useMutation({
    mutationFn: (widgets: GridWidget[]) => api.put('/dashboard', { deviceId, widgets }),
    onSuccess: () => store.markClean(),
    onError: () => toast.error(t.dashboard.saveFailed),
  });

  const isDirty = store.isDirty;
  const widgetsByDevice = store.widgetsByDevice;

  useEffect(() => {
    if (!isDirty) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const widgets = widgetsByDevice[deviceId] ?? [];
      saveMutation.mutate(widgets);
    }, 2000);
    return () => clearTimeout(saveTimer.current);
  }, [isDirty, widgetsByDevice, deviceId]);

  const widgets = store.widgetsByDevice[deviceId] ?? [];

  return {
    widgets,
    isLoading,
    isSaving: saveMutation.isPending,
    onLayoutChange: (layouts: RGLLayout[]) => store.updateLayout(deviceId, layouts),
    addWidget: (w: Omit<GridWidget, 'i' | 'x' | 'y'>) => store.addWidget(deviceId, w),
    removeWidget: (id: string) => store.removeWidget(deviceId, id),
  };
}
