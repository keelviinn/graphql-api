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
  authLoginToken: string;
  authLoginExpires: Date;
  refreshTokens: RefreshToken[];
  active: boolean;
  role: string;
	coverURL: string;
	createdAt: string;
	updatedAt: string;
};