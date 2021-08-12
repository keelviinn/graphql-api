import { verify } from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import { GetCurrentUser } from '../provider/GetCurrentUser';
import User from '../models/user/user.model';

const appSecret: any = process.env.APP_SECRET

type Auth = {
  sub: string
}

export default async function verifyAuth(authToken: string): Promise<User | AuthenticationError> {
  try {
    const auth: any = verify(authToken, appSecret); 
    const currentUserProvider = new GetCurrentUser();
    const user = await currentUserProvider.findUser(auth.sub);
    if (!user) throw new AuthenticationError("User not founded");
    return user;
  } catch (error) {
    throw new AuthenticationError(error);
  }
  
} 