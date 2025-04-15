import React, { useContext, useEffect } from 'react';
import ListingsGrid from './grid/ListingsGrid';
import ListingsContainer from './ListingsContainer';
import ListingsProvider from './ListingsProvider';

function ListingsBlock(props) {
    return (
        <ListingsProvider>
            <ListingsContainer>
                <ListingsGrid {...props} />
            </ListingsContainer>
        </ListingsProvider>
    );
}

export default ListingsBlock;
