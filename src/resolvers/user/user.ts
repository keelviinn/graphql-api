import { hash } from 'bcryptjs';
import { ForbiddenError, UserInputError, ApolloError } from 'apollo-server-express';
import User from '../../models/user/user.schema';
import filterObj from '../../utils/filterObj';
import verifyAuth from '../../middlewares/verifyAuth';
import UserModel from '../../models/user/user.model';
import { ContextReturn } from '../../config/apolloServer';
import { NEW_USER_ADDED } from './user.subscription';

const users = async (_: any, { page, limit }: any, { auth }: ContextReturn) => {
  await verifyAuth(auth);
  const users = await User.paginate({
    query: { },
    select: "name email role createdAt",
    sort: { _id: -1 },
    page,
    populate: "",
    limit,
  });
  if (!users) throw new ApolloError('Error to paginate users', '400');
  return { docs: users.docs, paginateProps: users };
}

const user = async (parent: any, { _id }: UserModel, { auth }: any) => {
  await verifyAuth(auth);
  return await User.findById(_id);
}

const addUser = async (parent: any, args: any, { auth, pubsub }: ContextReturn) => {
  // await verifyAuth(auth);
  const { name, email, password } = args;
  if (!!await User.findOne({ email })) return new ForbiddenError('User already exists!');  
  if (!args.password) return new UserInputError('Password wasn`t provided!');
  const passwordHashed = await hash(password, 8);
  const user = new User({ name, email, password: passwordHashed });
  await pubsub.publish(NEW_USER_ADDED, { userAdded: { ...user.toObject() } });
  // await user.save();
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