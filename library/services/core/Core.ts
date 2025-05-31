import { ContextService } from "../context/ContextService";
import { ProductsService } from "../products/ProductsService";
import { ModalService } from "../modal/ModalService";
import { SessionService } from "../session/SessionService";
import { StateService } from "../state/StateService";

export class Core {

    constructor() {
        
    }

    getProductsService(context) {
        return new ProductsService(context);
    }

    getContextService(context) {
        return new ContextService(context);
    }
    getStateService() {
        return new StateService();
    }
    getSessionService() {
        return new SessionService();
    }
    getModalService() {
        return new ModalService();
    }

    static getInstance() {
        return new Core();
    }
}