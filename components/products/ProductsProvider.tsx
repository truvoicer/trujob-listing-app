
import React, { useContext, useEffect, useState } from 'react';
import { ProductsContext, productsContextData } from './contexts/ProductsContext';
import { Core } from '@/library/services/core/Core';
import { ProductsFetch } from '@/library/services/products/ProductsFetch';
import { ContextService } from '@/library/services/context/ContextService';
import { StateService } from '@/library/services/state/StateService';
import { useSearchParams } from 'next/navigation';

function ProductsProvider({
    children,
}) {
    const productsContextState = useState({
        ...productsContextData,
        update: (data) => {
            StateService.updateStateObject({
                data,
                setStateObj: StateService.getSetStateData(productsContextState)
            })
        },
        fetch: initFetch
    });
    const [productsContextStateValue] = productsContextState;

    const searchParams = useSearchParams();

    const core = Core.getInstance();
    const productsService = core.getProductsService();
    productsService.contextService.setDataStore(ContextService.DATA_STORE_STATE);
    productsService.contextService.setContext(productsContextState);

    async function initFetch(data) {
        let query, post, options, context = {};
        if (data) {
            query = data.query || {};
            post = data.post || {};
            options = data.options || {};
            context = data.context || {};
        }
        const response = await productsService.getFetchService().fetchProducts(
            productsService.getQueryParams(query),
            productsService.getPostParams(post)
        );

        if (!response) {
            productsService.contextService.updateContext({
                status: ProductsFetch.STATUS.ERROR,
                loading: false
            });
            return;
        }
        productsService.contextService.updateContext({
            status: ProductsFetch.STATUS.SUCCESS,
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
        switch (options?.[ProductsFetch.FETCH_TYPE]) {
            case ProductsFetch.FETCH_TYPE_APPEND:
                return [
                    ...prevData,
                    ...data
                ];
            case ProductsFetch.FETCH_TYPE_PREPEND:
                return [
                    ...data,
                    ...prevData
                ];
            default:
                return data;
        }
    }

    return (
        <ProductsContext.Provider value={productsContextStateValue}>
            {children}
        </ProductsContext.Provider>
    );
}

export default ProductsProvider;
