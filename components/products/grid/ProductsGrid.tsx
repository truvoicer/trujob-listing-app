import React, { useContext, useEffect } from 'react';
import Sidebar from "@/components/products/sidebar/Sidebar";
import { ProductsContext } from '../contexts/ProductsContext';
import { Core } from '@/library/services/core/Core';
import { ProductsFetch } from '@/library/services/products/ProductsFetch';
import Pagination from '../Pagination';
import InfiniteScroll from '../InfiniteScroll';
import { BlockContext } from '@/contexts/BlockContext';

function ProductsGrid(props) {
    const productsContext = useContext(ProductsContext);
    const blockContext = useContext(BlockContext);
    
    const core = Core.getInstance();
    const productsService = core.getProductsService(productsContext);
    console.log(blockContext)
    function getContentClass() {
        let contentClass = 'col-12';
        if (blockContext?.has_sidebar) {
            contentClass = 'col-12 col-lg-8';
        }
        return contentClass;
    }
    function renderGrid() {
        return (
            <div className="site-section">
                <div className="container">
                    <div className="row">
                        <div className={getContentClass()}>
                            {productsService.contextService.context.status === ProductsFetch.STATUS.LOADING && (
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            )}
                            {productsService.contextService.context.status === ProductsFetch.STATUS.ERROR && (
                                <div className="alert alert-danger" role="alert">
                                    Failed to load products
                                </div>
                            )}
                            {productsService.contextService.context.status === ProductsFetch.STATUS.SUCCESS && (
                                <div className="row">
                                    {productsService.contextService.context.results.data.map((item, index) => {
                                        return (
                                            <div key={index} className={blockContext?.properties?.grid_item_class || 'col-12 col-lg-6'}>
                                                {productsService.getViewService().renderGridItem(
                                                    item?.type?.name,
                                                    item,
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        {blockContext?.has_sidebar && (
                            <div className="col-lg-3 ml-auto">
                                <Sidebar data={blockContext?.sidebar_widgets || []} />
                            </div>
                        )}

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

export default ProductsGrid;
