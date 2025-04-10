export class ModalService {

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

    static getInstance() {
        return new ModalService();
    }
}