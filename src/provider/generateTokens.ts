import { sign } from "jsonwebtoken";
import UserModel from '../models/user/user.model';

interface ITokens {
  refreshToken: string;
  accessToken: string;
}

export const generateTokens = (user: UserModel): ITokens  => {
  const refreshToken = sign({ userId: user._id, count: user.count }, process.env.APP_SECRET as string, { expiresIn: "7d" });
  const accessToken = sign({ userId: user._id }, process.env.APP_SECRET as string, { expiresIn: "15min" });

  return { refreshToken, accessToken };
};