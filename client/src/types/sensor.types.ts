export type SensorValue = number | { r: number; g: number; b: number };

export type KnownSensorType = 'hcsr04' | 'tcs230';
export type SensorType = KnownSensorType | string;

export interface LiveSensorReading {
  type: string;
  value: SensorValue;
  unit: string;
}

export interface SensorHistoryPoint {
  timestamp: string;
  value: SensorValue;
  min?: number;
  max?: number;
}

export interface SensorReadingPayload {
  deviceId: string;
  sensors: LiveSensorReading[];
  timestamp: string;
}
