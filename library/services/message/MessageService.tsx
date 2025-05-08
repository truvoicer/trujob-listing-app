import { findInObject } from "@/helpers/utils";
import { LocalModal, ModalItem } from "../modal/ModalService";
import { FormProps } from "@/components/form/Form";
export type MessageState = {
    items: Array<any>;
    show: (data: any, id: string) => void;
    close: (id: string) => void;
    hide: (id: string) => void;
    update: (data: any, id: string) => void;
}
export class MessageService {
    key: null | string = null;
    state?: any;
    setter?: any;
    config: Array<any> = [];
    useStateHook: () => any = () => {};
    
    constructor(state?: any, setter?: any) {
        this.state = state;
        this.setter = setter;
    }

    setSetter(setter: any) {
        this.setter = setter;
        return this;
    }
    setState(state: any) {
        this.state = state;
        return this;
    }

    setKey(key: string) {
        this.key = key;
        return this;
    }
    setConfig(config: Array<any>) {
        if (!Array.isArray(config)) {
            console.error("config is not an array");
            return this;
        }
        this.config = config.map((item: any) => {
            if (typeof item !== "object") {
                console.error("config item is not an object", {
                    item: item,
                    config: config
                });
                return item;
            }
            let newItem = { ...item };
            if (typeof newItem?.id !== "string") {
                console.error("config item id is not a string", {
                    item: item,
                    config: config
                });
                return item;
            }
            newItem.state = this.useStateHook<LocalModal>({
                show: false,
                title: null,
                footer: true,
            })
            return newItem;
        });
        return this;
    }
    getConfig() {
        return this.config;
    }
    
    updateMessageConfigItem(id: string, data: any) {
        if (typeof data !== "object") {
            console.error("data is not an object", {
                data: data,
                config: this.config
            });
            return null;
        }
        if (typeof id !== "string") {
            console.error("id is not a string", {
                id: id,
                config: this.config
            });
            return null;
        }
        const findLocalMessageConfigIndex = this.findLocalMessageConfigIndexById(id);
        if (findLocalMessageConfigIndex === -1) {
            console.error("local message config not found", {
                id: id,
                config: this.config
            });
            return null;
        }

        this.config[findLocalMessageConfigIndex] = {
            ...this.config[findLocalMessageConfigIndex],
            ...data
        }
    }
    findLocalMessageConfigIndexById(id: string): number {
        if (typeof id !== "string") {
            return -1;
        }
        return this.config.findIndex((item: any) => item?.id === id);
    }
    findLocalMessageConfigById(id: string) {
        if (typeof id !== "string") {
            return null;
        }
        return this.config.find((item: any) => item?.id === id) || null;
    }
    findLocalMessageStateById(id: string) {
        const findLocalMessageConfig = this.findLocalMessageConfigById(id);
        if (!findLocalMessageConfig) {
            console.error("local message config not found", {
                id: id,
                config: this.config
            });
            return null;
        }
        if (typeof findLocalMessageConfig?.state !== "object") {
            console.error("local message config state is not an object", {
                id: id,
                config: this.config
            });
            return null;
        }
        return findLocalMessageConfig.state;
    }
    onLocalModalCancel(item: any, e?: React.MouseEvent | null) {
        if (typeof item?.state !== 'object') {
            console.error('Modal state not found');
            return null;
        }
        const [state, setState] = item.state;

        if (
            typeof state?.onCancel === 'function' &&
            !state.onCancel(e)
        ) {
            return;
        }

        MessageService.hideModal(setState)
    }
    onLocalModalOk(item: any, e?: React.MouseEvent | null) {
        if (typeof item?.state !== 'object') {
            console.error('Modal state not found');
            return null;
        }
        const [state, setState] = item.state;

        if (
            typeof state?.onOk === 'function' &&
            !state.onOk(e)
        ) {
            return;
        }

        MessageService.hideModal(setState)
    }
    renderLocalTriggerButton(id: string, label: string | null = null) {
        const findLocalMessageConfig = this.findLocalMessageConfigById(id);
        if (!findLocalMessageConfig) {
            console.error("local message config not found", {
                id: id,
                config: this.config
            });
            return null;
        }
        if (typeof findLocalMessageConfig?.state !== "object") {
            console.error("local message config state is not an object", {
                id: id,
                config: this.config
            });
            return null;
        }
        const [state, setState] = findLocalMessageConfig.state;
        return (
            <button
                type="button"
                className="btn btn-primary mr-2"
                onClick={(e) => {
                    MessageService.showModal(setState);
                    MessageService.setModalTitle(findLocalMessageConfig?.title || '', setState);
                    MessageService.setModalFooter(findLocalMessageConfig?.footer || true, setState);
                }}
            >
                {label || "Open"}
            </button>
        )
    }
    setUseStateHook(useStateHook: any) {
        this.useStateHook = useStateHook;
        return this;
    }
    static hideModal(setter: any) {
        setter((prevState: any) => {
            let newState = { ...prevState };
            newState.show = false;
            return newState;
        });
    }

    static showModal(setter: any) {
        setter((prevState: any) => {
            let newState = { ...prevState };
            newState.show = true;
            return newState;
        });
    }

    static setModalTitle(title: string, setter: any) {
        setter((prevState: any) => {
            let newState = { ...prevState };
            newState.title = title;
            return newState;
        });
    }

    static setModalFooter(hasFooter: boolean = false, setter: any) {
        setter((prevState: any) => {
            let newState = { ...prevState };
            newState.footer = hasFooter;
            return newState;
        });
    }

    async handleCancel(index: number, calllbackProps?: any) {
        const handleCallback = await this.handleCallback(index, "onCancel", calllbackProps);
        if (typeof handleCallback !== 'undefined' && handleCallback === false) {
            return;
        }
        this.handleClose(index);
    }
    async handleCallback(index: number, callbackName: string, callbackProps: any = null) {
        let itemState;
        if (this.key) {
            itemState = findInObject(this.key, this.state);
            if (!itemState) {
                console.error("state not found");
                return false;
            }
        } else {
            itemState = this.state;
        }
        if (!Array.isArray(itemState?.items)) {
            return true;
        }
        const findItemByIndex = itemState.items?.[index];
        if (!findItemByIndex) {
            return true;
        }
        const messageItem = itemState.items[index];
        
        if (typeof messageItem?.[callbackName] === "function") {
            return await messageItem[callbackName](callbackProps);
        }

        return true;
    }
    async handleOk(index: number, calllbackProps?: any) {
        const handleCallback = await this.handleCallback(index, "onOk", calllbackProps);
        if (typeof handleCallback !== 'undefined' && handleCallback === false) {
            return;
        }
        this.handleClose(index);
    }
    handleClose(index: number) {
        this.setter((itemState: any) => {
            let cloneState = { ...itemState };
            if (this.key) {
                if (Array.isArray(cloneState?.[this.key]?.items)) {
                    cloneState[this.key].items.splice(index, 1);
                }
                return cloneState;
            } else {

                if (Array.isArray(cloneState?.items)) {
                    cloneState.items.splice(index, 1);
                } else {
                    cloneState.items = [];
                }
                return cloneState;
            }
        })
    }
    closeBatch(id: string) {
        const itemState = this.findStateData();
        if (!itemState) {
            console.error("state not found");
            return;
        }
        const findItemIdex = itemState.items.findIndex((item: ModalItem) => item?.id === id);
        if (findItemIdex > -1) {
            this.handleClose(findItemIdex);
        }
    }
    
    buildItemData(data: any, id: null | string = null) {
        return {};
    }
    updateState(data: any, id: null | string = null): void {
        const itemState = this.findStateData();
        if (!itemState) {
            console.error("state not found");
            return;
        }
        let cloneState = { ...itemState };
        if (!Array.isArray(cloneState?.items)) {
            cloneState.items = [];
        }
        let findItemIdex = -1;
        let item = {};
        if (id) {
            findItemIdex = this.findItemIndexById(id);
            if (findItemIdex > -1) {
                item = cloneState.items[findItemIdex];
            }
        }
        
        item = {
            ...item,
            ...this.buildItemData(data, id),
        };

        if (findItemIdex > -1) {
            cloneState.items[findItemIdex] = item;
        } else {
            cloneState.items.push(item);
        }
        this.setter((prevState: any) => {
            let newState = { ...prevState };
            if (typeof this.key === "string") {
                newState[this.key].items = cloneState.items;
            } else {
                newState.items = cloneState.items;
            }
            return newState;
        });

    }
    findStateData() {
        let findKeyData;
        if (!this.key) {
            findKeyData = this.state;
        } else {
            findKeyData = findInObject(this.key, this.state);
        }
        if (!findKeyData) {
            return null;
        }
        if (typeof findKeyData !== "object") {
            console.error("state is not an object", {
                modalKey: this.key,
                state: this.state,
                findKeyData: findKeyData
            });
            return null
        }
        return findKeyData;
    }

    findItemIndexById(id: string): number {
        if (typeof id !== "string") {
            return -1;
        }
        const modalState = this.findStateData();
        if (!modalState) {
            console.error("state not found");
            return -1;
        }
        if (!Array.isArray(modalState?.items)) {
            return -1;
        }
        return modalState.items.findIndex((item: any) => item?.id === id);
    }
    
    getState() {
        const findKeyData = this.findStateData();
        if (!findKeyData) {
            return null;
        }
        const data = {
            ...findKeyData,
            items: [],
            update: this.updateState.bind(this),
            show: (data: any, id: null | string = null) => {
                this.updateState(
                    {
                        ...data,
                        show: true,
                    }, 
                    id
                );
            },
            close: this.closeBatch.bind(this),
            hide: this.closeBatch.bind(this),
        };
        if (this.key) {
            return {
                [this.key]: data
            }
        }
        return data;
    }
}