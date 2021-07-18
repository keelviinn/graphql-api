import { verify } from 'jsonwebtoken';
import AppError from "../utils/appError";

const appSecret: any = process.env.APP_SECRET

export default function verifyAuth(authToken: string): boolean | AppError {
  if (!authToken) throw new Error('Token must be provided');
  verify(authToken, appSecret);
  return true;  
} 