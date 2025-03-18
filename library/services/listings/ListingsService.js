import { Core } from "../core/Core";
import { ListingsFetch } from "./ListingsFetch";
import { ListingsViewService } from "./ListingsViewService";

export class ListingsService {
    contextService = null;
    constructor(context) {
        this.contextService = Core.getInstance().getContextService(context);
    }

    getContextService(context) {
        return Core.getInstance().getContextService(context);
    }
    getFetchService() {
        return ListingsFetch.getInstance();
    }
    getViewService() {
        return ListingsViewService.getInstance();
    }
}