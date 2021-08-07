import { hash } from 'bcryptjs';
import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import User from '../../models/user/user.schema';
import filterObj from '../../utils/filterObj';
import verifyAuth from '../../middlewares/verifyAuth';

const users = async (_: any, __: any, { auth }: any) => {
  await verifyAuth(auth);
  const options = { page: 1, limit: 10, collation: { locale: 'ptBR' } };
  const users = await User.find({}).sort({ _id: -1 }).limit(10);
  return { list: users }
}

const user = async (parent: any, { _id }: any, { auth }: any) => {
  await verifyAuth(auth);
  return await User.findById(_id);
}

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
  const user = await User.findByIdAndUpdate(args._id, { ...args });
  return { user }
};

export const userQueries = { users, user };
export const userMutations = { addUser, updateUser };