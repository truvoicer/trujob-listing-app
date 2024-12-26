import React from 'react'

export const sessionContextData = {
    logout: () => {},
};
export const SessionContext = React.createContext(sessionContextData);
