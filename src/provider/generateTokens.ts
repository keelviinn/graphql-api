import { sign } from "jsonwebtoken";
import { add } from 'date-fns';
import RefreshToken from '../models/refreshToken/refreshToken.schema';

interface ITokens {
  refreshToken: string;
  accessToken: string;
}

export const generateAccessToken = ({ userId }): string => {
  const accessToken = sign({ id: userId }, process.env.APP_SECRET as string, { expiresIn: 60 * 60 * 12 });
  return accessToken;
};

export const generateRefreshToken = async ({ userId }): Promise<string> => {
  await RefreshToken.deleteMany({ user: userId});
  const expiration = new Date(add(new Date(), { days: 7 }));
  const refreshToken = new RefreshToken({ user: userId, expiration });
  await refreshToken.save();  
  
  return refreshToken._id;
}