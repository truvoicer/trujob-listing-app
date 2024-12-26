import {ApiMiddleware} from "@/library/middleware/api/ApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";

export class TruJobApiMiddleware {
    apiMiddleware = null;
    config = null;
    constructor() {
        this.config = truJobApiConfig;
        this.apiMiddleware = ApiMiddleware.getInstance();
    }

    async settingsRequest(query = {}, data = {}) {
        return await this.apiMiddleware.resourceRequest({
            endpoint: `${this.config.settings}`,
            method: 'GET',
            query,
            data
        });
    }

    async pageRequest(page, query = {}, data = {}) {
        return await this.apiMiddleware.resourceRequest({
            endpoint: `${this.config.page}/${page}`,
            method: 'GET',
            query,
            data
        });
    }

    static getInstance() {
        return new TruJobApiMiddleware();
    }
}
