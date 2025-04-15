import { MessageService } from "../message/MessageService";
import { NOTIFICATION_DEFAULT_POSITION, NOTIFICATION_DEFAULT_TYPE } from "@/contexts/AppNotificationContext";

export type NotificationState = {
    [key: string]: Function | Array<NotificationItem>;
    notifications: Array<NotificationItem>;
    add: (data: any) => void;
    remove: (id: string) => void;
}
export type NotificationItem = {
    [key: string]: string | number | boolean | null | Function;
    variant: string;
    type: string;
    position: string;
    id: number|null;
    title: string|null;
    body: string|null;
    show: boolean;
    showFooter: boolean;
    onOk: () => void;
    onCancel: () => void;
}
export class NotificationService extends MessageService {
    static INIT_DATA: NotificationState = {
        notifications: [],
        add: () => {},
        remove: () => {}
    };
    static INIT_ITEM_DATA: NotificationItem = {
        variant: 'info',
        type: NOTIFICATION_DEFAULT_TYPE,
        position: NOTIFICATION_DEFAULT_POSITION,
        title: null,
        body: null,
        show: false,
        showFooter: true,
        id: null,
        onOk: () => {},
        onCancel: () => {},
    };

    
}