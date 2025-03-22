import React, { useContext, useEffect } from 'react';
import Sidebar from "@/components/listings/sidebar/Sidebar";
import { ListingsContext } from '../contexts/ListingsContext';
import { Core } from '@/library/services/core/Core';
import { ListingsFetch } from '@/library/services/listings/ListingsFetch';
import Pagination from '../Pagination';
import InfiniteScroll from '../InfiniteScroll';
import { BlockContext } from '@/contexts/BlockContext';

function ListingsGrid(props) {
    const listingsContext = useContext(ListingsContext);
    const blockContext = useContext(BlockContext);
    
    const core = Core.getInstance();
    const listingsService = core.getListingsService(listingsContext);
    console.log(blockContext)
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
                                            <div key={index} className={blockContext?.properties?.grid_item_class || 'col-12 col-lg-6'}>
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
                            <Sidebar data={[]} />
                        </div>

                    </div>
                </div>
            </div>
        );
    }
    return (
        <>
        {blockContext?.pagination && blockContext?.pagination_type === 'infinite-scroll' && (
            <InfiniteScroll>
                {renderGrid()}
            </InfiniteScroll>
        )}
        {!blockContext?.pagination && renderGrid()}
        {blockContext?.pagination && blockContext?.pagination_type === 'page' && (
            <Pagination>
                {renderGrid()}
            </Pagination>
        )}
        </>
    );
}

export default ListingsGrid;
