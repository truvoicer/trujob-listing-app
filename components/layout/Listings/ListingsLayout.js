import React from 'react';
import ListingsHeader from "@/components/layout/Listings/ListingsHeader";
import ListingsFooter from "@/components/layout/Listings/ListingsFooter";

function ListingsLayout({children}) {
    return (

        <div className="site-wrap">
            <ListingsHeader/>
                {children}
            <ListingsFooter/>
        </div>
    );
}

export default ListingsLayout;
