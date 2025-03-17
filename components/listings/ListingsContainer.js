
import React, { useEffect, useState } from 'react';
import { ListingsContext, listingsContextData } from './contexts/ListingsContext';

function ListingsContainer({
    children,
}) {
    const [listingsContextState, setListingsContextState] = useState({
        ...listingsContextData,
        update: (data) => {
            setListingsContextState(prevState => {
                let clonedState = {...prevState};
                Object.keys(data).forEach(key => {
                    if (!listingsContextData.hasOwnProperty(key)) {
                        console.warn(`Key ${key} not found in listingsContextData`);
                        return;
                    }
                    clonedState[key] = data[key];
                });
                return clonedState;
            });
        }
    });

    return (
        <ListingsContext.Provider value={listingsContextState}>
            {children}
        </ListingsContext.Provider>
    );
}

export default ListingsContainer;
