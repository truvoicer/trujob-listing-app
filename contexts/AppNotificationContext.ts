import { NotificationService } from '@/library/services/notification/NotificationService'
import React from 'react'
export const AppNotificationContext = React.createContext(
    NotificationService.INIT_DATA
);
