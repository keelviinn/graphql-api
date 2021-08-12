import UserSchema from '../models/user/user.schema';
import UserModel from '../models/user/user.model';
import { GenerateToken } from './GenerateToken';

const appSecret = process.env.APP_SECRET as string;

class GetCurrentUser {
  async findUser(id: string): Promise<null | UserModel> {
    if (!id) return null
    return await UserSchema.findById(id).select('-password');
  }
}

export { GetCurrentUser }