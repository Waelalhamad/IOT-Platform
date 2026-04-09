import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { SensorHistoryPoint } from '../types/sensor.types';

export function useSensorHistory(
  deviceId: string,
  sensorType: string,
  range: '1h' | '6h' | '24h' | '7d' = '1h'
) {
  return useQuery<SensorHistoryPoint[]>({
    queryKey: ['sensor-history', deviceId, sensorType, range],
    queryFn: async () => {
      const { data } = await api.get('/sensors/history', {
        params: { deviceId, sensorType, range },
      });
      return data.data;
    },
    enabled: !!(deviceId && sensorType),
    refetchInterval: range === '1h' ? 30_000 : 120_000,
  });
}
