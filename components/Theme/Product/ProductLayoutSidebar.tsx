
import "@/assets/sass/style.scss";
import React from 'react';
import ProductHeader from "@/components/Theme/Product/ProductHeader";
import ProductFooter from "@/components/Theme/Product/ProductFooter";

function ProductLayoutSidebar({ children }) {
    return (
        <div className="site-wrap">
            <ProductHeader />
            <div className="row">
                <div className="col-lg-8">
                    {children}
                </div>
                <div className="col-lg-4">
                    <h1>Sidebar</h1>
                </div>
            </div>
            <ProductFooter />
        </div>
    );
}

export default ProductLayoutSidebar;
