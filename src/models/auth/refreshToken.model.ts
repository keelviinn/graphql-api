import { Document } from 'mongoose';

export default interface RefreshToken extends Document {
	_id: any;
	user: string;
	expiration: Date;
	createdAt: string;
	updatedAt: string;
};