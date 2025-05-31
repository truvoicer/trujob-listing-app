import "@/assets/sass/style.scss";
import React from 'react';
import ProductHeader from "@/components/Theme/Product/ProductHeader";
import ProductFooter from "@/components/Theme/Product/ProductFooter";

function ProductLayoutFull({children}) {
    return (
        <div className="site-wrap">
            <ProductHeader/>
                {children}
            <ProductFooter/>
        </div>
    );
}

export default ProductLayoutFull;
