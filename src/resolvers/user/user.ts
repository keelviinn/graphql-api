import User from '../../models/user/user.schema';
import AppError from '../../utils/appError';
import filterObj from '../../utils/filterObj';
import { CreateUser } from '../../useCases/createUser/createUser';

const addUser = async (parent: any, args: any, context: any) => {
  const { name, email, password } = args;
  const createUser = new CreateUser();
  const user = createUser.execute({ name, email, password });
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