import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/db';
import { scrapeNoonProduct } from '@/lib/scraper';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();

    let products = await getProducts();

    if (search) {
        products = products.filter(p =>
            p.title.toLowerCase().includes(search) ||
            p.brand?.toLowerCase().includes(search)
        );
    }

    return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Scrape data
        const scrapedData = await scrapeNoonProduct(url);

        // Add to DB
        const newProduct = await addProduct({
            ...scrapedData,
            created_at: new Date().toISOString(),
        });

        // Revalidate homepage to show new product immediately
        revalidatePath('/');

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to add product' },
            { status: 500 }
        );
    }
}
