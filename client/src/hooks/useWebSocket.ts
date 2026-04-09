import { useEffect, useState } from 'react';
import { subscribeToDevice, unsubscribeFromDevice, getSocket } from '../services/ws';

export function useWebSocket(deviceId: string) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    if (!deviceId || !socket) return;

    subscribeToDevice(deviceId);
    setIsConnected(socket.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      unsubscribeFromDevice(deviceId);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [deviceId]);

  return { isConnected };
}
