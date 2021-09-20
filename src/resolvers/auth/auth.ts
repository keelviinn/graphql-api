import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-express';
import * as bcrypt from "bcryptjs";
import { isAfter } from 'date-fns';
import { compare } from 'bcryptjs';

import { generateAccessToken, generateRefreshToken } from '../../provider/generateTokens';
import RefreshToken from '../../models/refreshToken/refreshToken.schema';
import UserModel from '../../models/user/user.model';
import User from '../../models/user/user.schema';

const currentUser = async (_: any, __: any, { user }: any) => user;

const register = async (_: any, { email, name, password }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!email || !name || !password) throw new UserInputError('You should complete every input'); 
    
    const user = new User({ email, name, password: hashedPassword });    
    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = await generateRefreshToken({ userId: user._id });
    
    await user.save();
    return { ...user.toObject(), accessToken, refreshToken  };    
  } catch (error) {
    console.error(error);
    return error;
  }
}

const login = async (_: any, { email, password }, context: any) => {
  try {
    if (!password) throw new UserInputError('password not provided!');
    const user: UserModel | null = await User.findOne({ email });
    const passwordMatch = user && await compare(password, user.password); 
    if (!user || !passwordMatch) throw new AuthenticationError('user or password incorrect!'); 
    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = await generateRefreshToken({ userId: user._id });

    return { ...user.toObject(), accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const refreshToken = async (parent: any, args: any): Promise<any> => {
  try {
    const refreshToken = await RefreshToken.findById(args.refreshToken).populate('user');
    if (!refreshToken) throw new AuthenticationError('RefreshToken not found!');
    const user = refreshToken.user as UserModel;
    const accessToken = generateAccessToken({ userId: user._id });
    if (!!isAfter(new Date(), refreshToken?.expiration)) {
      const newRefreshToken = await generateRefreshToken({ userId: user._id });
      return { accessToken, refreshToken: newRefreshToken, user };
    }    
    return { ...user.toObject(), accessToken, refreshToken: refreshToken._id };    
  } catch (error) {
    console.error(error);
    throw new ApolloError('Error to create refreshToken');
  }
}

export const authQueries = { currentUser };
export const authMutations = { login, register };