import { verify,  } from 'jsonwebtoken';
import AppError from "../utils/appError";

const appSecret: any = process.env.APP_SECRET

export default function verifyAuth(authToken: string): any | AppError {
  if (!authToken) throw new Error('Token must be provided');
  const token = verify(authToken, appSecret); 
  return token;  
} 