import { isAfter } from 'date-fns';
import { compare } from 'bcryptjs';
import RefreshToken from '../../models/auth/refreshToken.schema';
import User from '../../models/user/user.schema';
import UserModel from '../../models/user/user.model';
import { GenerateToken } from "../../provider/GenerateToken";
import { GenerateRefreshToken } from '../../provider/GenerateRefreshToken';
import AppError from '../../utils/appError';

const login = async (parent: any, args: any, context: any) => {
  const { email, password } = args;
  const user = await User.findOne({ email });
  if (!user) return new AppError('user or password incorrect!', 401);
  const passwordMatch = await compare(password, user.password);
  if (!passwordMatch) return new AppError('user or password incorrect!', 401);
  const generateToken = new GenerateToken();
  const userDetails = { name: user.name, role: user.role}
  const token = generateToken.execute(userDetails, user._id);
  const generateRefreshToken = new GenerateRefreshToken();
  const refreshToken = await generateRefreshToken.execute(user._id);
  return { token, refreshToken };
}

const refreshToken = async (parent: any, args: any, context: any) => {
  const refreshToken = await RefreshToken.findById(args.refresh_token).populate('user');
  if (!refreshToken) throw new Error('Invalid refresh token!');
  const user: UserModel = refreshToken.user;
  const userDetails = { name: user?.name, role: user?.role}
  const generateToken = new GenerateToken();
  const token = generateToken.execute(userDetails, user?._id);
  if (!!isAfter(new Date(), refreshToken.expiration)) {
    const generateRefreshToken = new GenerateRefreshToken();
    const newRefreshToken = generateRefreshToken.execute(user._id);
    return { token, refreshToken: newRefreshToken };
  }    
  return { token, refreshToken };
}

export const authQueries = {  };
export const authMutations = { login, refreshToken };