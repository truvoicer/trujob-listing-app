import { findInObject, isObject, isObjectEmpty } from "@/helpers/utils";
import { MessageService, MessageState } from "../message/MessageService";
import { Button, Modal } from "react-bootstrap";
import React from "react";


export interface ConfirmationState extends MessageState {
    items: Array<ConfirmationItem>;
    show: (data: ConfirmationItem, id?: null | string) => void;
}
export type ConfirmationItem = {
    [key: string]: string | number | boolean | null | undefined  | unknown;
    id?: string | null;
    title?: string | null;
    size?: "sm" | "md" | "lg" | "xl";
    message?: string | React.ReactNode | null;
    show?: boolean;
    onOk?: () => boolean;
    onCancel?: () => boolean;
}
export class ConfirmationService extends MessageService {
    static INIT_DATA: ConfirmationState = {
        loaded: false,
        items: [],
        show: () => { },
        close: () => { },
        hide: () => { },
        update: () => { },
    };
    static INIT_ITEM_DATA: ConfirmationItem = {
        id: null,
        message: null,
        title: null,
        show: true,
        size: 'md',
        onCancel: () => { return true; },
        onOk: () => { return true; },
    };

    buildItemData(data: any, id: null | string = null) {
        let item: ConfirmationItem = ConfirmationService.INIT_ITEM_DATA;
        Object.keys(ConfirmationService.INIT_ITEM_DATA).forEach((key: string) => {
            if (Object.keys(data).includes(key)) {
                item[key] = data[key];
            }
        });
        item.id = id;
        return item;
    }
    render() {

        const itemState = this.findStateData();
        if (!itemState) {
            console.log("state not found");
            return null;
        }
        return (
            <>
                {Array.isArray(itemState?.items) && itemState?.items.map((confirmation: ConfirmationItem, index: number) => {
                    if (!confirmation?.show) {
                        return null;
                    }
                    return (
                        <Modal key={index} show={confirmation.show} onHide={() => this.handleCancel(index)}>
                            <Modal.Header closeButton>
                                <Modal.Title>{confirmation?.title || ''}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {confirmation?.message || ''}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => this.handleCancel(index)}>
                                    No
                                </Button>
                                <Button variant="primary" onClick={() => this.handleOk(index)}>
                                    Yes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    );
                })}
            </>
        );
    }
}