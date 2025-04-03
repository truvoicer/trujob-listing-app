import React from 'react'

export const appModalContextData = {
    modals: [],
    onCancel: () => {},
    show: () => {},
    hide: () => {},
};

export const appModalItemContextData = {
    id: null,
    component: null,
    title: null,
    show: true,
    showFooter: true,
};
export const AppModalContext = React.createContext(appModalContextData);
