import { Document } from 'mongoose';

export default interface Product extends Document {
	_id: any;
	name: string;
	price: number;
	coverURL: string;
	createdAt: string;
	updatedAt: string;
};