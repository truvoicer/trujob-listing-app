
import React, { useContext, useEffect } from 'react';
import { ListingsContext } from './contexts/ListingsContext';
import { Core } from '@/library/services/core/Core';
import ListingsProvider from './ListingsProvider';
import { useSearchParams } from 'next/navigation';
import { ListingsFetch } from '@/library/services/listings/ListingsFetch';
import { isObject, isObjectEmpty } from '@/helpers/utils';
import { BlockContext } from '@/contexts/BlockContext';

function ListingsContainer({
    children,
}) {
    const listingsContext = useContext(ListingsContext);
    const blockContext = useContext(BlockContext);
    const searchParams = useSearchParams();
    const pageQueryVal = searchParams?.get('page');

    const core = Core.getInstance();
    const listingsService = core.getListingsService(listingsContext);

    useEffect(() => {
        listingsContext.fetch({
            post: (isObject(blockContext?.properties?.init) && !isObjectEmpty(blockContext.properties?.init))
                ? {
                    ...listingsContext.post,
                    ...blockContext.properties?.init
                }
                : listingsContext.post
        });
    }, [blockContext?.properties?.init]);

    useEffect(() => {
        if (!pageQueryVal) {
            return;
        }
        const currentPage = listingsService.getContextService().context?.results?.meta?.[
            ListingsFetch.PAGINATION.CURRENT_PAGE
        ];

        if (currentPage && (parseInt(currentPage) === parseInt(pageQueryVal))) {
            return;
        }

        listingsContext.fetch({
            query: {
                ...listingsContext.query,
            },
            post: {
                ...listingsContext.post,
                [ListingsFetch.PAGINATION.PAGE]: pageQueryVal
            },
            post: listingsContext.post
        });
    }, [pageQueryVal]);

    useEffect(() => {
        if (isObjectEmpty(listingsContext?.query)) {
            return
        }
        const currentPage = listingsService.getContextService().context?.results?.meta?.[
            ListingsFetch.PAGINATION.CURRENT_PAGE
        ];
        if (
            listingsContext?.query?.[ListingsFetch.PAGINATION.PAGE] &&
            (
                listingsContext?.query?.[ListingsFetch.PAGINATION.PAGE] === parseInt(pageQueryVal) ||
                listingsContext?.query?.[ListingsFetch.PAGINATION.PAGE] === parseInt(currentPage)
            )

        ) {
            return;
        }

        listingsContext.fetch({
            query: listingsContext?.query || {},
            post: listingsContext?.post || {},
            options: listingsContext?.options || {},
            context: listingsContext
        });
    }, [listingsContext.query]);

    useEffect(() => {
        if (isObjectEmpty(listingsContext?.post)) {
            return
        }
        const currentPage = listingsService.getContextService().context?.results?.meta?.[
            ListingsFetch.PAGINATION.CURRENT_PAGE
        ];
        if (
            listingsContext?.post?.[ListingsFetch.PAGINATION.PAGE] &&
            (
                listingsContext?.post?.[ListingsFetch.PAGINATION.PAGE] === parseInt(pageQueryVal) ||
                listingsContext?.post?.[ListingsFetch.PAGINATION.PAGE] === parseInt(currentPage)
            )

        ) {
            return;
        }

        listingsContext.fetch({
            query: listingsContext?.query || {},
            post: listingsContext?.post || {},
            options: listingsContext?.options || {},
            context: listingsContext
        });
    }, [listingsContext.post]);

    return children;
}

export default ListingsContainer;
