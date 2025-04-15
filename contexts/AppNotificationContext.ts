import { NotificationService } from '@/library/services/notification/NotificationService'
import React from 'react'

export const NOTIFICATION_TYPE_TOAST = 'toast'
export const NOTIFICATION_TYPE_CONTENT = 'content'

export const NOTIFICATION_POSITION_TOP = 'top'
export const NOTIFICATION_POSITION_TOP_CENTER = 'top_center'
export const NOTIFICATION_POSITION_TOP_RIGHT = 'top_right'
export const NOTIFICATION_POSITION_TOP_LEFT = 'top_left'
export const NOTIFICATION_POSITION_BOTTOM = 'bottom'
export const NOTIFICATION_POSITION_BOTTOM_CENTER = 'bottom_center'
export const NOTIFICATION_POSITION_BOTTOM_RIGHT = 'bottom_right'
export const NOTIFICATION_POSITION_BOTTOM_LEFT = 'bottom_left'

export const notificationTypes = [
    NOTIFICATION_TYPE_TOAST,
    NOTIFICATION_TYPE_CONTENT
];
export const notificationPositions = [
    NOTIFICATION_POSITION_TOP,
    NOTIFICATION_POSITION_TOP_CENTER,
    NOTIFICATION_POSITION_TOP_RIGHT,
    NOTIFICATION_POSITION_TOP_LEFT,
    NOTIFICATION_POSITION_BOTTOM,
    NOTIFICATION_POSITION_BOTTOM_CENTER,
    NOTIFICATION_POSITION_BOTTOM_RIGHT,
    NOTIFICATION_POSITION_BOTTOM_LEFT,
];
export const NOTIFICATION_DEFAULT_POSITION = NOTIFICATION_POSITION_TOP_CENTER;
export const NOTIFICATION_DEFAULT_TYPE = NOTIFICATION_TYPE_TOAST;

export const notificationContextItem = {
    variant: 'info',
    type: NOTIFICATION_DEFAULT_TYPE,
    position: NOTIFICATION_DEFAULT_POSITION,
    title: null,
    body: null,
    show: false,
    showFooter: true,
    onCancel: () => {},
};

export function addNotificationItem({
    variant = 'info',
    type = NOTIFICATION_DEFAULT_TYPE,
    position = NOTIFICATION_DEFAULT_POSITION,
    title = null,
    body = null,
    showFooter = false,
    onCancel = () => {},
    notificationContext = null
}) {
    if (!notificationContext) {
        return;
    }
    notificationContext.add({
        variant,
        type,
        position,
        title,
        body,
        show: true,
        showFooter,
        onCancel,
    });
}
export const notificationVariants = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
];
export const AppNotificationContext = React.createContext(
    NotificationService.INIT_DATA
);
