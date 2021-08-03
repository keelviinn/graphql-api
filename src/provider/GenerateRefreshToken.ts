import { add } from 'date-fns';
import RefreshToken from '../models/auth/refreshToken.schema';
import RefreshTokenModel from '../models/auth/refreshToken.model';

class GenerateRefreshToken {
  async execute(userId: string): Promise<string> {  
    await RefreshToken.deleteMany({ user: userId });
    const expiration = new Date(add(new Date(), { minutes: 15 }));
    const generateRefreshToken = new RefreshToken({ user: userId, expiration });
    await generateRefreshToken.save();
    return generateRefreshToken._id;
  }
}

export { GenerateRefreshToken }