import { findInObject } from "@/helpers/utils";
import { MessageService, MessageState } from "../message/MessageService";
import { Button, Modal } from "react-bootstrap";

export interface ModalState extends MessageState {
    items: Array<ModalItem>;
}
export type ModalItem = {
    [key: string]: string | number | boolean | null | Function | undefined;
    id?: string | null;
    title: string | null;
    size: "sm" | "md" | "lg" | "xl";
    fullscreen: string | true | undefined;
    component: any;
    show: boolean;
    showFooter: boolean;
    onOk: () => void;
    onCancel: () => void;
}
export class ModalService extends MessageService {
    static INIT_DATA: ModalState = {
        items: [],
        show: () => { },
        close: () => { },
        hide: () => { },
    };
    static INIT_ITEM_DATA: ModalItem = {
        id: null,
        component: null,
        title: null,
        show: true,
        showFooter: true,
        size: 'md',
        fullscreen: undefined,
        onCancel: () => { },
        onOk: () => { },
    };

    buildItemData(data: any, id: null | string = null) {
        let item: ModalItem = ModalService.INIT_ITEM_DATA;
        Object.keys(ModalService.INIT_ITEM_DATA).forEach((key: string) => {
            if (Object.keys(data).includes(key)) {
                item[key] = data[key];
            }
        });
        item.id = id;
        return item;
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
        return modalState.items.findIndex((item: ModalItem) => item?.id === id);
    }

    render() {
        const itemState = this.findStateData();
        if (!itemState) {
            console.error("state not found");
            return null;
        }
        return (
            <>
                {Array.isArray(itemState?.items) && itemState?.items.map((modal: ModalItem, index: number) => {
                    if (!modal?.show) {
                        return null;
                    }
                    return (
                        <Modal key={index} show={modal.show} onHide={() => this.handleCancel(index)}>
                            <Modal.Header closeButton>
                                <Modal.Title>{modal?.title || ''}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {modal?.component || ''}
                            </Modal.Body>
                            {modal?.showFooter &&
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => this.handleCancel(index)}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={() => this.handleOk(index)}>
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            }
                        </Modal>
                    );
                })}
            </>
        )
    }
}