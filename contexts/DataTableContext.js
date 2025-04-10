import React from 'react'

export const dataTableContextData = {
    data: [],
    links: {},
    meta: {},
    modal: {
        show: false,
        title: '',
        footer: true,
        component: null,
        data: null,
        operation
    },
    refresh: () => {},
};

export const DataTableContext = React.createContext(dataTableContextData);
