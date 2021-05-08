import mongoose, { Schema } from 'mongoose';
import Showcase from './showcase.model';

const ShowcaseSchema: Schema = new Schema({
	name: { type: String },
	products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
	percent: { type: String },
	coverURL: { type: String },
}, { timestamps: {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
}});

export default mongoose.model<Showcase>('Showcase', ShowcaseSchema);





