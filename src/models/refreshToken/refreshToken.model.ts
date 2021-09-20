import { Document } from 'mongoose';

export default interface RefreshToken extends Document {
	_id: string;
	user: any;
	expiration: Date;
	createdAt: string;
	updatedAt: string;
};