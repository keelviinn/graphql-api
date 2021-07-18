import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import User from '../../models/user/user.schema';
import Email from '../../utils/email';
import { ApplicationError } from '../../utils/error';
import AppError from '../../utils/appError';

const apiKey: any = process.env.SENDGRID_API_KEY;
const secret: any = process.env.JWT_SECRET;
sgMail.setApiKey(apiKey);

const signToken = (id: string) => jwt.sign({ id }, secret, { expiresIn: process.env.JWT_EXPIRES_IN });

const createSendToken = async (parent: any, args: any, context: any) => {
  try {
    const token = signToken(args.user._id);
    // Generate the random refresh token
    const refreshToken = crypto.randomBytes(32).toString('hex');
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const refreshExpiration = new Date().setDate(new Date().getDate() + 7); // 7 days

    context.setCookies.push({
      name: 'refreshToken',
      value: refreshToken,
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'Lax',
        secure: process.env.NODE_ENV == 'production' ? true : false,
        maxAge: 604800000, // 7 days
      }
    });

    context.setCookies.push({
      name: 'accessToken', 
      value: token,
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'Lax',
        secure: process.env.NODE_ENV == 'production' ? true : false,
        maxAge: 1800000, // 30 minutes
      }
    });

    await User.findByIdAndUpdate(args.user._id, {
      $push: {
        refreshTokens: {
          token: hashedRefreshToken, expiration: refreshExpiration,
        }
      }
    });

    return { status: 'success', token, data: { user: args.user } }
  } catch (error) { console.error(error); throw new Error("Error to createSendToken"); }
};

export const sendAuthLink = async (parent: any, args: any, context: any) => {
  let user = await User.findOne({ email: args.email });
  if (!user) { user = await User.create({ email: args.email }); }
  // Generate the random auth token
  const authToken = user.createAuthToken();
  user.authLoginToken = authToken.authLoginToken;
  user.authLoginExpires = authToken.authLoginExpires;
  await user.save({ validateBeforeSave: false });
  const authLink = `${process.env.HOST}/verify#loginToken=${authToken.authLoginToken}`;
  try {
    // await new Email(user, authLink).sendMagicLink();
    return { status: 'success', message: 'Check your email to complete login.' }
  } catch (err) {
    user.authLoginToken = undefined;
    user.authLoginExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return new AppError('There was an error sending the email. Try again later!', 500)
  }
}

export const verifyAuthLink = async (parent: any, args: any, context: any) => {
  // Get user based on token
  const user = await User.findOne({ authLoginToken: args.token, authLoginExpires: { "$gt": new Date() } });
  if (!user) return new AppError('Token is invalid or expired', 400)
  // If the user exists and token isn't expired, remove token and send JWT token
  user.authLoginToken = undefined;
  user.authLoginExpires = undefined;
  await user.save();
  // Log the user in and send JWT
  return createSendToken(null, { user: user }, context);
};

export const logout = async (parent: any, args: any, context: any) => {
  // Remove refreshTokens from database
  args.user.refreshTokens = [];

  // Set cookies to expired
  context.setCookies('refreshToken', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'Lax',
    secure: process.env.NODE_ENV == 'production' ? true : false,
    maxAge: 0,
  });

  context.setCookies('accessToken', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'Lax',
    secure: process.env.NODE_ENV == 'production' ? true : false,
    maxAge: 0,
  });

  await args.user.save();
  return { stutus: 'success', data: {} }
};

export const isLoggedIn = async (parent: any, args: any, context: any) => {
  let token: string | null = null;
  let refresh: string | null = null;

  if (context.cookies && context.authorization) token = context.authorization;
  if (context.cookies && context.cookies.refreshToken) refresh = context.cookies.refreshToken;
  if (!token && !refresh) new AppError('You are not logged in. Please log in to get access', 401)
  // Attempt to get new auth token with refresh
  if (!token && refresh) {
    try {
      // Get user based on hashed refresh token
      const hashedRefreshToken = crypto.createHash('sha256').update(refresh).digest('hex');
      // Check if user exists with refresh token
      const refreshUser = await User.findOne({
        'refreshTokens.expiration': { $gt: Date.now() },
        'refreshTokens.token': hashedRefreshToken,
      });
      if (!refreshUser) new AppError('You are not logged in. Please log in to get access', 401);
      // Create new token
      const refreshAuthToken = refreshUser && signToken(refreshUser._id);

      // Send new access token in cookie
      context.setCookies('accessToken', refreshAuthToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'Lax',
        secure: process.env.NODE_ENV == 'production' ? true : false,
        maxAge: 1800000, // 30 minutes
      });
      return { status: 'success', data: refreshUser }
    } catch (err) {
      console.error(err);
      return { status: 'error', data: null }
    }
  }

  if (token) {
    try {
      // Verify token
      const decoded = await promisify(jwt.verify)(token, secret);
      // Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return { status: 'error', data: null };
      // There is a logged in user
      return { status: 'success', data: currentUser };
    } catch (err) {
      console.error(err)
      return { status: 'error', data: null };
    }
  }
};

export const authQueries = { isLoggedIn };
export const authMutations = { sendAuthLink, verifyAuthLink, logout };