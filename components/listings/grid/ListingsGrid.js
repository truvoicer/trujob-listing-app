import React from 'react';
import Sidebar from "@/components/listings/sidebar/Sidebar";
import ListingGridItem from "@/components/listings/grid/items/ListingGridItem";

function ListingsGrid({
    title = 'Listings',
    subTitle = 'Choose product you want',
    sidebarData = [],
    itemContainerClass = 'col-lg-6',
}) {
    return (
        <>
            <div className="site-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">

                            <div className="row">
                                {Array.from({length: 6}).map((_, index) => {
                                    return (
                                        <div key={index} className={itemContainerClass}>
                                            <ListingGridItem/>
                                        </div>
                                    );
                                })}
                            </div>

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
        </>
    );
}

export default ListingsGrid;
