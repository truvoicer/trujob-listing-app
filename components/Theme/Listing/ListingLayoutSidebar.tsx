
import "@/assets/sass/style.scss";
import React from 'react';
import ListingHeader from "@/components/Theme/Listing/ListingHeader";
import ListingFooter from "@/components/Theme/Listing/ListingFooter";

function ListingLayoutSidebar({ children }) {
    return (
        <div className="site-wrap">
            <ListingHeader />
            <div className="row">
                <div className="col-lg-8">
                    {children}
                </div>
                <div className="col-lg-4">
                    <h1>Sidebar</h1>
                </div>
            </div>
            <ListingFooter />
        </div>
    );
}

export default ListingLayoutSidebar;
