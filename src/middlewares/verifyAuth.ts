import { verify } from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import { getCurrentUser } from '../provider/getUser';
import UserModel from '../models/user/user.model';

export default async function verifyAuth(authToken: string): Promise<UserModel | null> {
  if (authToken) {
    try {
      const token = verify(authToken, process.env.APP_SECRET as string) as any;
      return await getCurrentUser(token.id);
    } catch (error: any) {
      throw new AuthenticationError(error?.message)
    }
  }
  return null;
} 