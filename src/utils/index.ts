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

import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
    type: "error" | "success",
    path: string,
    message: string,
) {
    return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
};