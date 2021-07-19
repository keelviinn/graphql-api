import { hash } from 'bcryptjs';
import User from '../../models/user/user.schema';
import AppError from '../../utils/appError';
import filterObj from '../../utils/filterObj';

const addUser = async (parent: any, args: any, context: any) => {
  const { name, email, password } = args;
  if (!!await User.findOne({ email })) return new AppError('User already exists!', 401);
  const passwordHashed = await hash(password, 8)
  const user = new User({ name, email, password: passwordHashed })
  await user.save();
  return user;
}

const updateUser = async (parent: any, args: any, context: any) => {
  const filteredBody = filterObj(args, 'email');
  // Update user document
  const updatedUser = await User.findByIdAndUpdate(args.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) new AppError('No user found with that ID', 404);
  return { status: 'success', data: { updatedUser } }
};

export const userMutations = { addUser, };