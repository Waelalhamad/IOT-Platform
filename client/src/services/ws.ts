import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useSensorStore } from '../store/sensorStore';
import type { SensorReadingPayload } from '../types/sensor.types';

let socket: Socket | null = null;

export function connectSocket(): Socket {
  if (socket?.connected) return socket;

  const token = useAuthStore.getState().accessToken;
  socket = io(import.meta.env.VITE_WS_URL ?? 'http://localhost:4000', {
    transports: ['websocket'],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('sensor-reading', (payload: SensorReadingPayload) => {
    useSensorStore.getState().updateReadings(payload.deviceId, payload.sensors);
  });

  socket.on('device-status', (payload: { deviceId: string; status: 'online' | 'offline' }) => {
    useSensorStore.getState().setDeviceStatus(payload.deviceId, payload.status);
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}

export function subscribeToDevice(deviceId: string) {
  getSocket()?.emit('subscribe-device', deviceId);
}

export function unsubscribeFromDevice(deviceId: string) {
  getSocket()?.emit('unsubscribe-device', deviceId);
}
