import { Auth } from "../../useCases/auth/auth";
import { RefreshTokenUseCase } from '../../useCases/refreshToken/RefreshToken';

const auth = async (parent: any, args: any, context: any) => {
  const { email, password } = args;
  const auth = new Auth();
  return auth.execute({ email, password });
}

const refreshToken = async (parent: any, args: any, context: any) => {
  const { refresh_token } = args;
  const refreshToken = new RefreshTokenUseCase();
  return refreshToken.execute(refresh_token);
}

export const authQueries = {  };
export const authMutations = { auth, refreshToken };