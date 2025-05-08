import React from 'react'
import { ModalService } from '@/library/services/modal/ModalService';
import { ConfirmationService } from '@/library/services/confirmation/ConfirmationService';
import { NotificationService } from '@/library/services/notification/NotificationService';

export const dataTableContextData = {
    requestStatus: 'idle',
    data: [],
    links: {},
    meta: {},
    query: {},
    post: {},
    modal: {
        ...ModalService.INIT_DATA,
    },
    // notification: {
    //     ...NotificationService.INIT_DATA,
    // },
    confirmation: {
        // ...ConfirmationService.INIT_DATA,
    },
    refresh: () => {},
    update: (data: any) => {},
};

export const DataTableContext = React.createContext(dataTableContextData);
