import mongoose, { Document } from 'mongoose';

export interface IWidget {
  i: string;           // nanoid key (from react-grid-layout)
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'value-card' | 'gauge' | 'line-chart' | 'color-preview' | 'status-badge';
  sensorType: string;
  config: Record<string, unknown>;
}

export interface IDashboardLayout extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId: mongoose.Types.ObjectId;
  widgets: IWidget[];
  updatedAt: Date;
}

const widgetSchema = new mongoose.Schema<IWidget>(
  {
    i: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    w: { type: Number, required: true },
    h: { type: Number, required: true },
    type: {
      type: String,
      enum: ['value-card', 'gauge', 'line-chart', 'color-preview', 'status-badge'],
      required: true,
    },
    sensorType: { type: String, required: true },
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const dashboardLayoutSchema = new mongoose.Schema<IDashboardLayout>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    widgets: { type: [widgetSchema], default: [] },
  },
  { timestamps: true }
);

dashboardLayoutSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

export const DashboardLayout = mongoose.model<IDashboardLayout>('DashboardLayout', dashboardLayoutSchema);
