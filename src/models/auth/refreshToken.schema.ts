import mongoose, { Schema } from 'mongoose';
import RefreshToken from './refreshToken.model'

const RefreshTokenSchema: Schema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  expiration: { type: Date },
}, { timestamps: {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
}});

export default mongoose.model<RefreshToken>('RefreshToken', RefreshTokenSchema);