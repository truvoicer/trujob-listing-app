import { ListingsService } from "../listings/ListingsService";

export class Core {

    constructor() {
        
    }

    getListingsService(context) {
        return new ListingsService(context);
    }

    static getInstance() {
        return new Core();
    }
}