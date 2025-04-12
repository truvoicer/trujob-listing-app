import React from 'react'
import { ModalService } from '@/library/services/modal/ModalService';

export const dataTableContextData = {
    data: [],
    links: {},
    meta: {},
    searchParams: {
        page: 1,
        sort_order: 'asc',
        sort_by: null,
        query: null,
        page_size: null,
    },
    query: {},
    modal: {
        ...ModalService.INIT_CONTEXT_DATA,
    },
    refresh: () => {},
    update: () => {},
};

export const DataTableContext = React.createContext(dataTableContextData);
