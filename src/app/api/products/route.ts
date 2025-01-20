import { NextResponse } from 'next/server';

const products = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    category: i % 2 === 0 ? 'electronics' : 'furniture',
    price: Math.floor(Math.random() * 1000),
}));

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const sort = searchParams.get('sort') || 'id_asc';
    const category = searchParams.get('category') || null;
    const priceRange = searchParams.get('priceRange') || null;

    let filteredProducts = products;

    // フィルター処理
    if (category) {
        filteredProducts = filteredProducts.filter((product) => product.category === category);
    }
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        filteredProducts = filteredProducts.filter(
            (product) => product.price >= min && product.price <= max
        );
    }

    // ソート処理
    if (sort === 'price_asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === 'name_asc') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name_desc') {
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    // ページネーション処理
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    return NextResponse.json({
        products: paginatedProducts,
        total: filteredProducts.length,
    });
}
