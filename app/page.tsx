import { getProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search: rawSearch, category } = await searchParams;
  const search = rawSearch?.toLowerCase() || '';

  let products = await getProducts();

  // Extract unique categories
  const categories = [...new Set(products.map(p => p.category || 'General'))];

  // Search filter
  if (search) {
    products = products.filter((p) =>
      p.title.toLowerCase().includes(search) ||
      p.brand?.toLowerCase().includes(search)
    );
  }

  // Category filter
  if (category) {
    products = products.filter(p => (p.category || 'General') === category);
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Curated <span className="text-blue-700 dark:text-blue-400">Finds</span>
          </h1>
          <p className="text-lg font-semibold max-w-2xl mx-auto text-gray-900 dark:text-gray-300">
            أفضل العروض والمنتجات من جميع أنحاء الإنترنت بأقل الأسعار
          </p>
        </div>

        <SearchBar />

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar justify-center">
          <Link
            href="/"
            className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all font-bold
            ${!category
                ? "bg-black-600 text-white shadow-lg shadow-black-600/20"
                : "bg-white/90 dark:bg-black-800 text-black-900 dark:text-white hover:bg-white dark:hover:bg-black-700"}`}
          >
            All
          </Link>

          {categories.map(cat => (
            <Link
              key={cat}
              href={`/?category=${cat}`}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all font-bold
              ${category === cat
                  ? "bg-black-600 text-white shadow-lg shadow-black-600/20"
                  : "bg-white/90 dark:bg-black-800 text-black-900 dark:text-white hover:bg-white dark:hover:bg-black-700"}`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="rounded-3xl p-12 inline-block border-2 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900">
              <p className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No products found</p>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                {search ? 'Try a different search term' : 'Check back later for new products.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
