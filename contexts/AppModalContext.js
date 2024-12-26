import React from 'react'

export const appModalContextData = {
    component: null,
    title: null,
    show: false,
    showFooter: true,
    onCancel: () => {},
    showModal: () => {},
};
export const AppModalContext = React.createContext(appModalContextData);
