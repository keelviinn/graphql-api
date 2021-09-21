import UserSchema from '../models/user/user.schema';
import UserModel from '../models/user/user.model';

export async function getCurrentUser(id: string): Promise<UserModel | null> {
  if (!id) return null;
  return await UserSchema.findById(id).select('-password');
}