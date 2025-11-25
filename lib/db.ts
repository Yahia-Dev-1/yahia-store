import connectDB from './mongodb';
import ProductModel from './models/Product';
import { Product } from './types';

export async function getProducts(): Promise<Product[]> {
    await connectDB();
    const products = await ProductModel.find({}).sort({ createdAt: -1 }).lean();
    return products.map(p => ({
        ...p,
        id: (p as any)._id.toString()
    })) as unknown as Product[];
}

export async function getProductById(id: string): Promise<Product | undefined> {
    await connectDB();
    try {
        const product = await ProductModel.findById(id).lean();
        if (!product) return undefined;
        return {
            ...product,
            id: (product as any)._id.toString()
        } as unknown as Product;
    } catch (error) {
        return undefined;
    }
}

export async function addProduct(product: Product): Promise<Product> {
    await connectDB();

    // Check for duplicates based on URL
    const exists = await ProductModel.findOne({ url: product.url });
    if (exists) {
        throw new Error('Product already exists');
    }

    const newProduct = await ProductModel.create(product);
    return {
        ...newProduct.toObject(),
        id: newProduct._id.toString()
    } as Product;
}

export async function deleteProduct(id: string): Promise<boolean> {
    await connectDB();
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result;
}
