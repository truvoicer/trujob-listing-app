
import React, { useContext, useEffect, useState } from 'react';
import { ListingsContext, listingsContextData } from './contexts/ListingsContext';
import { Core } from '@/library/services/core/Core';
import { ListingsFetch } from '@/library/services/listings/ListingsFetch';
import { ContextService } from '@/library/services/context/ContextService';
import { StateService } from '@/library/services/state/StateService';
import { useSearchParams } from 'next/navigation';

function ListingsProvider({
    children,
}) {
    const listingsContextState = useState({
        ...listingsContextData,
        update: (data) => {
            StateService.updateStateObject({
                data,
                setStateObj: StateService.getSetStateData(listingsContextState)
            })
        },
        fetch: initFetch
    });
    const [listingsContextStateValue] = listingsContextState;

    const searchParams = useSearchParams();

    const core = Core.getInstance();
    const listingsService = core.getListingsService();
    listingsService.contextService.setDataStore(ContextService.DATA_STORE_STATE);
    listingsService.contextService.setContext(listingsContextState);

    async function initFetch(data) {
        let query, post, options, context = {};
        if (data) {
            query = data.query || {};
            post = data.post || {};
            options = data.options || {};
            context = data.context || {};
        }
        const response = await listingsService.getFetchService().fetchListings(
            listingsService.getQueryParams(query),
            listingsService.getPostParams(post)
        );

        if (!response) {
            listingsService.contextService.updateContext({
                status: ListingsFetch.STATUS.ERROR,
                loading: false
            });
            return;
        }
        listingsService.contextService.updateContext({
            status: ListingsFetch.STATUS.SUCCESS,
            results: buildResults(response, context, options),
            loading: false
        });
    }

    function buildResults(data, context = {}, options = {}) {
        return {
            data: buildResultData(data?.data, context, options),
            links: {
                first: data?.links?.first || null,
                last: data?.links?.last || null,
                prev: data?.links?.prev || null,
                next: data?.links?.next || null
            },
            meta: {
                current_page: data?.meta?.current_page || 1,
                from: data?.meta?.from || null,
                last_page: data?.meta?.last_page || null,
                has_more: data?.meta?.has_more || false,
                links: data?.meta?.links || [],
                path: data?.meta?.path || null,
                per_page: data?.meta?.per_page || 10,
                to: data?.meta?.to || null,
                total: data?.meta?.total || null,
            }

        }
    }

    function buildResultData(data, context = {}, options = {}) {
        if (!Array.isArray(data)) {
            return [];
        }
        const prevData = context?.results?.data || [];
        switch (options?.[ListingsFetch.FETCH_TYPE]) {
            case ListingsFetch.FETCH_TYPE_APPEND:
                return [
                    ...prevData,
                    ...data
                ];
            case ListingsFetch.FETCH_TYPE_PREPEND:
                return [
                    ...data,
                    ...prevData
                ];
            default:
                return data;
        }
    }

    return (
        <ListingsContext.Provider value={listingsContextStateValue}>
            {children}
        </ListingsContext.Provider>
    );
}

export default ListingsProvider;
