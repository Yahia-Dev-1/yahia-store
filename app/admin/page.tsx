'use client';

import { useState, useEffect } from 'react';
import { Loader2, Link as LinkIcon, CheckCircle, Trash2, ExternalLink } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
    id: string;
    title: string;
    image: string;
    price: number;
    currency: string;
    url: string;
}

export default function AdminPage() {
    const [url, setUrl] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showManualForm, setShowManualForm] = useState(false);
    const [manualData, setManualData] = useState({
        title: '',
        price: 0,
        image: '',
        category: '',
        description: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch products');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            if (showManualForm) {
                // Handle manual submission
                await axios.post('/api/products', {
                    url,
                    manualData
                });
            } else {
                // Handle automatic scraping
                await axios.post('/api/products', { url });
            }

            setUrl('');
            setManualData({ title: '', price: 0, image: '', category: '', description: '' });
            setShowManualForm(false);
            setMessage({ type: 'success', text: 'Product added successfully!' });
            fetchProducts();
        } catch (err: any) {
            console.error(err);
            // Always show manual form on error if not already showing
            if (!showManualForm) {
                setShowManualForm(true);
                setMessage({
                    type: 'error',
                    text: 'Automatic addition failed. Please enter details manually below.'
                });

                // Pre-fill manual data if possible (e.g. if we have a URL)
                if (url) {
                    setManualData(prev => ({ ...prev, image: '', title: '', price: 0, category: '', description: '' }));
                }
            } else {
                setMessage({
                    type: 'error',
                    text: err.response?.data?.error || 'Failed to save product.'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        setIsDeleting(id);
        try {
            await axios.delete(`/api/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
            setMessage({ type: 'success', text: 'Product deleted successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete product' });
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Add Product Section */}
                <div className="card-surface overflow-hidden backdrop-blur-md">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-900/10 dark:bg-blue-900/20">
                        <h1 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">Manage your store products</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Add New Product URL
                            </label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="url"
                                    required
                                    placeholder="https://..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium"
                                />
                            </div>
                        </div>

                        {/* Manual Entry Form (Only shows if manual mode is active) */}
                        {showManualForm && (
                            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6 animate-in fade-in slide-in-from-top-4">
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        ⚠️ Could not scrape automatically. Please enter details manually.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={manualData.title}
                                            onChange={e => setManualData({ ...manualData, title: e.target.value })}
                                            className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Price</label>
                                        <input
                                            type="number"
                                            required
                                            value={manualData.price}
                                            onChange={e => setManualData({ ...manualData, price: parseFloat(e.target.value) })}
                                            className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Image URL</label>
                                        <input
                                            type="url"
                                            required
                                            value={manualData.image}
                                            onChange={e => setManualData({ ...manualData, image: e.target.value })}
                                            className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Category</label>
                                        <input
                                            type="text"
                                            value={manualData.category}
                                            onChange={e => setManualData({ ...manualData, category: e.target.value })}
                                            className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Description</label>
                                    <textarea
                                        value={manualData.description}
                                        onChange={e => setManualData({ ...manualData, description: e.target.value })}
                                        className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 h-24"
                                    />
                                </div>
                            </div>
                        )}

                        {message && (
                            <div className={`p-4 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                                }`}>
                                {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
                                <p className="text-sm font-bold">{message.text}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                showManualForm ? 'Save Product' : 'Add Product'
                            )}
                        </button>
                    </form>
                </div>

                {/* Product List Section */}
                <div className="card-surface overflow-hidden backdrop-blur-md">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Products ({products.length})</h2>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {products.map((product) => (
                            <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                                    {product.image ? (
                                        <Image src={product.image} alt={product.title} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">No Img</div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{product.title}</h3>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 font-bold">
                                        {product.currency} {product.price.toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/product/${product.id}`}
                                        target="_blank"
                                        className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        disabled={isDeleting === product.id}
                                        className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {isDeleting === product.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {products.length === 0 && (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-medium">
                                No products found. Add one above!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
