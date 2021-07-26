import { hash } from 'bcryptjs';
import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import User from '../../models/user/user.schema';
import AppError from '../../utils/appError';
import filterObj from '../../utils/filterObj';

const addUser = async (parent: any, args: any, context: any) => {
  const { name, email, password } = args;
  if (!!await User.findOne({ email })) return new ForbiddenError('User already exists!');  
  if (!args.password) return new UserInputError('Password wasn`t provided!');
  const passwordHashed = await hash(password, 8)
  const user = new User({ name, email, password: passwordHashed })
  await user.save();
  return user;
}

const updateUser = async (parent: any, args: any, context: any) => {
  if (!args._id) return new ApolloError("_id must be provided!")
  const filteredBody = filterObj(args, 'name');
  const user = await User.findById(args._id);
  if (!user) return new ApolloError("user not found");
  // const updatedUser = await User.findByIdAndUpdate(args.user._id, filteredBody, {
  //   runValidators: false,
  // });
  return { status: 'success', data: { user } }
};

export const userMutations = { addUser, updateUser };