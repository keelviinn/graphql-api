import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { isAfter } from 'date-fns';
import { compare } from 'bcryptjs';
import RefreshToken from '../../models/auth/refreshToken.schema';
import User from '../../models/user/user.schema';
import UserModel from '../../models/user/user.model';
import { GenerateToken } from "../../provider/GenerateToken";
import { GenerateRefreshToken } from '../../provider/GenerateRefreshToken';
import verifyAuth from '../../middlewares/verifyAuth';

const currentUser = async (_: any, __: any, { auth }: any) => await verifyAuth(auth);

const login = async (_: any, args: any) => {
  try {
    const { email, password } = args;
    if (!password) throw new UserInputError('password not provided!');
    const user = await User.findOne({ email });
    if (!user) throw new AuthenticationError('user or password incorrect!');
    const passwordMatch = await compare(password, password);
    if (!passwordMatch) throw new AuthenticationError('user or password incorrect!');
    const generateToken = new GenerateToken();
    const userDetails = { name: user.name, role: user.role};
    const token = generateToken.generate(userDetails, user._id);
    const generateRefreshToken = new GenerateRefreshToken();
    const refreshToken = await generateRefreshToken.execute(user._id);
    return { token, user, refreshToken: refreshToken };    
  } catch (error) {
    console.error(error)
  }
}

export const refreshToken = async (req: any, res: any): Promise<any> => {
  const refreshToken = await RefreshToken.findById(req.body.refreshToken).populate('user');
  if (!refreshToken) throw new AuthenticationError("RefreshToken not founded");
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
}

export const authQueries = { currentUser };
export const authMutations = { login };