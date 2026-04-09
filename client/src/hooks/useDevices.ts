import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { Device } from '../types/device.types';
import toast from 'react-hot-toast';
import { useI18n } from '../i18n/context';

export function useDevices() {
  return useQuery<Device[]>({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data } = await api.get('/devices');
      return data.data;
    },
  });
}

export function useCreateDevice() {
  const qc = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (name: string) => api.post('/devices', { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['devices'] });
      toast.success(t.devices.toast.created);
    },
    onError: () => toast.error(t.devices.toast.createFailed),
  });
}

export function useDeleteDevice() {
  const qc = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/devices/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['devices'] });
      toast.success(t.devices.toast.deleted);
    },
    onError: () => toast.error(t.devices.toast.deleteFailed),
  });
}

export function useRegenKey() {
  const { t } = useI18n();
  return useMutation({
    mutationFn: (id: string) => api.post(`/devices/${id}/regen-key`),
    onError: () => toast.error(t.devices.toast.regenFailed),
  });
}
