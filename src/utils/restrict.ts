import { ApplicationError } from './error';
import AppError from './appError'

export default async function restrictTo (user, ...roles: string[]) {
  if (!roles.includes(user.role)) new AppError('You do not have permission to perform this action', 403)
 };

