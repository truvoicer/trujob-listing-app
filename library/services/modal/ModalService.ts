import { findInObject } from "@/helpers/utils";

export class ModalService {
    static INIT_CONTEXT_DATA = {
        modals: [],
        onCancel: () => {},
        onOk: () => {},
        show: () => {},
        close: () => {},
        hide: () => {},
    };
    static INIT_MODAL_ITEM_DATA = {
        id: null,
        component: null,
        title: null,
        show: true,
        showFooter: true,
        size: 'md',
        fullscreen: false,
    };

    modal = {
        key: null
    };
    constructor(state, setter) {
        this.state = state;
        this.setter = setter;
    }

    setSetter(setter) {
        this.setter = setter;
        return this;
    }
    setState(state) {
        this.state = state;
        return this;
    }

    setModalKey(key) {
        this.modal.key = key;
        return this;
    }

    static hideModal(setter) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = false;
            return newState;
        });
    }

    static showModal(setter) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = true;
            return newState;
        });
    }

    static setModalTitle(title, setter) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.title = title;
            return newState;
        });
    }

    static setModalFooter(hasFooter = false, setter) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.footer = hasFooter;
            return newState;
        });
    }

    handleModalCancel(index) {
        let modalState;
        if (this.modal.key) {
            modalState = findInObject(this.modal.key, this.state);
            if (!modalState) {
                console.error("Modal state not found");
                return;
            }
        } else {
            modalState = this.state;
        }
        if (typeof modalState?.onCancel === "function") {
            modalState.onCancel();
        }
        this.handleModalClose(index);
    }
    handleModalOk(index) {
        let modalState;
        if (this.modal.key) {
            modalState = findInObject(this.modal.key, this.state);
            if (!modalState) {
                console.error("Modal state not found");
                return;
            }
        } else {
            modalState = this.state;
        }
        if (typeof modalState?.onOk === "function") {
            modalState.onOk();
        }
        this.handleModalClose(index);
    }
    handleModalClose(index) {
        this.setter(modalState => {
            let cloneState = { ...modalState };
            if (this.modal.key) {
                if (Array.isArray(cloneState?.[this.modal.key]?.modals)) {
                    cloneState[this.modal.key].modals.splice(index, 1);
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
    closeBatchModal(id) {
        const modalState = this.findModalStateData();
        if (!modalState) {
            console.error("Modal state not found");
            return;
        }
        const findModalItemIdex = modalState.modals.findIndex(item => item?.id === id);
        if (findModalItemIdex > -1) {
            this.handleModalClose(findModalItemIdex);
        }
    }
    updateModalState(data, id = null) {
        const modalState = this.findModalStateData();
        if (!modalState) {
            console.error("Modal state not found");
            return;
        }
        let cloneState = { ...modalState };
        if (!Array.isArray(cloneState?.modals)) {
            cloneState.modals = [];
        }
        let modalItem = {};
        let findModalItemIdex = -1;

        if (id) {
            findModalItemIdex = cloneState.modals.findIndex(item => item?.id === id);
            if (findModalItemIdex > -1) {
                modalItem = cloneState.modals[findModalItemIdex];
            }
        }
        Object.keys(ModalService.INIT_MODAL_ITEM_DATA).forEach((key) => {
            if (Object.keys(data).includes(key)) {
                modalItem[key] = data[key];
            } else {
                modalItem[key] = ModalService.INIT_MODAL_ITEM_DATA[key];
            }
        });
        modalItem.id = id;
        if (findModalItemIdex > -1) {
            cloneState.modals[findModalItemIdex] = modalItem;
        } else {
            cloneState.modals.push(modalItem);
        }
        if (this.modal.key) {
            this.setter(prevState => {
                let newState = { ...prevState };
                newState[this.modal.key].modals = cloneState.modals;
                return newState;
            });
            return;
        }
        this.setter(cloneState);
    }
    findModalStateData() {
        let findKeyData;
        if (!this.modal.key) {
            findKeyData = this.state;
        } else {
            findKeyData = findInObject(this.modal.key, this.state);
        }
        if (!findKeyData) {
            return null;
        }
        if (typeof findKeyData !== "object") {
            console.error("Modal state is not an object", {
                modalKey: this.modal.key,
                state: this.state,
                findKeyData: findKeyData
            });
            return null
        }
        return findKeyData;
    }
    getModalState() {
        const findKeyData = this.findModalStateData();
        if (!findKeyData) {
            return null;
        }
        const data = {
            ...findKeyData,
            modals: [],
            show: this.updateModalState.bind(this),
            close: this.closeBatchModal.bind(this),
            hide: this.closeBatchModal.bind(this),
        };
        if (this.modal.key) {
            return {
                [this.modal.key]: data
            }
        }
        return data;
    }
}