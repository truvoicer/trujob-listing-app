import React, { useContext, useEffect } from 'react';
import ListingsGrid from './grid/ListingsGrid';
import ListingsProvider from './ListingsProvider';

function ListingsBlock(props) {
    return (
        <ListingsProvider>
            <ListingsGrid {...props} />
        </ListingsProvider>
    );
}

export default ListingsBlock;
