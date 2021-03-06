import { Document } from 'mongoose';
export default interface Showcase extends Document {
	_id: any;
	name: string;
	products: string[];
	percent: number;
	coverURL: string;
	company: string;
	createdAt: string;
	updatedAt: string;
};