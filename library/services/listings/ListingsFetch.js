import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";

export class ListingsFetch {
    static STATUS = {
        IDLE: 'idle',
        LOADING: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
    };

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