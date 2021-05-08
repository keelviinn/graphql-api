import mongoose, { Schema } from 'mongoose';
import Product from './product.model';

const ProductSchema: Schema = new Schema({
	name: { type: String },
	price: { type: Number },
	coverURL: { type: String },
}, { timestamps: {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
}});

export default mongoose.model<Product>('Product', ProductSchema);





