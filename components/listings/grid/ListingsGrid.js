import React, { useContext, useEffect } from 'react';
import Sidebar from "@/components/listings/sidebar/Sidebar";
import ListingGridItem from "@/components/listings/grid/items/ListingGridItem";
import ListingsContainer from '../ListingsProvider';
import { ListingsContext } from '../contexts/ListingsContext';
import { Core } from '@/library/services/core/Core';
import { ListingsFetch } from '@/library/services/listings/ListingsFetch';
import Pagination from '../Pagination';

function ListingsGrid({
    title = 'Listings',
    subTitle = 'Choose product you want',
    sidebarData = [],
    itemContainerClass = 'col-lg-6',
}) {
    const listingsContext = useContext(ListingsContext);
    const core = Core.getInstance();
    const listingsService = core.getListingsService(listingsContext);

    function renderGrid() {
        return (
            <div className="site-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            {listingsService.contextService.context.status === ListingsFetch.STATUS.LOADING && (
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            )}
                            {listingsService.contextService.context.status === ListingsFetch.STATUS.ERROR && (
                                <div className="alert alert-danger" role="alert">
                                    Failed to load listings
                                </div>
                            )}
                            {listingsService.contextService.context.status === ListingsFetch.STATUS.SUCCESS && (
                                <div className="row">
                                    {listingsService.contextService.context.results.data.map((item, index) => {
                                        return (
                                            <div key={index} className={itemContainerClass}>
                                                {listingsService.getViewService().renderGridItem(
                                                    item?.listingType?.slug,
                                                    item,
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}


                        </div>
                        <div className="col-lg-3 ml-auto">
                            <Sidebar data={sidebarData} />
                        </div>

                    </div>
                </div>
            </div>
        );
    }
    return (
        <>
            <Pagination>
                {renderGrid()}
            </Pagination>
        </>
    );
}

export default ListingsGrid;
