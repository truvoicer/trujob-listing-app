
import { StateService } from "../state/StateService";

export class ContextService {
    static DATA_STORE_CONTEXT = 'context';
    static DATA_STORE_STATE = 'state';
    static DATA_STORE_VAR = 'var';
    static DATA_STORES = [
        ContextService.DATA_STORE_CONTEXT,
        ContextService.DATA_STORE_STATE,
        ContextService.DATA_STORE_VAR
    ];

    dataStore = ContextService.DATA_STORE_CONTEXT;
    setState = null;
    context = null;
    constructor(context) {
        this.context = context;
    }
    getContext() {
        return this.context;
    }
    setSetState(setState) {
        this.setState = setState;
    }

    updateDataStoreContext(data) {
        if (typeof this.context?.update === 'function') {
            this.context.update(data);
        } else {
            console.log('Context does not have an update method');
        }
    }

    setDataStore(dataStore) {
        if (ContextService.DATA_STORES.indexOf(dataStore) === -1) {
            throw new Error(`Invalid data store: ${dataStore}`);
        }
        this.dataStore = dataStore;
    }

    setContext(context) {
        this.setSetState(StateService.getSetStateData(context));
    }
    updateContext(data) {
        switch (this.dataStore) {
            case ContextService.DATA_STORE_CONTEXT:
                this.updateDataStoreContext(data);
                break;
            case ContextService.DATA_STORE_STATE:
                StateService.updateStateObject({
                    data,
                    setStateObj: this.setState
                })
                break;
            case ContextService.DATA_STORE_VAR:
                Object.keys(data).forEach(key => {
                    this.context[key] = data[key];
                });
                break;
        }

    }

    updateContextItem({key, value}) {
        switch (this.dataStore) {
            case ContextService.DATA_STORE_CONTEXT:
                this.updateDataStoreContext({key, value})
                break;
            case ContextService.DATA_STORE_STATE:
                StateService.updateStateObject({
                    key,
                    value,
                    setStateObj: this.setState
                })
                break;
            case ContextService.DATA_STORE_VAR:
                this.context[key] = value;
                break;
        }

    }
    updateContextNestedObjectData({object, key, value}) {
        switch (this.dataStore) {
            case ContextService.DATA_STORE_CONTEXT:
                this.context.updateNestedObjectData({object, key, value});
                break;
            case ContextService.DATA_STORE_STATE:
                StateService.updateStateNestedObjectData({
                    object,
                    key,
                    value,
                    setStateObj: this.setState
                })
                break;
            case ContextService.DATA_STORE_VAR:
                this.context[object][key] = value;
                break;
        }
    }
}