import { NextFunction, Request, Response } from "express";
import * as cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import User from '../models/user/user.schema';
import { generateTokens } from "../provider/generateTokens";

export interface IRequest extends Request {
  userId: string;
}

export async function refreshTokens(req: IRequest, res: Response, next: NextFunction): Promise<void> {
  const refreshToken = req.cookies["refresh-token"];
  const accessToken = req.cookies["access-token"];

  if (!refreshToken && !accessToken) { return next();}

  try {
    const data = verify(accessToken, process.env.APP_SECRET as string) as any;
    req.userId = data.userId;
    return next(); 
  } catch {
    if (!refreshToken) { return next(); }
  }

  let data: any;

  try {
    data = verify(refreshToken, process.env.APP_SECRET as string) as any;
  } catch { return next(); }

  const user = await User.findById(data.userId);
  // token has been invalidated
  if (!user || user.count !== data.count) { return next(); }
  
  const tokens = generateTokens(user);

  res.cookie("refresh-token", tokens.refreshToken);
  res.cookie("access-token", tokens.accessToken);
  req.userId = user._id;

  next();
}