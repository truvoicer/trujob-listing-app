import React from 'react';

export const twitterContextData = {
    appId: null,
    twitter: {},
    isSignedIn: false,
    handleIntent: () => {},
    errors: [],
    update: () => {},
    logout: () => {},
};
export const TwitterContext = React.createContext(twitterContextData);
