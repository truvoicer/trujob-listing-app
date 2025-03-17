import { ListingsFetch } from "./ListingsFetch";

export class ListingsService {

    constructor(context) {
        this.context = context;
    }
    updateContext(data) {
        this.context.update(data);
    }
    getFetchService() {
        return ListingsFetch.getInstance();
    }
}