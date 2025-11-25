export interface Product {
    id: string;
    noon_product_id?: string;
    url: string;
    title: string;
    image: string;
    price: number;
    currency: string;
    discount_price?: number;
    rating?: number;
    reviews_count?: number;
    description?: string;
    brand?: string;
    category?: string;
    created_at: string;
}
