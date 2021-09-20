// @ts-ignore

import mongoose, { Schema } from 'mongoose';
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";
import validator from 'validator';
import User from './user.model'

const UserSchema: Schema = new Schema({
  name: { type: String, trim: true },
  email: { 
    type: String,
    unique: true,
    required: [true, 'Email cannot be empty'],
    trim: true,
    lowercase: true,
    validator: [validator.isEmail],
  },
  password: { type: String },
  refreshTokens: { type: Schema.Types.ObjectId, ref: 'RefreshToken' },
  active: { type: Boolean, default: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  coverURL: { type: String, trim: true },
  count: { type: Number, default: 0 }
}, { timestamps: {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
}});

UserSchema.plugin(mongoosePagination);
const User: Pagination<User> = mongoose.model<User, Pagination<User>>("Contact", UserSchema);

export default User;