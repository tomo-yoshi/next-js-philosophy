'use client';

import { useRouter } from 'next/navigation';

export default function SortOptions({ currentSort }: { currentSort: string }) {
    const router = useRouter();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = event.target.value;
        const params = new URLSearchParams(window.location.search);
        params.set('sort', newSort);
        router.push(`/products?${params.toString()}`);
    };

    return (
        <select className='text-gray-800' value={currentSort} onChange={handleChange}>
            <option value="id_asc">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
        </select>
    );
}
