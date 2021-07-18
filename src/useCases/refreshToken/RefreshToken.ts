import { isAfter } from 'date-fns';
import RefreshToken from '../../models/auth/refreshToken.schema';
import User from '../../models/user/user.schema';
import { GenerateRefreshToken } from '../../provider/GenerateRefreshToken';
import { GenerateToken } from '../../provider/GenerateToken';

class RefreshTokenUseCase {
  async execute(refresh_token: string): Promise<any> {
    const refreshToken = await RefreshToken.findById(refresh_token);
    if (!refreshToken) throw new Error('Invalid refresh token!');
    const user = await User.findById(refreshToken.user);
    const userDetails = { name: user?.name, email: user?.email, role: user?.role}
    const generateToken = new GenerateToken();
    const token = generateToken.execute(userDetails, user?._id);
    if (!!isAfter(new Date(), refreshToken.expiration)) {
      const generateRefreshToken = new GenerateRefreshToken();
      const newRefreshToken = generateRefreshToken.execute(refreshToken.user);
      return { token, newRefreshToken };
    }    
    return { token };
  }
}

export { RefreshTokenUseCase }