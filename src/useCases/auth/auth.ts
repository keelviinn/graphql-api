import { compare } from 'bcryptjs';
import User from '../../models/user/user.schema';
import RefreshTokenModel from '../../models/auth/refreshToken.model';
import { GenerateRefreshToken } from '../../provider/GenerateRefreshToken';
import AppError from '../../utils/appError';
import { GenerateToken } from '../../provider/GenerateToken';

interface IUserAuth {
  email: string;
  password: string;
}

interface IResponseAuth {
  token: string;
  refreshToken: RefreshTokenModel;
}

class Auth {
  async execute({ email, password }: IUserAuth): Promise<AppError | IResponseAuth> {
    const user = await User.findOne({ email });
    if (!user) return new AppError('user or password incorrect!', 401);
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) return new AppError('user or password incorrect!', 401);
    const generateToken = new GenerateToken();
    const token = generateToken.execute(user._id);
    const generateRefreshToken = new GenerateRefreshToken();
    const refreshToken = await generateRefreshToken.execute(user._id);
    return { token, refreshToken };
  }
}

export { Auth }