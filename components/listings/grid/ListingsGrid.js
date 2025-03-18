import React, { useContext, useEffect } from 'react';
import Sidebar from "@/components/listings/sidebar/Sidebar";
import ListingGridItem from "@/components/listings/grid/items/ListingGridItem";
import ListingsContainer from '../ListingsProvider';
import { ListingsContext } from '../contexts/ListingsContext';
import { Core } from '@/library/services/core/Core';
import { ListingsFetch } from '@/library/services/listings/ListingsFetch';

function ListingsGrid({
    title = 'Listings',
    subTitle = 'Choose product you want',
    sidebarData = [],
    itemContainerClass = 'col-lg-6',
}) {
    const listingsContext = useContext(ListingsContext);
    const core = Core.getInstance();
    const listingsService = core.getListingsService(listingsContext);
    
    console.log(listingsService.contextService.context.status, listingsContext);
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

                        <div className="col-12 mt-5 text-center">
                            <div className="custom-pagination">
                                <span>1</span>
                                <a href="#">2</a>
                                <a href="#">3</a>
                                <span className="more-page">...</span>
                                <a href="#">10</a>
                            </div>
                        </div>

                    </div>
                    <div className="col-lg-3 ml-auto">
                        <Sidebar data={sidebarData}/>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ListingsGrid;
