import React, { useContext, useEffect } from 'react';
import ProductsGrid from './grid/ProductsGrid';
import ProductsContainer from './ProductsContainer';
import ProductsProvider from './ProductsProvider';

function ProductsBlock(props) {
    return (
        <ProductsProvider>
            <ProductsContainer>
                <ProductsGrid {...props} />
            </ProductsContainer>
        </ProductsProvider>
    );
}

export default ProductsBlock;
