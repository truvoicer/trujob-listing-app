import { MessageService, MessageState } from "../message/MessageService";
import { NOTIFICATION_DEFAULT_POSITION, NOTIFICATION_DEFAULT_TYPE } from "@/contexts/AppNotificationContext";


export interface NotificationState extends MessageState {
    items: Array<NotificationItem>;
}
export type NotificationItem = {
    [key: string]: string | number | boolean | null | Function | undefined;
    variant: string;
    type: string;
    position: string;
    id?: string|null;
    title: string|null;
    body: string|null;
    show: boolean;
    showFooter: boolean;
    onOk: () => void;
    onCancel: () => void;
}
export class NotificationService extends MessageService {
    static INIT_DATA: NotificationState = {
        items: [],
        show: () => {},
        close: () => {},
        hide: () => {},
    };
    static INIT_ITEM_DATA: NotificationItem = {
        variant: 'info',
        type: 'toast',
        position: 'top_center',
        title: null,
        body: null,
        show: false,
        showFooter: true,
        id: null,
        onOk: () => {},
        onCancel: () => {},
    };
    
    findItemIndexById(id: string): number {
        if (typeof id !== "string") {
            return -1;
        }
        const modalState = this.findStateData();
        if (!modalState) {
            console.error("state not found");
            return -1;
        }
        return modalState.items.findIndex((item: NotificationItem) => item.id === id);
    }

    buildItemData(data: any, id: null | string = null) {
        let item: NotificationItem = NotificationService.INIT_ITEM_DATA;
        Object.keys(NotificationService.INIT_ITEM_DATA).forEach((key: string) => {
            if (Object.keys(data).includes(key)) {
                item[key] = data[key];
            }
        });
        item.id = id;
        return item;
    }
}