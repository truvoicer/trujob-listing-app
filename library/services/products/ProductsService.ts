import { Core } from "../core/Core";
import { ProductsFetch } from "./ProductsFetch";
import { ProductsViewService } from "./ProductsViewService";

export class ProductsService {
    contextService = null;
    constructor(context) {
        this.contextService = Core.getInstance().getContextService(context);
    }

    getContextService() {
        return this.contextService;
    }
    getFetchService() {
        return ProductsFetch.getInstance();
    }
    getViewService() {
        return ProductsViewService.getInstance();
    }
    getQueryParams(query) {
        let newQuery = {};
        if (typeof query === 'object') {
            newQuery = {...newQuery, ...query};
        }

        if (typeof this.contextService?.context?.query === 'object') {
            newQuery = {...this.contextService.context.query, ...newQuery};
        }
        return newQuery
    }
    getPostParams(post) {
        let newPost = {};
        if (typeof post === 'object') {
            newPost = {...post};
        }
        if (typeof this.contextService?.context?.post === 'object') {
            newPost = {...this.contextService.context.post, ...newPost};
        }
        return newPost;
    }

    getPage(useSearchParams) {
        const pageQueryVal = useSearchParams?.get('page');
        if (pageQueryVal) {
            return parseInt(pageQueryVal);
        }
        const pageControls = this.contextService.context.results.meta;
        return pageControls[ProductsFetch.PAGINATION.CURRENT_PAGE];
    }
}