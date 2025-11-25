import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/db';
import { ArrowLeft, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-transparent">
            <div className="max-w-6xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-700 mb-12 transition-colors font-bold"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Collection
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                    {/* Image Section */}
                    <div className="relative aspect-square rounded-3xl overflow-hidden card-surface">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-8">
                            <span className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900">
                                {product.category || 'General'}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-6 text-gray-900 dark:text-white text-right" dir="rtl">
                                {product.title}
                            </h1>

                            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-8">
                                <div className="text-3xl font-black text-gray-900 dark:text-white">
                                    {product.currency} {product.price.toLocaleString()}
                                </div>
                                {product.rating && product.rating > 0 && (
                                    <div className="flex items-center gap-1 bg-gray-900 dark:bg-white px-3 py-1.5 rounded-lg">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold text-white dark:text-gray-900">{product.rating}</span>
                                        {product.reviews_count != null && product.reviews_count > 0 && (
                                            <span className="text-gray-300 dark:text-gray-600 text-sm">({product.reviews_count})</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="max-w-none mb-10 leading-relaxed">
                            <h3 className="text-base font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-4 text-right">الوصف</h3>
                            <div className="whitespace-pre-line text-gray-900 dark:text-gray-100 font-semibold text-lg leading-relaxed" dir="rtl">
                                {product.description || 'لا يوجد وصف متاح.'}
                            </div>
                        </div>

                        <Link
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full btn-primary text-center py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all shadow-lg"
                        >
                            Buy Now
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
