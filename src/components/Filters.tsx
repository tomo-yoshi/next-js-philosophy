'use client';

import { useRouter } from 'next/navigation';

interface FiltersProps {
    category: string;
    priceRange: string;
};

export default function Filters({ category, priceRange }: FiltersProps) {
    const router = useRouter();

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/products?${params.toString()}`);
    };

    return (
        <div>
            <h2>Filters</h2>
            <div>
                <label>
                    Category:
                    <select
                        className='text-gray-800'
                        value={category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="electronics">Electronics</option>
                        <option value="furniture">Furniture</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Price Range:
                    <select
                        className='text-gray-800'
                        value={priceRange}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="0-100">0-100</option>
                        <option value="101-500">101-500</option>
                        <option value="501-1000">501-1000</option>
                    </select>
                </label>
            </div>
        </div>
    );
}
