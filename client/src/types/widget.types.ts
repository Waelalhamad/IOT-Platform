export type WidgetType = 'value-card' | 'gauge' | 'line-chart' | 'color-preview' | 'status-badge';

export interface GaugeConfig {
  min: number;
  max: number;
  thresholds?: Array<{ value: number; color: string }>;
  unit?: string;
  label?: string;
}

export interface LineChartConfig {
  defaultRange?: '1h' | '6h' | '24h' | '7d';
  unit?: string;
  label?: string;
}

export interface ValueCardConfig {
  unit?: string;
  label?: string;
  min?: number;
  max?: number;
}

export type WidgetConfig = GaugeConfig | LineChartConfig | ValueCardConfig | Record<string, unknown>;

export interface GridWidget {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: WidgetType;
  sensorType: string;
  config: WidgetConfig;
}
