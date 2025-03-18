import { ContextService } from "../context/ContextService";
import { ListingsService } from "../listings/ListingsService";
import { StateService } from "../state/StateService";

export class Core {

    constructor() {
        
    }

    getListingsService(context) {
        return new ListingsService(context);
    }

    getContextService(context) {
        return new ContextService(context);
    }
    getStateService() {
        return new StateService();
    }

    static getInstance() {
        return new Core();
    }
}