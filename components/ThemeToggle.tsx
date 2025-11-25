'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Check localStorage, default to light if nothing is saved
        const savedTheme = localStorage.getItem('theme');
        const isDarkMode = savedTheme === 'dark';

        setIsDark(isDarkMode);

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (newIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="w-14 h-8 bg-gray-200 rounded-full" />
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle theme"
        >
            <div
                className={`absolute top-1 w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
            >
                {isDark ? (
                    <Moon className="w-4 h-4 text-blue-400" />
                ) : (
                    <Sun className="w-4 h-4 text-yellow-500" />
                )}
            </div>
        </button>
    );
}
