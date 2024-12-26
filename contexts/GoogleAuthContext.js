import React from 'react';

export const googleAuthContextData = {
    clientId: null,
    google: {},
    isSignedIn: false,
    errors: [],
    update: () => {},
    logout: () => {},
};
export const GoogleAuthContext = React.createContext(googleAuthContextData);
