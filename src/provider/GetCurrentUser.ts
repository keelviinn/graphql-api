import userSchema from '../models/user/user.schema';
import { GenerateToken } from './GenerateToken';

const appSecret = process.env.APP_SECRET as string;

class GetCurrentUser {
  async findUser(id: string): Promise<any> {
    if (!id) return { }
    return await userSchema.findById(id).select('-password');
  }
}

export { GetCurrentUser }