import { NextResponse } from 'next/server';
import { createProduct, getAllProducts } from '@/lib/db';
import { scrapeProduct } from '@/lib/scraper';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const products = await getAllProducts();
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // 1. Scrape product data
        const scrapedData = await scrapeProduct(url);

        if (!scrapedData) {
            return NextResponse.json({ error: 'Failed to scrape product' }, { status: 400 });
        }

        // 2. Save to database
        const newProduct = await createProduct(scrapedData);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
