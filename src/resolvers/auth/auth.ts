import { AuthenticationError, UserInputError } from 'apollo-server-express';
import * as bcrypt from "bcryptjs";
import { isAfter } from 'date-fns';
import { compare } from 'bcryptjs';
import RefreshToken from '../../models/auth/refreshToken.schema';
import User from '../../models/user/user.schema';
import UserModel from '../../models/user/user.model';
import { GenerateToken } from "../../provider/GenerateToken";
import { GenerateRefreshToken } from '../../provider/GenerateRefreshToken';
import verifyAuth from '../../middlewares/verifyAuth';
import { IRequest } from '../../middlewares/refreshTokens';
import { generateTokens } from '../../provider/generateTokens';

const currentUser = async (_: any, __: any, { auth }: any) => await verifyAuth(auth);

const me = async (_: any, __: any, { req }) => {
  const { userId } = req as IRequest;
  if (!userId) return null;

  return await User.findById(userId);
};

const register = async (_: any, { email, name, password }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!email || !name || !password) throw new UserInputError('You should complete every input'); 
    
    const user = new User({ email, name, password: hashedPassword })
    await user.save();
  
    return true;    
  } catch (error) {
    console.error(error);
    return error;
  }
}

const login = async (_: any, { email, password }, { res }) => {
  try {
    if (!password) throw new UserInputError('password not provided!');
    const user = await User.findOne({ email });
    const passwordMatch = user && await compare(password, user.password); 
    if (!user || !passwordMatch) throw new AuthenticationError('user or password incorrect!'); 
    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refresh-token", refreshToken, { maxAge: 900000, httpOnly: true });
    res.cookie("access-token", accessToken, { maxAge: 900000, httpOnly: true });

    return user;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const invalidTokens = async (_: any, __: any, { req, res }) => {
  const { userId } = req as IRequest;
  if (!userId) { return false; }
  const user = await User.findById(userId);
  if (!user) { return false; }
  user.count += 1;
  await user.save();

  res.clearCookie('refresh-token');
  res.clearCookie('access-token');

  return true;
}

export const refreshToken = async (req: any, res: any): Promise<any> => {
  try {
    const refreshToken = await RefreshToken.findById(req.body.refreshToken).populate('user');
    if (!refreshToken) return res.status(400).json({ error: 'RefreshToken not found!' });
    const user: UserModel = refreshToken?.user; 
    const userDetails = { name: user?.name, role: user?.role}
    const generateToken = new GenerateToken();
    const token = generateToken.generate(userDetails, user?._id);
    if (!!isAfter(new Date(), refreshToken?.expiration)) {
      const generateRefreshToken = new GenerateRefreshToken();
      const newRefreshToken = await generateRefreshToken.execute(user._id);
      return res.status(201).json({ token, refreshToken: newRefreshToken, user });
    }    
    return res.status(201).send({ token, refreshToken: refreshToken._id, user });    
  } catch (error) {
    console.error(error);
  }
}

export const authQueries = { currentUser, me };
export const authMutations = { login, register, invalidTokens };