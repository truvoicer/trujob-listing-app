import { findInObject, isObject, isObjectEmpty } from "@/helpers/utils";
import { MessageService, MessageState } from "../message/MessageService";
import { Button, Modal } from "react-bootstrap";
import Form, { FormProps } from "@/components/form/Form";
import React, { SetStateAction, Dispatch } from "react";
import { FormikProps, FormikValues } from "formik";

export type LocalModal = {
    show: boolean;
    title: string;
    footer: boolean;
};
export interface ModalState extends MessageState {
    items: Array<ModalItem>;
}
export type ModalItem = {
    [key: string]: string | number | boolean | null | Function | undefined | FormProps | any;
    id?: string | null;
    title: string | null;
    size: "sm" | "md" | "lg" | "xl";
    fullscreen: string | true | undefined;
    component: any;
    show: boolean;
    showFooter: boolean;
    formProps?: null | FormProps;
    onOk: () => boolean;
    onCancel: () => boolean;
}
export class ModalService extends MessageService {
    static INIT_DATA: ModalState = {
        items: [],
        show: () => { },
        close: () => { },
        hide: () => { },
        update: () => { },
    };
    static INIT_ITEM_DATA: ModalItem = {
        id: null,
        component: null,
        title: null,
        show: true,
        showFooter: true,
        size: 'md',
        fullscreen: undefined,
        formProps: null,
        onCancel: () => { return true; },
        onOk: () => { return true; },
    };

    static hideModal(setter: Dispatch<SetStateAction<{
        show: boolean;
        title: string;
        footer: boolean;
    }>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = false;
            return newState;
        });
    }
    static showModal(setter: Dispatch<SetStateAction<LocalModal>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = true;
            return newState;
        });
    }
    static setModalTitle(title: string, setter: Dispatch<SetStateAction<LocalModal>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.title = title;
            return newState;
        });
    }
    static setModalFooter(hasFooter: boolean = false, setter: Dispatch<SetStateAction<LocalModal>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.footer = hasFooter;
            return newState;
        });
    }

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

    static modalItemHasFormProps(modalState: ModalState, id?: string | null): boolean {
        if (typeof id !== "string") {
            return false;
        }
        const findIndex = modalState.items.findIndex((item: ModalItem) => item?.id === id);
        if (findIndex === -1) {
            return false;
        }
        const modal = modalState.items[findIndex];

        if (typeof modal?.formProps === "object" && !isObjectEmpty(modal?.formProps)) {
            return true;
        }
        return false;
    }

    renderFormModal(modal: any, index: number) {
        return (
            <Form
                {...modal.formProps}
            >
                {(formHelpers: FormikProps<FormikValues>) => {
                    return this.renderModalContent(modal, index, formHelpers);
                }}
            </Form>
        )
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
                        <React.Fragment key={index}>
                            {(isObject(modal?.formProps) && !isObjectEmpty(modal?.formProps))
                                ? this.renderFormModal(modal, index)
                                : this.renderModalContent(modal, index)
                            }
                        </React.Fragment>
                    );
                })}
            </>
        );
    }

    renderModalContent(modal: ModalItem, index: number, formHelpers?: any) {
        return (
            <Modal show={modal.show} onHide={() => this.handleCancel(index, { formHelpers })}>
                <Modal.Header closeButton>
                    <Modal.Title>{modal?.title || ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modal?.component || ''}
                </Modal.Body>
                {modal?.showFooter &&
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleCancel(index, { formHelpers })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => this.handleOk(index, { formHelpers })}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                }
            </Modal>
        );
    }
}