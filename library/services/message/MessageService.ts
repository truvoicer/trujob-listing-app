import { findInObject } from "@/helpers/utils";
import { ModalItem } from "../modal/ModalService";
export type MessageState = {
    items: Array<any>;
    show: (data: any, id: string) => void;
    close: (id: string) => void;
    hide: (id: string) => void;
}
export class MessageService {
    key: null | string = null;
    state: any;
    setter: any;
    
    constructor(state: any, setter: any) {
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

    handleCancel(index: number) {
        let itemState;
        if (this.key) {
            itemState = findInObject(this.key, this.state);
            if (!itemState) {
                console.error("state not found");
                return;
            }
        } else {
            itemState = this.state;
        }
        if (typeof itemState?.onCancel === "function") {
            itemState.onCancel();
        }
        this.handleClose(index);
    }
    handleOk(index: number) {
        let itemState;
        if (this.key) {
            itemState = findInObject(this.key, this.state);
            if (!itemState) {
                console.error("state not found");
                return;
            }
        } else {
            itemState = this.state;
        }
        if (typeof itemState?.onOk === "function") {
            itemState.onOk();
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
    findItemIndexById(id: string): number {
        return -1;
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
    getState() {
        const findKeyData = this.findStateData();
        if (!findKeyData) {
            return null;
        }
        const data = {
            ...findKeyData,
            items: [],
            show: this.updateState.bind(this),
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