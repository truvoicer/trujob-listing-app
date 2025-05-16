import { Toast, ToastContainer } from "react-bootstrap";
import { MessageService, MessageState } from "../message/MessageService";



export interface NotificationState extends MessageState {
    items: Array<NotificationItem>;
}
export type NotificationItem = {
    [key: string]: string | number | boolean | null | Function | undefined;
    variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
    type: string;
    position: 'top-start' | 'top-center' | 'top-end' | 'middle-start' | 'middle-center' |  'middle-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';
    id?: string | null;
    title: string | null;
    component: any;
    show: boolean;
    onOk: () => void;
    onCancel: () => void;
}
export class NotificationService extends MessageService {
    static INIT_DATA: NotificationState = {
        loaded: false,
        items: [],
        show: () => { },
        close: () => { },
        hide: () => { },
        update: () => { },
    };
    static INIT_ITEM_DATA: NotificationItem = {
        variant: 'info',
        type: 'toast',
        position: 'top-center',
        title: null,
        component: null,
        show: false,
        id: null,
        onOk: () => { },
        onCancel: () => { },
    };

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

    render() {
        const itemState = this.findStateData();
        if (!itemState) {
            console.log("state not found");
            return null;
        }
        return (
            <>
                {Array.isArray(itemState?.items) && itemState?.items.map((notification: NotificationItem, index: number) => {
                    if (!notification?.show) {
                        return null;
                    }
                    return (
                        <ToastContainer
                            key={index}
                            className="p-3"
                            position={notification?.position || 'top_center'}
                            style={{ zIndex: 9999 }}
                        >
                            <Toast
                                onClose={() => this.handleCancel(index)}
                                show={notification.show}
                                bg={notification?.variant || 'toast'}
                                animation={false}>
                                <Toast.Header>
                                    {/* <img
                                    src="holder.js/20x20?text=%20"
                                    className="rounded me-2"
                                    alt=""
                                /> */}
                                    <strong className="me-auto">{notification?.title || ''}</strong>
                                    {/* <small>11 mins ago</small> */}
                                </Toast.Header>
                                <Toast.Body>
                                    {notification?.component || ''}
                                </Toast.Body>
                            </Toast>
                        </ToastContainer>
                    );
                })}
            </>
        );
    }
}