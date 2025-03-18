
import React, { useContext, useEffect, useState } from 'react';
import { ListingsContext, listingsContextData } from './contexts/ListingsContext';
import { Core } from '@/library/services/core/Core';
import { ListingsFetch } from '@/library/services/listings/ListingsFetch';
import { ContextService } from '@/library/services/context/ContextService';
import { StateService } from '@/library/services/state/StateService';

function ListingsProvider({
    children,
}) {
    const listingsContextState = useState({
        ...listingsContextData,
        update: (data) => {
            StateService.updateStateObject({
                data,
                setStateObj: StateService.getSetStateData(listingsContextState)
            })
        },
    });

    const core = Core.getInstance();
    const listingsService = core.getListingsService();
    listingsService.contextService.setDataStore(ContextService.DATA_STORE_STATE);
    listingsService.contextService.setContext(listingsContextState);
    

    async function initFetch() {
        const response = await listingsService.getFetchService().fetchListings();
        if (!response) {
            listingsService.contextService.updateContext({
                status: ListingsFetch.STATUS.ERROR
            });
            return;
        }
        console.log(response);
        listingsService.contextService.updateContext({
            status: ListingsFetch.STATUS.SUCCESS,
            results: response
        });
    }

    useEffect(() => {
        initFetch();
    }, []);
    
    return (
        <ListingsContext.Provider value={StateService.getStateData(listingsContextState)}>
            {children}
        </ListingsContext.Provider>
    );
}

export default ListingsProvider;
