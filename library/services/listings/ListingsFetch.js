import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";

export class ListingsFetch {
    static STATUS = {
        IDLE: 'idle',
        LOADING: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
    };

     static PAGINATION = {
        CURRENT_PAGE: 'current_page',
        PAGE: 'page',
        PAGE_SIZE: 'page_size',
        TOTAL_ITEMS: 'total_items',
        TOTAL_PAGES: 'total_pages',
        LAST_PAGE: 'last_page',
        OFFSET: 'offset',
        HAS_MORE: 'has_more',
        TYPE: 'pagination_type',
    };

    static KEYS = {
        SORT_BY: 'sort_by',
        SORT_ORDER: 'sort_order',
        DATE_KEY: 'date_key',
    };

    static FETCH_TYPE = 'load_type';

    static FETCH_TYPE_APPEND = 'append';
    static FETCH_TYPE_PREPEND = 'prepend';
    static FETCH_TYPE_REPLACE = 'replace';

    async fetchListings(query = {}, data = {}) {
        const apiMiddleware = new TruJobApiMiddleware();
        return await apiMiddleware.getApiMiddleware().resourceRequest({
            endpoint: '/listing',
            method: 'GET',
            query,
            data
        });
    }

    static getInstance() {
        return new ListingsFetch();
    }
}