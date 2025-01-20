'use client';

import React from 'react';
import Link from 'next/link';

interface PaginationLinksProps {
    currentPage: number;
    totalPages: number;
    searchParams: Record<string, string>;
}

export default function PaginationLinks({
    currentPage,
    totalPages,
    searchParams
}: PaginationLinksProps) {
    const params = new URLSearchParams(searchParams);

    if(params.has('page')) {
        params.delete('page');
    };

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="pagination">
            {pages.map((page, index) =>
                typeof page === 'number' ? (
                    <Link
                        key={index}
                        href={`/products?page=${page}${params.toString() ? '&' + params.toString() : ''}`}
                        className={page === currentPage ? 'active' : ''}
                    >
                        {page}
                    </Link>
                ) : (
                    <span key={index}>...</span>
                )
            )}
        </div>
    );
}
