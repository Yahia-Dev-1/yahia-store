'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }
        replace(`/?${params.toString()}`);
    }, 300);

    return (
        <div className="relative max-w-xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
            <input
                type="text"
                placeholder="ابحث عن منتجات، ماركات..."
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('search')?.toString()}
                className="w-full pl-12 pr-4 py-4 bg-amber-900/20 border border-amber-900/30 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-lg text-main placeholder:muted-text"
            />
        </div>
    );
}
