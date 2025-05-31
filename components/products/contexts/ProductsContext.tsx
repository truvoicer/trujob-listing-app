
import { ProductsFetch } from '@/library/services/products/ProductsFetch';
import React from 'react'

export const productsContextData = {
    status: ProductsFetch.STATUS.IDLE,
    loading: false,
    results: {
        data: [],
        links: {
            first: null,
            last: null,
            prev: null,
            next: null
        },
        meta: {
            current_page: null,
            from: null,
            last_page: null,
            links: [],
            path: null,
            per_page: 10,
            to: null,
            total: null
        },
    },
    query: {},
    post: {},
    update: () => {},
    fetch: ({ query, post, options = {} }) => {}
};

export const ProductsContext = React.createContext(productsContextData);
