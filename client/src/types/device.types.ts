export interface Device {
  _id: string;
  name: string;
  mqttUsername: string;
  mqttTopic: string;
  status: 'online' | 'offline';
  lastSeen?: string;
  createdAt: string;
}

export interface DeviceCredentials {
  _id: string;
  name: string;
  mqttUsername: string;
  mqttPassword: string;
  mqttTopic: string;
  apiKey: string;
}
