import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';
import validator from 'validator';
import User from './user.model'

const RefreshTokenSchema: Schema = new mongoose.Schema({
  token: { type: String, trim: true },
  expiration: { type: Date },
  issued: { type: Date, default: Date.now() },
  select: false,
}, { timestamps: {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
}});

const UserSchema: Schema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { 
    type: String,
    unique: true,
    required: [true, 'Email cannot be empty'],
    trim: true,
    lowercase: true,
    // validator: [validator.isEmail],
  },
  authLoginToken: { type: String, select: false },
  authLoginExpires: { type: Date, select: false },
  refreshTokens: [RefreshTokenSchema],
  active: { type: Boolean, default: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  coverURL: { type: String, trim: true }
}, { timestamps: {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
}});

UserSchema.methods.createAuthToken = function (): any {
  const authToken = crypto.randomBytes(32).toString('hex');
  const authLoginToken = crypto.createHash('sha256').update(authToken).digest('hex');
  const authLoginExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return { authToken, authLoginToken, authLoginExpires };
};

export default mongoose.model<User>('User', UserSchema);