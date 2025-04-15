import React from 'react';

export const pinterestContextData = {
    appId: null,
    pinterest: {},
    pin: () => {},
    isSignedIn: false,
    handleIntent: () => {},
    errors: [],
    update: () => {},
    logout: () => {},
};
export const PinterestContext = React.createContext(pinterestContextData);
