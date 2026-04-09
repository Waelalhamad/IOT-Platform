import mongoose, { Document, Model } from 'mongoose';

export type DeviceStatus = 'online' | 'offline';

export interface IDevice extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  apiKey: string;
  mqttUsername: string;
  mqttPasswordHash: string;
  mqttTopic: string;
  status: DeviceStatus;
  lastSeen?: Date;
  createdAt: Date;
}

interface IDeviceModel extends Model<IDevice> {}

const deviceSchema = new mongoose.Schema<IDevice, IDeviceModel>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 64 },
    apiKey: { type: String, required: true, unique: true, index: true },
    mqttUsername: { type: String, required: true, unique: true },
    mqttPasswordHash: { type: String, required: true },
    mqttTopic: { type: String, required: true },
    status: { type: String, enum: ['online', 'offline'], default: 'offline' },
    lastSeen: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret['mqttPasswordHash'];
        delete ret['__v'];
        return ret;
      },
    },
  }
);

// Generate mqttTopic from _id before first save
deviceSchema.pre('save', function (next) {
  if (this.isNew) {
    this.mqttTopic = `esp/${this._id}/sensors`;
  }
  next();
});

export const Device = mongoose.model<IDevice, IDeviceModel>('Device', deviceSchema);
