import { findInObject } from "@/helpers/utils";
import { MessageService } from "../message/MessageService";

export type ModalState = {
    [key: string]: Function | Array<ModalItem>;
    modals: Array<ModalItem>;
    show: (data: any, id: string) => void;
    close: (id: string) => void;
    hide: (id: string) => void;
}
export type ModalItem = {
    [key: string]: string | number | boolean | null | Function | undefined;
    id: string|null;
    title: string|null;
    size: "sm" | "lg" | "xl" ;
    fullscreen: string | true | undefined;
    component: any;
    show: boolean;
    showFooter: boolean;
    onOk: () => void;
    onCancel: () => void;
}
export class ModalService extends MessageService {
    static INIT_DATA: ModalState = {
        modals: [],
        show: () => {},
        close: () => {},
        hide: () => {},
    };
    static INIT_ITEM_DATA: ModalItem = {
        id: null,
        component: null,
        title: null,
        show: true,
        showFooter: true,
        size: 'md',
        fullscreen: false,
        onCancel: () => {},
        onOk: () => {},
    };

    
}