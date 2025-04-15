import React from 'react'

export const appContextData = {
    contexts: {},
    updateAppContexts: () => {},
    updateData: () => {},
};
export const AppContext = React.createContext(appContextData);
