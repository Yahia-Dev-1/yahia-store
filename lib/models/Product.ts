import mongoose, { Schema, Model } from 'mongoose';
import { Product } from '@/lib/types';

// Extend the interface for Mongoose document properties if needed, 
// but for now we'll just use the interface as the base.
// We omit 'id' because Mongoose uses '_id' by default, 
// but we'll map it back to 'id' in the toJSON transform.

const ProductSchema = new Schema<Product>({
    noon_product_id: { type: String },
    url: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    discount_price: { type: Number },
    rating: { type: Number },
    reviews_count: { type: Number },
    description: { type: String },
    brand: { type: String },
    category: { type: String },
    created_at: { type: String, default: () => new Date().toISOString() },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete (ret as any)._id;
            delete (ret as any).__v;
        }
    },
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete (ret as any)._id;
            delete (ret as any).__v;
        }
    }
});

// Prevent OverwriteModelError upon hot reload in development
const ProductModel: Model<Product> = mongoose.models.Product || mongoose.model<Product>('Product', ProductSchema);

export default ProductModel;
