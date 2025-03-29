import "@/assets/sass/style.scss";
import React from 'react';
import ListingHeader from "@/components/Theme/Listing/ListingHeader";
import ListingFooter from "@/components/Theme/Listing/ListingFooter";

function ListingLayoutFull({children}) {
    return (
        <div className="site-wrap">
            <ListingHeader/>
                {children}
            <ListingFooter/>
        </div>
    );
}

export default ListingLayoutFull;
