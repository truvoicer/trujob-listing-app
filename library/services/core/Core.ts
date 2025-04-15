import { ContextService } from "../context/ContextService";
import { ListingsService } from "../listings/ListingsService";
import { ModalService } from "../modal/ModalService";
import { SessionService } from "../session/SessionService";
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