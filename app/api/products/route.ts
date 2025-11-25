import { NextResponse } from 'next/server';
import { addProduct, getProducts } from '@/lib/db';
import { scrapeNoonProduct } from '@/lib/scraper';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const products = await getProducts();
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, manualData } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        let productData;

        if (manualData) {
            // Use manual data if provided
            productData = {
                ...manualData,
                url,
                currency: 'EGP', // Default
                rating: 0,
                reviews_count: 0
            };
        } else {
            // Try scraping
            const scrapedData = await scrapeNoonProduct(url);
            if (!scrapedData) {
                return NextResponse.json({ error: 'Failed to scrape product' }, { status: 400 });
            }
            productData = scrapedData;
        }

        // Save to database
        const newProduct = await addProduct(productData);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
