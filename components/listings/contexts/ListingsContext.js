
import { ListingsFetch } from '@/library/services/listings/ListingsFetch';
import React from 'react'

export const listingsContextData = {
    status: ListingsFetch.STATUS.IDLE,
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

export const ListingsContext = React.createContext(listingsContextData);
