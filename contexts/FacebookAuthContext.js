import React from 'react';

export const fbAuthContextData = {
    appId: null,
    fb: {},
    isSignedIn: false,
    errors: [],
    update: () => {},
    logout: () => {},
};
export const FbAuthContext = React.createContext(fbAuthContextData);
