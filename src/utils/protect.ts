import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../models/user/user.schema'
import { ApplicationError } from './error';
import AppError from './appError';

const secret: any = process.env.JWT_SECRET;

export default async function Protect(authorization: string) {
  let token: string | null;
  if (authorization) token = authorization;
  else token = null;
  if (!token) new ApplicationError('You are not logged in. Please log in to get access')

  try {
    const decoded = await promisify(jwt.verify)(token, secret);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) new AppError('The user belonging to this token no longer exist.', 401);
    return currentUser;
  } catch (err) {
    console.error(err);
    new AppError('You are not logged in! Please log in to get access.', 401)
  }
}