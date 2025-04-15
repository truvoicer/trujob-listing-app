import { findInObject } from "@/helpers/utils";

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
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = false;
            return newState;
        });
    }

    static showModal(setter: any) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = true;
            return newState;
        });
    }

    static setModalTitle(title: string, setter: any) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.title = title;
            return newState;
        });
    }

    static setModalFooter(hasFooter: boolean = false, setter: any) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.footer = hasFooter;
            return newState;
        });
    }

    handleCancel(index: number) {
        let modalState;
        if (this.key) {
            modalState = findInObject(this.key, this.state);
            if (!modalState) {
                console.error("state not found");
                return;
            }
        } else {
            modalState = this.state;
        }
        if (typeof modalState?.onCancel === "function") {
            modalState.onCancel();
        }
        this.handleClose(index);
    }
    handleOk(index: number) {
        let modalState;
        if (this.key) {
            modalState = findInObject(this.key, this.state);
            if (!modalState) {
                console.error("state not found");
                return;
            }
        } else {
            modalState = this.state;
        }
        if (typeof modalState?.onOk === "function") {
            modalState.onOk();
        }
        this.handleClose(index);
    }
    handleClose(index: number) {
        this.setter(modalState => {
            let cloneState = { ...modalState };
            if (this.key) {
                if (Array.isArray(cloneState?.[this.key]?.modals)) {
                    cloneState[this.key].modals.splice(index, 1);
                }
                return cloneState;
            } else {

                if (Array.isArray(cloneState?.modals)) {
                    cloneState.modals.splice(index, 1);
                } else {
                    cloneState.modals = [];
                }
                return cloneState;
            }
        })
    }
    closeBatch(id: string) {
        const modalState = this.findStateData();
        if (!modalState) {
            console.error("state not found");
            return;
        }
        const findItemIdex = modalState.modals.findIndex(item => item?.id === id);
        if (findItemIdex > -1) {
            this.handleClose(findItemIdex);
        }
    }
    updateState(data: any, id: null | string = null) {
        const modalState = this.findStateData();
        if (!modalState) {
            console.error("state not found");
            return;
        }
        let cloneState = { ...modalState };
        if (!Array.isArray(cloneState?.modals)) {
            cloneState.modals = [];
        }
        let modalItem = {};
        let findItemIdex = -1;

        if (id) {
            findItemIdex = cloneState.modals.findIndex(item => item?.id === id);
            if (findItemIdex > -1) {
                modalItem = cloneState.modals[findItemIdex];
            }
        }
        Object.keys(MessageService.INIT_ITEM_DATA).forEach((key) => {
            if (Object.keys(data).includes(key)) {
                modalItem[key] = data[key];
            } else {
                modalItem[key] = MessageService.INIT_ITEM_DATA[key];
            }
        });
        modalItem.id = id;
        if (findItemIdex > -1) {
            cloneState.modals[findItemIdex] = modalItem;
        } else {
            cloneState.modals.push(modalItem);
        }
        if (this.key) {
            this.setter(prevState => {
                let newState = { ...prevState };
                newState[this.key].modals = cloneState.modals;
                return newState;
            });
            return;
        }
        this.setter(cloneState);
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
            modals: [],
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