'use client';

import Link from 'next/link';
import { Sparkles, TrendingDown, ShieldCheck, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check initial theme
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-black/20 backdrop-blur-md border-b border-white/20 dark:border-white/10 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-12 h-12 group-hover:scale-110 transition-transform">
                            <img src="/logo.jpg" alt="SmartWorld Logo" className="w-full h-full object-contain rounded-lg" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-main">
                            Smart<span className="link-accent">World</span>
                        </span>
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-main transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                        aria-label="Toggle Dark Mode"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
