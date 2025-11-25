'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';

interface DeleteButtonProps {
    id: string;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        setIsDeleting(true);
        try {
            await axios.delete(`/api/products/${id}`);
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Failed to delete product');
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
            title="Delete Product"
        >
            {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Trash2 className="w-5 h-5" />
            )}
        </button>
    );
}
