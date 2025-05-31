
import React, { useContext, useEffect } from 'react';
import { ProductsContext } from './contexts/ProductsContext';
import { Core } from '@/library/services/core/Core';
import ProductsProvider from './ProductsProvider';
import { useSearchParams } from 'next/navigation';
import { ProductsFetch } from '@/library/services/products/ProductsFetch';
import { isObject, isObjectEmpty } from '@/helpers/utils';
import { BlockContext } from '@/contexts/BlockContext';

function ProductsContainer({
    children,
}) {
    const productsContext = useContext(ProductsContext);
    const blockContext = useContext(BlockContext);
    const searchParams = useSearchParams();
    const pageQueryVal = searchParams?.get('page');

    const core = Core.getInstance();
    const productsService = core.getProductsService(productsContext);

    useEffect(() => {
        productsContext.fetch({
            query: (isObject(blockContext?.properties?.init) && !isObjectEmpty(blockContext.properties?.init))
                ? blockContext.properties?.init
                : {}
        });
    }, [blockContext?.properties?.init]);

    useEffect(() => {
        if (!pageQueryVal) {
            return;
        }
        const currentPage = productsService.getContextService().context?.results?.meta?.[
            ProductsFetch.PAGINATION.CURRENT_PAGE
        ];
        
        if (currentPage && (parseInt(currentPage) === parseInt(pageQueryVal))) {
            return;
        }

        productsContext.fetch({
            query: {
                ...productsContext.query,
                [ProductsFetch.PAGINATION.PAGE]: pageQueryVal
            },
            post: productsContext.post
        });
    }, [pageQueryVal]);

    useEffect(() => {
        if (isObjectEmpty(productsContext?.query)) {
            return
        }
        const currentPage = productsService.getContextService().context?.results?.meta?.[
            ProductsFetch.PAGINATION.CURRENT_PAGE
        ];
        if (
            productsContext?.query?.[ProductsFetch.PAGINATION.PAGE] &&
            (
                productsContext?.query?.[ProductsFetch.PAGINATION.PAGE] === parseInt(pageQueryVal) ||
                productsContext?.query?.[ProductsFetch.PAGINATION.PAGE] === parseInt(currentPage)
            )

        ) {
            return;
        }

        productsContext.fetch({
            query: productsContext?.query || {},
            post: productsContext?.post || {},
            options: productsContext?.options || {},
            context: productsContext
        });
    }, [productsContext.query]);

    useEffect(() => {
        if (isObjectEmpty(productsContext?.post)) {
            return
        }
        const currentPage = productsService.getContextService().context?.results?.meta?.[
            ProductsFetch.PAGINATION.CURRENT_PAGE
        ];
        if (
            productsContext?.post?.[ProductsFetch.PAGINATION.PAGE] &&
            (
                productsContext?.post?.[ProductsFetch.PAGINATION.PAGE] === parseInt(pageQueryVal) ||
                productsContext?.post?.[ProductsFetch.PAGINATION.PAGE] === parseInt(currentPage)
            )

        ) {
            return;
        }

        productsContext.fetch({
            query: productsContext?.query || {},
            post: productsContext?.post || {},
            options: productsContext?.options || {},
            context: productsContext
        });
    }, [productsContext.post]);

    return children;
}

export default ProductsContainer;
