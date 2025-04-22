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

export const NOTIFICATION_DEFAULT_POSITION = NOTIFICATION_POSITION_TOP_CENTER;
export const NOTIFICATION_DEFAULT_TYPE = NOTIFICATION_TYPE_TOAST;
export const NOTIFICATION_DEFAULT_VARIANT = 'info';

export const AppNotificationContext = React.createContext(
    NotificationService.INIT_DATA
);
