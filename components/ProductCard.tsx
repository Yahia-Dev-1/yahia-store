import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Product } from "@/lib/types";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group">
            <div
                className="rounded-2xl p-[2px] shadow-lg transition-all duration-300 hover:-translate-y-2"
                style={{
                    background: `linear-gradient(180deg, var(--g-4) 0%, var(--g-6) 100%)`,
                }}
            >
                {/* Card Content */}
                <div className="rounded-2xl overflow-hidden h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-colors">
                    <Link href={`/product/${product.id}`}>
                        <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer">
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                    No Image
                                </div>
                            )}
                        </div>
                    </Link>

                    <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900">
                                {product.category || "General"}
                            </span>

                            {product.rating && product.rating > 0 && (
                                <div className="flex items-center gap-1 bg-gray-900 dark:bg-white px-2 py-1 rounded-md">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs font-bold text-white dark:text-gray-900">
                                        {product.rating}
                                    </span>
                                </div>
                            )}
                        </div>

                        <Link href={`/product/${product.id}`}>
                            <h3 className="font-bold text-sm leading-relaxed line-clamp-2 mb-4 text-white hover:text-blue-300 transition-colors" style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                                {product.title}
                            </h3>
                        </Link>

                        <div className="flex items-center justify-between">
                            <div className="text-lg font-black text-black dark:text-white">
                                {product.currency} {product.price.toLocaleString()}
                            </div>

                            <Link
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                            >
                                Buy Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
