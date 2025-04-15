import React from 'react'
import { ModalService } from '@/library/services/modal/ModalService';

export const dataTableContextData = {
    requestStatus: 'idle',
    data: [],
    links: {},
    meta: {},
    query: {},
    modal: {
        ...ModalService.INIT_CONTEXT_DATA,
    },
    refresh: () => {},
    update: () => {},
};

export const DataTableContext = React.createContext(dataTableContextData);
