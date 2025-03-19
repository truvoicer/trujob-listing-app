
import React, { useContext, useEffect } from 'react';
import { ListingsContext } from './contexts/ListingsContext';
import { Core } from '@/library/services/core/Core';
import ListingsProvider from './ListingsProvider';

function ListingsContainer({
    children,
}) {
    
    const core = Core.getInstance();
    const listingsContext = useContext(ListingsContext);
    const listingsService = core.getListingsService();
    const listingsContextState = listingsService.contextService.context;
    
    useEffect(() => {
        console.log('fetching');
        listingsContext.fetch();
    }, [listingsContext.query, listingsContext.post]);
    console.log('listingsContextState', listingsContext);
    return (
        <ListingsProvider>
            {children}
        </ListingsProvider>
    );
}

export default ListingsContainer;
