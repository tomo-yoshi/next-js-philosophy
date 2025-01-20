import { fetchProducts } from "@/utils";
import type { Product } from "@/types";

interface ProductListProps {
    page: number;
    sort: string;
    category: string;
    priceRange: string;
    limit: number;
}

export default async function ProductList({ page, limit, sort, category, priceRange }: ProductListProps) {
    const { products } = await fetchProducts(page, limit, sort, category, priceRange);

    return (
        <ul>
            {products.map((product: Product) => (
                <li key={product.id}>
                    {product.name} - ${product.price}
                </li>
            ))}
        </ul>
    );
}
