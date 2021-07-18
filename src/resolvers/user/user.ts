import User from '../../models/user/user.schema';
import AppError from '../../utils/appError';
import APIFeatures from '../../utils/apiFeatures';
import filterObj from '../../utils/filterObj';

export const updateUser = async (parent: any, args: any, context: any) => {
 const filteredBody = filterObj(args, 'email'); 
 // Update user document
 const updatedUser = await User.findByIdAndUpdate(args.user._id, filteredBody, {
   new: true,
   runValidators: true,
 }); 
 if (!updatedUser) new AppError('No user found with that ID', 404);
 return { status: 'success', data: { updatedUser } } 
};