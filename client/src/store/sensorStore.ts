import { create } from 'zustand';
import type { LiveSensorReading } from '../types/sensor.types';

type DeviceReadings = Record<string, LiveSensorReading>;

interface SensorState {
  readings: Record<string, DeviceReadings>;
  deviceStatus: Record<string, 'online' | 'offline'>;
  updateReadings: (deviceId: string, sensors: LiveSensorReading[]) => void;
  getReading: (deviceId: string, sensorType: string) => LiveSensorReading | undefined;
  setDeviceStatus: (deviceId: string, status: 'online' | 'offline') => void;
}

export const useSensorStore = create<SensorState>((set, get) => ({
  readings: {},
  deviceStatus: {},
  updateReadings: (deviceId, sensors) =>
    set((state) => ({
      readings: {
        ...state.readings,
        [deviceId]: {
          ...(state.readings[deviceId] ?? {}),
          ...Object.fromEntries(sensors.map((s) => [s.type, s])),
        },
      },
    })),
  getReading: (deviceId, sensorType) => get().readings[deviceId]?.[sensorType],
  setDeviceStatus: (deviceId, status) =>
    set((state) => ({
      deviceStatus: { ...state.deviceStatus, [deviceId]: status },
    })),
}));
