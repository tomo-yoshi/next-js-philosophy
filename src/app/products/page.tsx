import ProductList from '@/components/ProductList';
import PaginationLinks from '@/components/PaginationLinks';
import Filters from '@/components/Filters';
import SortOptions from '@/components/SortOptions';

import { fetchProducts } from '@/utils';

const limit = 10;

export default async function ProductsPage(props: { searchParams: Promise<Record<string, string>> }) {
    const searchParams = await props.searchParams;
    const page = parseInt(searchParams.page || '1', 10);
    const sort = await searchParams.sort || 'id_asc';
    const category = await searchParams.category || '';
    const priceRange = await searchParams.priceRange || '';
    const { total } = await fetchProducts(page, limit, sort, category, priceRange);

    return (
        <div>
            <h1>Product List</h1>
            {/* <Link href="/products/?page=2" shallow>Test</Link> */}
            <p>{page}</p>
            {/* フィルターとソート */}
            <Filters category={category} priceRange={priceRange} />
            <SortOptions currentSort={sort} />
            {/* 商品リスト */}
            <ProductList page={page} sort={sort} category={category} priceRange={priceRange} limit={limit} />
            {/* ページネーションリンク */}
            <PaginationLinks currentPage={page} totalPages={Math.floor(total/10)} searchParams={searchParams} />
        </div>
    );
}
