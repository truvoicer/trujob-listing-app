
import { ListingsFetch } from '@/library/services/listings/ListingsFetch';
import React from 'react'

export const listingsContextData = {
    status: ListingsFetch.STATUS.IDLE,
    results: {
        data: [],
        links: {
            first: null,
            last: null,
            prev: null,
            next: null
        },
        meta: {
            current_page: 1,
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
    update: () => {},
};

export const ListingsContext = React.createContext(listingsContextData);
