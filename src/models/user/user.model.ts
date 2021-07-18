import { Document } from 'mongoose';

export interface RefreshToken extends Document {
	_id: any;
	token: string;
	expiration: Date;
  issued: Date;
  select: boolean;
	createdAt: string;
	updatedAt: string;
};

export default interface User extends Document {
	_id: any;
	name: string;
	email: string;
  authLoginToken: string | undefined;
  authLoginExpires: Date | undefined;
  refreshTokens: RefreshToken[];
  active: boolean;
  role: string;
	coverURL: string;
  createAuthToken(): any;
	createdAt: string;
	updatedAt: string;
};