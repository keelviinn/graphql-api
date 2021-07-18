import { Document } from 'mongoose';
export default interface User extends Document {
	_id: any;
	name: string;
	email: string;
	password: string;
  authLoginToken: string | undefined;
  authLoginExpires: Date | undefined;
  refreshTokens: string;
  active: boolean;
  role: string;
	coverURL: string;
	createdAt: string;
	updatedAt: string;
};