import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  refreshToken?: string;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {}

const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 6 },
    refreshToken: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret['password'];
        delete ret['refreshToken'];
        delete ret['__v'];
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser, IUserModel>('User', userSchema);
