import { hash } from 'bcryptjs';
import User from '../../models/user/user.schema';
import AppError from '../../utils/appError';

interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

class CreateUser {
  async execute(args: ICreateUser): Promise<AppError | ICreateUser> {
    const { name, email, password } = args;
    const userAlreadyExists = await User.findOne({ email });
    if (!!userAlreadyExists) return new AppError('User already exists!', 401);
    const passwordHashed = await hash(password, 8)
    const user = new User({ name, email, password: passwordHashed })
    await user.save();
    return user;
  }
}

export { CreateUser }