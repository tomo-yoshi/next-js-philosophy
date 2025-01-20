import type { Product } from "@/types";

interface FetchProductsResponse {
    products: Product[];
    total: number;
}

export async function fetchProducts(
    page: number,
    limit: number,
    sort: string,
    category: string,
    priceRange: string
): Promise<FetchProductsResponse> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), sort });

    if (category) {
        params.append('category', category);
    }

    if (priceRange) {
        params.append('priceRange', priceRange);
    }

    const res = await fetch(`http://localhost:3000/api/products?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};